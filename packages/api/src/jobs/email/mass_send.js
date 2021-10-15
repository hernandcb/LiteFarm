const csv = require('csvtojson');
require('dotenv').config();
const { sendEmail, emails } = require('../../templates/sendEmailTemplate');
const path = require('path');
csv()
  .fromFile(path.join(__dirname, 'test.csv'))
  .then((json) => {
    return json.reduce((reducer, user) => ({
      ...reducer,
      [user.locale]: reducer[user.locale].concat(user.email),
    }), { en: [], es: [], pt: [] });
  }).then((recipients) => {
    const emailPromises = Object.keys(recipients).map((locale) => {
      return sendEmail(emails.Q3_2021_RELEASE, { locale }, null, { sender: 'system@litefarm.org' }, recipients[locale])
    })
    return Promise.all(emailPromises)
  }).then(() => {
    console.log('success!!')
  })