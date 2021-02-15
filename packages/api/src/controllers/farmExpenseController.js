/*
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 *  This file (farmExpenseController.js) is part of LiteFarm.
 *
 *  LiteFarm is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  LiteFarm is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details, see <https://www.gnu.org/licenses/>.
 */

const baseController = require('../controllers/baseController');
const farmExpenseModel = require('../models/farmExpenseModel');
const { transaction, Model } = require('objection');

class farmExpenseController extends baseController {

  static addFarmExpense() {
    return async (req, res) => {
      const trx = await transaction.start(Model.knex());
      try {
        const expenses = req.body;
        if(!Array.isArray(expenses)){
          res.status(400).send('needs to be an array of expense items')
        }
        const resultArray = [];
        const user_id = req.user.user_id
        for(let e of expenses){
          const result = await baseController.post(farmExpenseModel, e, trx, { user_id });
          resultArray.push(result)
        }
        await trx.commit();
        res.sendStatus(201);
      } catch (error) {
        //handle more exceptions
        await trx.rollback();
        res.status(400).send(error)
      }
    };
  }

  static getAllFarmExpense() {
    return async (req, res) => {
      try {
        const farm_id = req.params.farm_id;
        const rows = await farmExpenseController.getByForeignKey(farm_id);

      if (!rows.length) {
        res.sendStatus(404)
      }
      else {
        res.status(200).send(rows);
      }
    }
      catch (error) {
        //handle more exceptions
        res.status(400).json({
          error,
        });
      }
    }
  }

  static async getByForeignKey(farm_id) {
    const expenses = await farmExpenseModel.query().select('*').from('farmExpense').where('farmExpense.farm_id', farm_id).whereNotDeleted();
    return expenses;
  }

  static  delFarmExpense(){
    return async(req, res) => {
      const trx = await transaction.start(Model.knex());
      try{
        const isDeleted = await baseController.delete(farmExpenseModel, req.params.farm_expense_id, { user_id: req.user.user_id }, trx);
        await trx.commit();
        if(isDeleted){
          res.sendStatus(200);
        }
        else{
          res.sendStatus(404);
        }
      }
      catch (error) {
        await trx.rollback();
        res.status(400).json({
          error,
        });
      }
    }
  }
}

module.exports = farmExpenseController;
