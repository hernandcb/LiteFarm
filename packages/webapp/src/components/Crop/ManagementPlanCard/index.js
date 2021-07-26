import React from 'react';
import styles from './styles.module.scss';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Main } from '../../Typography';
import { ReactComponent as CalendarIcon } from '../../../assets/images/managementPlans/calendar.svg';
import { useTranslation } from 'react-i18next';
import { cropLocationByIdSelector } from '../../../selectors/cropLocation';
import { useSelector } from 'react-redux';

export default function PureManagementPlanCard ({
  plan,
  method,
}) {

  const { t } = useTranslation();

  const status = 'abandoned';

  const today = new Date();

  const transplant_date = plan.transplant_date;

  //const location = cropLocationByIdSelector(plan.location_id);

  return (
    <div className={styles.card}>
      <div 
        className={clsx({
          [styles.active]: status === 'active',
          [styles.completed]: status === 'completed',
          [styles.planned]: status === 'planned',
          [styles.abandoned]: status === 'abandoned',
        })}
      >
        <div className={styles.status}>{status}</div>
      </div>
      <Main
        style={{ marginTop: '12px', marginLeft: '12px', marginBottom: '4px' }}
      >
        {'Management Plan'}
      </Main>
      <div className={styles.location} style={{ marginLeft: '12px', marginBottom: '8px' }}>
        {'Field 1 | Row 1'}
      </div>
      <div className={styles.dateAndTasks} style={{ marginLeft: '13px' }}>
        <CalendarIcon className={styles.calendar}/>
        <div className={styles.dateAndTasksContent}>
          {'date'}
        </div>
        <div className={styles.icon} style={{ marginLeft: '9px' }}>
          <div className={styles.task}>{'44'}</div>
        </div>
        <div className={styles.dateAndTasksContent}>
          {'tasks'}
        </div>
      </div>
    </div>
  );
}


PureManagementPlanCard.prototype = {

};
