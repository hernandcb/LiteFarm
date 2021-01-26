import React, { Component } from 'react';
import { connect } from 'react-redux';
import PageTitle from '../../../components/PageTitle';
import DateContainer from '../../../components/Inputs/DateContainer';
import { actions, Control, Form } from 'react-redux-form';
import LogFooter from '../../../components/LogFooter';
import moment from 'moment';
import styles from '../styles.scss';
import { addLog } from '../Utility/actions';
import { getHarvestUseTypes } from '../actions';
import { convertToMetric, getUnit } from '../../../util';
import parseCrops from '../Utility/parseCrops';
import parseFields from '../Utility/parseFields';
import LogFormOneCrop from '../../../components/Forms/LogFormOneCrop';
import Unit from '../../../components/Inputs/Unit';
import { userFarmSelector } from '../../userFarmSlice';
import { withTranslation } from 'react-i18next';
import { fieldsSelector } from '../../fieldSlice';
import { currentFieldCropsSelector } from '../../fieldCropSlice';
import { getFieldCrops } from '../../saga';
import { setFormData, setFormValue } from '../actions';
import { formDataSelector, selectedUseTypeSelector, formValueSelector } from '../selectors';
import history from '../../../history';

class HarvestLog extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    const { farm, dispatch, history } = this.props;
    this.props.dispatch(actions.reset('logReducer.forms.harvestLog'));

    this.state = {
      date: moment(),
      quantity_unit: getUnit(farm, 'kg', 'lb'),
    };
    this.setDate = this.setDate.bind(this);
    dispatch(getFieldCrops());
  }

  setDate(date) {
    this.setState({
      date: date,
    });
  }

  handleSubmit(log) {
    console.log('handle submit');
    const { dispatch, fields } = this.props;
    const selectedCrops = parseCrops(log);
    const selectedFields = parseFields(log, fields);
    let formValue = {
      activity_kind: 'harvest',
      date: this.state.date,
      crops: selectedCrops,
      fields: selectedFields,
      notes: log.notes,
      quantity_kg: convertToMetric(log.quantity_kg, this.state.quantity_unit, 'kg'),
    };
    this.props.dispatch(setFormData(log));
    this.props.dispatch(setFormValue(formValue));
    dispatch(getHarvestUseTypes());
    this.props.history.push('/harvest_use_type');
    // dispatch(addLog(formValue));
  }

  handleBackButton() {
    console.log('back button');
    // console.log(this.props)
    // history.push('/new_log')
    // console.log(this.props)
    // this.props.history.push('/harvest_use_type')
  }

  render() {
    const { crops, fields } = this.props;
    return (
      <div className="page-container">
        <div className={styles.textContainer}>
          <PageTitle
            backUrl="/new_log"
            title={this.props.t('LOG_HARVEST.TITLE')}
            isHarvestLogStep={true}
          />
        </div>
        <DateContainer
          date={this.state.date}
          onDateChange={this.setDate}
          placeholder={this.props.t('LOG_COMMON.CHOOSE_DATE')}
        />
        <Form
          model="logReducer.forms"
          className={styles.formContainer}
          onSubmit={(val) => this.handleSubmit(val.harvestLog)}
        >
          <LogFormOneCrop model=".harvestLog" fields={fields} crops={crops} notesField={false} />
          <Unit
            model=".harvestLog.quantity_kg"
            title="Quantity"
            type={this.state.quantity_unit}
            validate
          />
          <div>
            <div className={styles.noteTitle}>{this.props.t('common:NOTES')}</div>
            <div className={styles.noteContainer}>
              <Control.textarea model=".harvestLog.notes" />
            </div>
          </div>
          <LogFooter
            backButtonName={'Cancel'}
            forwardButtonName={'Next'}
            history={this.props.history}
            backButtonClick={'/new_log'}
          />
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(HarvestLog));
