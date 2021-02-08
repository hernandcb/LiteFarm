import React, { Component } from 'react';
import { connect } from 'react-redux';
import PageTitle from '../../../components/PageTitle';
import DateContainer from '../../../components/Inputs/DateContainer';
import { actions, Control, Form } from 'react-redux-form';
import LogFooter from '../../../components/LogFooter';
import moment from 'moment';
import styles from '../styles.scss';
import { getHarvestUseTypes } from '../actions';
import { convertToMetric, getUnit, convertFromMetric, roundToTwoDecimal } from '../../../util';
import parseCrops from '../Utility/parseCrops';
import parseFields from '../Utility/parseFields';
import LogFormOneCrop from '../../../components/Forms/LogFormOneCrop';
import Unit from '../../../components/Inputs/Unit';
import { userFarmSelector } from '../../userFarmSlice';
import { withTranslation } from 'react-i18next';
import { fieldsSelector } from '../../fieldSlice';
import { currentFieldCropsSelector } from '../../fieldCropSlice';
import { getFieldCrops } from '../../saga';
import { setFormData, setFormValue, setDefaultDate } from '../actions';
import {
  formDataSelector,
  selectedUseTypeSelector,
  formValueSelector,
  defaultDateSelector,
  currentLogSelector,
  isEditSelector,
} from '../selectors';
import TextArea from '../../../components/Form/TextArea';

class HarvestLog extends Component {
  constructor(props) {
    super(props);
    const { farm, dispatch } = this.props;
    dispatch(actions.reset('logReducer.forms.harvestLog'));

    this.state = {
      date: moment(),
      quantity_unit: getUnit(farm, 'kg', 'lb'),
    };
    this.setDate = this.setDate.bind(this);
    this.setDefaultQuantity = this.setDefaultQuantity.bind(this);
    dispatch(getFieldCrops());

    // console.log(this.props.isEdit)
    // console.log(this.props.selectedLog)
    console.log('can we edit?');
    console.log(this.props.isEdit);
    console.log('default date');
    console.log(this.props.defaultDate);
    console.log('selected log');
    console.log(this.props.selectedLog);
  }

  setDate(date) {
    console.log('setDate');
    console.log(date);
    const { dispatch } = this.props;
    this.setState({
      date: date,
    });
    dispatch(setDefaultDate(date._i));
  }

  setDefaultQuantity() {
    if (this.state.quantity_unit === 'lb') {
      return roundToTwoDecimal(
        convertFromMetric(
          this.props.selectedLog.harvestLog.quantity_kg,
          this.state.quantity_unit,
          'kg',
        ),
      );
    }
    return roundToTwoDecimal(this.props.selectedLog.harvestLog.quantity_kg);
  }

  handleSubmit(log) {
    const { dispatch, fields } = this.props;
    const selectedCrops = parseCrops(log);
    const selectedFields = parseFields(log, fields);
    let formValue = this.props.isEdit
      ? {
          activity_id: this.props.selectedLog.activity_id,
          activity_kind: 'harvest',
          date: this.state.date,
          crops: selectedCrops,
          fields: selectedFields,
          notes: log.notes,
          quantity_kg: convertToMetric(log.quantity_kg, this.state.quantity_unit, 'kg'),
        }
      : {
          activity_kind: 'harvest',
          date: this.state.date,
          crops: selectedCrops,
          fields: selectedFields,
          notes: log.notes,
          quantity_kg: convertToMetric(log.quantity_kg, this.state.quantity_unit, 'kg'),
        };
    dispatch(setFormData(log));
    dispatch(setFormValue(formValue));
    this.props.history.push('/harvest_use_type');
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getHarvestUseTypes());
  }

  render() {
    const { crops, fields } = this.props;
    return (
      <div className="page-container">
        <PageTitle backUrl="/new_log" title={this.props.t('LOG_HARVEST.TITLE')} />
        <DateContainer
          date={this.props.isEdit ? moment(this.props.selectedLog.date) : this.state.date}
          onDateChange={this.setDate}
          placeholder={this.props.t('LOG_COMMON.CHOOSE_DATE')}
          // defaultDate={this.props.isEdit ? this.props.defaultDate : null}
          defaultDate={this.props.defaultDate}
        />
        <Form
          model="logReducer.forms"
          className={styles.formContainer}
          onSubmit={(val) => this.handleSubmit(val.harvestLog)}
        >
          <LogFormOneCrop
            model=".harvestLog"
            fields={fields}
            crops={crops}
            notesField={false}
            defaultField={
              this.props.isEdit ? this.props.selectedLog.field[0] : this.props.formData.field
            }
            defaultCrop={this.props.formData.crop}
            isEdit={this.props.isEdit}
          />
          <Unit
            model=".harvestLog.quantity_kg"
            title="Quantity"
            type={this.state.quantity_unit}
            validate
            isHarvestLog={true}
            defaultValue={
              this.props.isEdit ? this.setDefaultQuantity : this.props.formData.quantity_kg
            }
          />
          <div>
            <div className={styles.noteTitle}>{this.props.t('common:NOTES')}</div>
            <div className={styles.noteContainer}>
              <Control
                component={TextArea}
                model=".harvestLog.notes"
                defaultValue={
                  this.props.isEdit ? this.props.selectedLog.notes : this.props.formData.notes
                }
              />
            </div>
          </div>
          <LogFooter isHarvestLog={true} />
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    crops: currentFieldCropsSelector(state),
    fields: fieldsSelector(state),
    farm: userFarmSelector(state),
    formData: formDataSelector(state),
    useType: selectedUseTypeSelector(state),
    formValue: formValueSelector(state),
    defaultDate: defaultDateSelector(state),
    selectedLog: currentLogSelector(state),
    isEdit: isEditSelector(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(HarvestLog));
