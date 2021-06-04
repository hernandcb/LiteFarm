import { useSelector } from 'react-redux';
import { hookFormPersistSelector } from '../../../hooks/useHookFormPersist/hookFormPersistSlice';
import useHookFormPersist from '../../../hooks/useHookFormPersist';
import PurePlantingMethod from '../../../../components/Crop/PlantingMethod';

export default function PlantingDate({ history, match }) {
  const persistedFormData = useSelector(hookFormPersistSelector);

  return (
    <PurePlantingMethod
      useHookFormPersist={useHookFormPersist}
      persistedFormData={persistedFormData}
      match={match}
      history={history}
    />
  );
}
