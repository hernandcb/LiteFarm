import PurePlantInContainer from '../../../../components/Crop/PlantInContainer';
import { useSelector } from 'react-redux';
import { measurementSelector } from '../../../userFarmSlice';
import { HookFormPersistProvider } from '../../../hooks/useHookFormPersist/HookFormPersistProvider';
import { cropVarietyByID } from '../../../cropVarietySlice';

export default function PlantInContainer({ history, match }) {
  const system = useSelector(measurementSelector);
  const crop_variety = useSelector(cropVarietyByID(match.params.variety_id));
  const isInitialPlantingManagementPlan =
    match?.path === '/crop/:variety_id/add_management_plan/transplant_container';

  return (
    <HookFormPersistProvider>
      <PurePlantInContainer
        match={match}
        history={history}
        system={system}
        crop_variety={crop_variety}
        isInitialPlantingManagementPlan={isInitialPlantingManagementPlan}
      />
    </HookFormPersistProvider>
  );
}
