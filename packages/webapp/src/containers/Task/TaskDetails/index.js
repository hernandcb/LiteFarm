import PureTaskDetails from '../../../components/Task/PureTaskDetails';
import { HookFormPersistProvider } from '../../hooks/useHookFormPersist/HookFormPersistProvider';
import { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../saga';
import { productEntitiesSelector } from '../../productSlice';
import { taskTypeIdNoCropsSelector, taskTypeSelector } from '../../taskTypeSlice';
import { hookFormPersistSelector } from '../../hooks/useHookFormPersist/hookFormPersistSlice';
import { userFarmSelector } from '../../userFarmSlice';
import { certifierSurveySelector } from '../../OrganicCertifierSurvey/slice';
import { useManagementPlanTilesByLocationIds } from '../TaskCrops/useManagementPlanTilesByLocationIds';

function TaskDetails({ history, match }) {
  const continuePath = '/add_task/task_assignment';
  const goBackPath = '/add_task/task_locations';
  const dispatch = useDispatch();
  const {
    country_id,
    units: { measurement: system },
  } = useSelector(userFarmSelector);
  const { interested, farm_id } = useSelector(certifierSurveySelector, shallowEqual);
  const persistedFormData = useSelector(hookFormPersistSelector);
  const products = useSelector(productEntitiesSelector);
  const taskTypesBypassCrops = useSelector(taskTypeIdNoCropsSelector);
  const selectedTaskType = useSelector(taskTypeSelector(persistedFormData.task_type_id));
  const locations = persistedFormData.locations;
  const managementPlans = persistedFormData.managementPlans?.map(
    ({ management_plan_id }) => management_plan_id,
  );
  const managementPlanByLocations = useManagementPlanTilesByLocationIds(locations, managementPlans);

  const persistedPaths = [goBackPath, continuePath, '/add_task/task_crops'];

  const handleGoBack = () => {
    taskTypesBypassCrops.includes(persistedFormData.task_type_id)
      ? history.push('/add_task/task_locations')
      : history.push('/add_task/task_crops');
  };

  const handleCancel = () => {
    history.push('/tasks');
  };

  const onSubmit = () => {
    history.push('/add_task/task_assignment');
  };

  const onError = () => {};

  useEffect(() => {
    dispatch(getProducts());
  }, []);

  return (
    <HookFormPersistProvider>
      <PureTaskDetails
        handleCancel={handleCancel}
        handleGoBack={handleGoBack}
        onError={onError}
        onSubmit={onSubmit}
        persistedPaths={persistedPaths}
        selectedTaskType={selectedTaskType}
        system={system}
        products={products}
        farm={{ farm_id, country_id, interested }}
        managementPlanByLocations={managementPlanByLocations}
      />
    </HookFormPersistProvider>
  );
}

export default TaskDetails;
