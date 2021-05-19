const CropVarietyModel = require('../models/cropVarietyModel');
const CropModel = require('../models/cropModel');
const nutrients = [ 'protein', 'lipid', 'ph', 'energy', 'ca', 'fe', 'mg', 'k', 'na', 'zn', 'cu',
  'mn', 'vita_rae', 'vitc', 'thiamin', 'riboflavin', 'niacin', 'vitb6', 'folate', 'vitb12', 'nutrient_credits']
const baseController = require('./baseController');
const { transaction, Model,} = require('objection');
const cropVarietyController = {
  getCropVarietiesByFarmId() {
    return async (req, res, next) => {
      const { farm_id } = req.params;
      try {
        const result = await CropVarietyModel.query().whereNotDeleted().withGraphFetched('[crop]').where({ farm_id });
        return result?.length ? res.status(200).send(result) : res.status(404).send('Crop variety not found');
      } catch (error) {
        return res.status(400).json({ error });
      }
    };
  },
  getCropVarietyByCropVarietyId() {
    return async (req, res, next) => {
      const { crop_variety_id } = req.params;
      try {
        const result = await CropVarietyModel.query().whereNotDeleted().withGraphFetched('[crop]').findById(crop_variety_id);
        return result ? res.status(200).send(result) : res.status(404).send('Crop variety not found');
      } catch (error) {
        return res.status(400).json({ error });
      }
    };
  },
  deleteCropVariety() {
    return async (req, res, next) => {
      const { crop_variety_id } = req.params;
      try {
        const result = await CropVarietyModel.query().context(req.user).findById(crop_variety_id).delete();
        return result ? res.sendStatus(200) : res.status(404).send('Crop variety not found');
      } catch (error) {
        console.log(error);
        return res.status(400).json({ error });
      }
    };
  },
  createCropVariety() {
    return async (req, res, next) => {
      try {
        const { crop_id } = req.body;
        console.log(req.user);
        const relatedCrop = await CropModel.query().where({ crop_id });
        const cropData = nutrients.reduce((obj, k) => ({ ...obj, [k]: relatedCrop[k] }), {});
        const result = await CropVarietyModel.query().context(req.user).insert({ ...req.body, ...cropData });
        return res.status(201).json(result);
      } catch (error) {
        return res.status(400).json({ error });
      }
    };
  },
  updateCropVariety() {
    return async (req, res, next) => {
      const { crop_variety_id } = req.params;
      try {
        const result = await CropVarietyModel.query().context(req.user).findById(crop_variety_id).patch(req.body);
        return result ? res.status(200).json(result) : res.status(404).send('Crop variety not found');
      } catch (error) {
        console.log(error);
        return res.status(400).send({ error });
      }
    };
  },
  createCustomCropAndVariety() {
    return async (req, res, next) => {
      const trx = await transaction.start(Model.knex());
      try {
        const { custom_crop } = req.body;
        if (!custom_crop) {
          await trx.rollback();
          return res.status(400).send('No custom crop');
        }
        const { custom_crop_variety } = req.body;
        if (!custom_crop_variety) {
          await trx.rollback();
          return res.status(400).send('No custom crop variety');
        }

        custom_crop.user_added = true;
        custom_crop.crop_translation_key = custom_crop.corp_common_name;

        const crop_result = await baseController.postWithResponse(CropModel, custom_crop, req, {trx});
        
        const { crop_id } = crop_result;
        const cropData = nutrients.reduce((obj, k) => ({ ...obj, [k]: custom_crop[k] }), {});
        custom_crop_variety.crop_id = crop_id;
        const variety_result = await CropVarietyModel.query().context(req.user).insert({ ...custom_crop_variety, ...cropData });

        await trx.commit();
        return res.status.send(201).json({custom_crop: crop_result, 
          custom_crop_variety: variety_result});
      } catch (error) {
          await trx.rollback();
          res.status(400).json({
            error,
          });
          console.log(error);
      }
    }
  }
};
module.exports = cropVarietyController;
