/* eslint-disable */
import React from 'react';
import { Fieldset, Control, actions, Errors } from 'react-redux-form';
import DropDown from '../../Inputs/DropDown';
import styles from '../../../containers/Log/styles.scss';
import { connect } from 'react-redux';
import moment from 'moment';
import { Alert } from 'react-bootstrap';
import { fieldsSelector } from '../../../containers/fieldSlice';
import { getFieldCrops, getFields } from '../../../containers/saga';
import { currentFieldCropsSelector } from '../../../containers/fieldCropSlice';
import { withTranslation } from 'react-i18next';
import { formDataSelector } from '../../../containers/Log/selectors';
import { setFormData } from '../../../containers/Log/actions';

class LogFormOneCrop extends React.Component {
  constructor(props) {
    super(props);
    const { selectedFields, selectedCrops, dispatch, parent, model } = this.props;

    dispatch(setFormData(this.props.formData));
    console.log('form data inside log form');
    console.log(this.props.formData);
    dispatch(getFieldCrops());
    dispatch(getFields());

    let selectedCropsMap = {};
    // this is only called if DefaultLogForm is in an edit form
    if (selectedCrops) {
      selectedCrops.forEach((sc) => {
        if (!selectedCropsMap[sc.field_id]) {
          selectedCropsMap[sc.field_id] = [];
        }
        selectedCropsMap[sc.field_id].push(sc);
      });
    }

    let currentSelectedField = selectedFields ? selectedFields[0] : null;
    this.state = {
      cropOptionsMap: {},
      selectedCropsMap,
      selectedFields: currentSelectedField,
      cropValue: null,
      crops: [],
      fieldOptions: [],
      displayLiveCropMessage: false,
      savedState: {
        field: this.props.formData.field,
        crop: this.props.formData.crop,
      },
    };
    this.setCropsOnFieldSelect = this.setCropsOnFieldSelect.bind(this);
    this.setDefaultCrop = this.setDefaultCrop.bind(this);

    if (this.props.formData.field) {
      this.setCropsOnFieldSelect(this.props.formData.field);
    }

    if (selectedFields) {
      this.setCropsOnFieldSelect(selectedFields[0]);
      Object.keys(this.state.selectedCropsMap).forEach((k) => {
        dispatch(actions.change(`${parent}${model}.crop.${k}`, this.state.selectedCropsMap[k]));
      });
    }
  }

  hasSameCrop = (fieldCrop) => {
    const { crops } = this.state;

    for (let c of crops) {
      if (c.field_crop_id !== fieldCrop.field_crop_id && c.crop_id === fieldCrop.crop_id) {
        return true;
      }
    }
    return false;
  };

  setCropsOnFieldSelect(option) {
    console.log('setCropsOnFieldSelect');
    const { fields, parent, model } = this.props;
    let { crops } = this.state;
    let cropOptionsMap = this.state.cropOptionsMap;

    // remove associated crop selections for field if field is removed from dropdown
    const activeFields = [option.value];
    const removedFields = fields.filter((f) => activeFields.indexOf(f.field_id) === -1);
    removedFields &&
      removedFields.map((rm) => {
        return this.props.dispatch(actions.reset(`${parent}${model}.crop.${rm.field_id}`));
      });
    // map field_crops to fields that are selected in dropdown
    cropOptionsMap[option.value] = crops
      .filter((c) => c.field_id === option.value)
      .map((c) => {
        let hasDup = this.hasSameCrop(c);
        if (hasDup) {
          return {
            value: c.field_crop_id,
            label:
              this.props.t(`crop:${c.crop_translation_key}`) +
              `(${moment(c.start_date).format('YYYY-MM-DD')})`,
          };
        } else
          return {
            value: c.field_crop_id,
            label: this.props.t(`crop:${c.crop_translation_key}`),
          };
      });

    this.setState({
      selectedFields: option,
      cropOptionsMap,
      fieldSelected: true,
      cropValue: undefined,
    });
  }

  setDefaultCrop(option) {
    return {
      value: option.value,
      label: option.label,
    };
  }

  componentDidMount() {
    const { model, parent } = this.props;

    // if 'all' is selected in fields dropdown, set field in redux state with all field options instead of option 'all'
    this.filterLiveCrops();
    this.props.dispatch(actions.change(`${parent}${model}.field`, this.state.selectedFields));
  }

  filterLiveCrops = () => {
    const crops = this.props.crops;
    const fields = this.props.fields;
    const model = this.props.model;
    let filtered = [];

    for (let crop of crops) {
      if (moment().isBefore(moment(crop.end_date))) {
        filtered.push(crop);
      }
    }

    let displayLiveCropMessage = false;

    if (model === '.harvestLog') {
      if (filtered.length < 1) {
        displayLiveCropMessage = true;
      }
    }

    this.setState({
      crops: filtered,
      displayLiveCropMessage,
    });
    this.filterFieldOptions(filtered, fields);
  };

  filterFieldOptions = (crops, fields) => {
    let included = [];
    let filteredFields = [];
    if (fields && crops) {
      for (let c of crops) {
        if (!included.includes(c.field_id)) {
          included.push(c.field_id);
          filteredFields.push({ value: c.field_id, label: c.field_name });
        }
      }
    }

    this.setState({
      fieldOptions: filteredFields,
    });
  };

  render() {
    const {
      model,
      notesField,
      typeField,
      typeOptions,
      customFieldset,
      isCropNotRequired,
    } = this.props;
    const { displayLiveCropMessage, fieldOptions } = this.state;
    let crop_id;
    this.state.savedState.crop
      ? (crop_id = Object.keys(this.state.savedState.crop))
      : (crop_id = null);
    if (Object.entries(this.props.formData.field).length !== 0) {
      this.state.selectedFields = this.props.formData.field;
      console.log(this.state.cropOptionsMap[this.state.selectedFields.value]);
    }

    // format options for react-select dropdown components
    const parsedTypeOptions = typeOptions && typeOptions.map((t) => ({ value: t, label: t }));
    const defaultSelectedFields = this.state.selectedFields;

    return (
      <Fieldset model={model}>
        {displayLiveCropMessage && (
          <Alert variant="warning">
            To use this type of log please add crops to fields. You can do this by navigating to
            Fields -> Your field -> New Field Crop
          </Alert>
        )}
        <div className={styles.defaultFormDropDown}>
          <label>Field</label>
          <Control
            model=".field"
            onChange={this.setCropsOnFieldSelect}
            component={DropDown}
            options={fieldOptions || []}
            placeholder="Select Field"
            isSearchable={false}
            defaultValue={
              this.state.savedState.field ? this.state.savedState.field : defaultSelectedFields
            }
            validators={{
              required: (val) => {
                if (val) {
                  return true;
                }
              },
            }}
          />
          <Errors
            className="required"
            model=".field"
            show={{ touched: true, focus: false }}
            messages={{
              required: 'Required',
            }}
          />
        </div>
        {!isCropNotRequired && this.state.selectedFields && (
          <div className={styles.defaultFormDropDown}>
            <label>Crop</label>
            <Control
              model={`.crop.${this.state.selectedFields.value}`}
              component={DropDown}
              options={this.state.cropOptionsMap[this.state.selectedFields.value]}
              placeholder="Select Field Crop"
              defaultValue={this.props.formData.crop[crop_id[0]]}
              isSearchable={false}
              validators={
                isCropNotRequired
                  ? {}
                  : {
                      required: (val) => {
                        if (val) {
                          return true;
                        }
                      },
                    }
              }
            />
            <Errors
              className="required"
              model={`.crop.${this.state.selectedFields.value}`}
              show={{ touched: true, focus: false }}
              messages={{
                required: 'Required',
              }}
            />
          </div>
        )}
        {typeField && (
          <div className={styles.defaultFormDropDown}>
            <label>Type</label>
            <Control
              model=".type"
              component={DropDown}
              options={parsedTypeOptions || []}
              placeholder="select type"
            />
          </div>
        )}
        {customFieldset && customFieldset()}
        {notesField && (
          <div>
            <div className={styles.noteTitle}>Notes</div>
            <div className={styles.noteContainer}>
              <Control.textarea model=".notes" />
            </div>
          </div>
        )}
      </Fieldset>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

const mapStateToProps = (state) => {
  return {
    crops: currentFieldCropsSelector(state),
    fields: fieldsSelector(state),
    formData: formDataSelector(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(LogFormOneCrop));
