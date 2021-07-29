import React, { useEffect, useState} from 'react';
import PureTaskAssignment from '../../../components/AddTask/PureTaskAssignment';
import { loginSelector, userFarmEntitiesSelector, userFarmSelector } from '../../userFarmSlice';
import { useSelector } from 'react-redux';
import grabCurrencySymbol from '../../../util/grabCurrencySymbol';
import { getCurrencyFromStore } from '../../../util/getFromReduxStore';
import { HookFormPersistProvider } from '../../hooks/useHookFormPersist/HookFormPersistProvider';

function TaskManagement({ history, match }) {
  const userFarms = useSelector(userFarmEntitiesSelector);
  const { farm_id } = useSelector(loginSelector);
  const userFarm = useSelector(userFarmSelector);
  const users = userFarms[farm_id];
  const userData = Object.values(users);
  const [options, setOptions] = useState([{ label: 'Unassigned', value: null }]);
  const [wageData, setWageData] = useState([]);
  const [isFarmWorker] = useState(userFarm.role_id === 3);
  const currencySymbol = grabCurrencySymbol(getCurrencyFromStore());
  const worker = users[userFarm.user_id];

  useEffect(() => {
    let wage_data = [];
    let innerOptions = [];
    if (userFarm.role_id === 3) {
      let obj = { label: worker.first_name + ' ' + worker.last_name, value: worker.user_id };
      let wageObj = {
        [worker.user_id]: {
          currency: worker.units.currency,
          hourly_wage: worker.wage.amount,
          currencySymbol: currencySymbol,
        },
      };
      innerOptions.push(obj);
      wage_data.push(wageObj);
    } else {
      for (let i = 0; i < userData.length; i++) {
        let obj = {
          label: userData[i].first_name + ' ' + userData[i].last_name,
          value: userData[i].user_id,
        };
        innerOptions.push(obj);
        let wageObj = {
          [userData[i].user_id]: {
            currency: userData[i].units.currency,
            hourly_wage: userData[i].wage.amount,
            currencySymbol: currencySymbol,
          },
        };
        wage_data.push(wageObj);
      }
    }
    setOptions(innerOptions);
    setWageData(wage_data);
  }, [])


  const onSubmit = () => {
    console.log('onSave called');
  };
  const handleGoBack = () => {
    history.push('/add_task/task_notes');
  };
  const handleCancel = () => {
    console.log('handleCancel called');
  };
  const onError = () => {
    console.log('onError called');
  };

  return (
    <HookFormPersistProvider>
      <PureTaskAssignment
        onSubmit={onSubmit}
        handleGoBack={handleGoBack}
        handleCancel={handleCancel}
        onError={onError}
        userFarmOptions={options}
        wageData={wageData}
        isFarmWorker={isFarmWorker}
        currencySymbol={currencySymbol}
        persistPaths={[]}
      />
    </HookFormPersistProvider>
  );
}

export default TaskManagement;
