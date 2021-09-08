import React from 'react';
import {
  hookFormPersistSelector,
  setManagementPlansData,
} from '../../hooks/useHookFormPersist/hookFormPersistSlice';
import { useDispatch, useSelector } from 'react-redux';
import PureTaskLocations from '../../../components/Task/TaskLocations';
import { taskTypeIdNoCropsSelector } from '../../taskTypeSlice';
import { HookFormPersistProvider } from '../../hooks/useHookFormPersist/HookFormPersistProvider';
import { userFarmSelector } from '../../userFarmSlice';
import {
  cropLocationEntitiesSelector,
  cropLocationsSelector,
  locationsSelector,
} from '../../locationSlice';
import { useActiveAndCurrentManagementPlanTilesByLocationIds } from '../TaskCrops/useManagementPlanTilesByLocationIds';
import { useIsTaskType } from '../useIsTaskType';
import { useTranslation } from 'react-i18next';

export default function TaskLocationsSwitch({ history, match }) {
  const isCropLocation = useIsTaskType('HARVEST_TASK');
  const isTransplantLocation = useIsTaskType('TRANSPORT_TASK');
  if (isCropLocation) {
    return <TaskActiveAndPlannedCropLocations history={history} />;
  } else if (isTransplantLocation) {
    return <TaskTransplantLocations history={history} />;
  } else {
    return <TaskAllLocations history={history} />;
  }
}

function TaskActiveAndPlannedCropLocations({ history }) {
  const cropLocations = useSelector(cropLocationsSelector);
  const cropLocationEntities = useSelector(cropLocationEntitiesSelector);
  const cropLocationsIds = cropLocations.map(({ location_id }) => ({ location_id }));
  const activeAndPlannedLocationsIds = Object.keys(
    useActiveAndCurrentManagementPlanTilesByLocationIds(cropLocationsIds),
  );
  const activeAndPlannedLocations = activeAndPlannedLocationsIds.map(
    (location_id) => cropLocationEntities[location_id],
  );

  const onContinue = () => {
    history.push('/add_task/task_crops');
  };

  const onGoBack = () => {
    history.push('/add_task/task_date');
  };
  return (
    <TaskLocations
      locations={activeAndPlannedLocations}
      history={history}
      onContinue={onContinue}
      onGoBack={onGoBack}
    />
  );
}

function TaskTransplantLocations({ history }) {
  const { t } = useTranslation();
  const cropLocations = useSelector(cropLocationsSelector);
  const onContinue = () => {
    history.push('/add_task/planting_method');
  };

  const onGoBack = () => {
    history.push('/add_task/task_crops');
  };
  return (
    <TaskLocations
      locations={cropLocations}
      history={history}
      isMulti={false}
      title={t('TASK.TRANSPLANT_LOCATIONS')}
      onContinue={onContinue}
      onGoBack={onGoBack}
    />
  );
}

function TaskAllLocations({ history }) {
  const dispatch = useDispatch();
  const locations = useSelector(locationsSelector);
  const persistedFormData = useSelector(hookFormPersistSelector);
  const taskTypesBypassCrops = useSelector(taskTypeIdNoCropsSelector);

  const onContinue = () => {
    if (taskTypesBypassCrops.includes(persistedFormData.task_type_id)) {
      dispatch(setManagementPlansData([]));
      return history.push('/add_task/task_details');
    }
    history.push('/add_task/task_crops');
  };

  const onGoBack = () => {
    history.push('/add_task/task_date');
  };
  return (
    <TaskLocations
      locations={locations}
      history={history}
      onGoBack={onGoBack}
      onContinue={onContinue}
    />
  );
}

function TaskLocations({ history, locations, isMulti, title, onContinue, onGoBack }) {
  const onCancel = () => {
    history.push('/tasks');
  };
  const { grid_points } = useSelector(userFarmSelector);

  return (
    <HookFormPersistProvider>
      <PureTaskLocations
        onCancel={onCancel}
        onContinue={onContinue}
        onGoBack={onGoBack}
        farmCenterCoordinate={grid_points}
        locations={locations}
        isMulti={isMulti}
        title={title}
      />
    </HookFormPersistProvider>
  );
}
