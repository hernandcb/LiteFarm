import React, { useEffect, useState } from 'react';
import PureHarvestAllocation from '../../../components/Logs/HarvestAllocation';
import {
  harvestLogDataSelector,
  harvestFormDataSelector,
  harvestLogData,
  canEditStepThree,
  canEditStepThreeSelector,
  canEditSelector,
  canConvertQuantitySelector,
  canConvertQuantity,
} from '../Utility/logSlice';
import { useDispatch, useSelector } from 'react-redux';
import history from '../../../history';
import { userFarmSelector } from '../../userFarmSlice';
import { convertToMetric, getUnit } from '../../../util';
import { addLog, editLog } from '../Utility/actions';
import { currentLogSelector } from '../selectors';
import { setSelectedLog } from '../actions';

function HarvestAllocation() {
  const dispatch = useDispatch();
  const farm = useSelector(userFarmSelector);
  let [unit, setUnit] = useState(getUnit(farm, 'kg', 'lb'));
  const defaultData = useSelector(harvestLogDataSelector);
  const formData = useSelector(harvestFormDataSelector);
  const isEditStepThree = useSelector(canEditStepThreeSelector);
  const selectedLog = useSelector(currentLogSelector);
  const isEdit = useSelector(canEditSelector);
  const convertQuantity = useSelector(canConvertQuantitySelector);

  useEffect(() => {
    if (isEditStepThree.isEditStepThree && unit === 'lb') {
      dispatch(canConvertQuantity(true));
    }
  }, []);

  const onBack = (data) => {
    dispatch(canEditStepThree(false));
    history.push('/harvest_use_type');
  };

  const onNext = (data) => {
    const tempProps = {};
    tempProps.activity_kind = formData.activity_kind;
    tempProps.date = formData.date;
    tempProps.crops = [{ field_crop_id: formData.crops.value }];
    tempProps.fields = [{ field_id: formData.fields.value }];
    tempProps.notes = defaultData.defaultNotes;
    tempProps.quantity_kg =
      unit === 'lb'
        ? convertToMetric(defaultData.defaultQuantity, unit, 'kg')
        : defaultData.defaultQuantity;

    const useTypes = data.selectedUseTypes;
    defaultData.selectedUseTypes = useTypes;
    dispatch(harvestLogData(defaultData));
    if (isEdit.isEdit) {
      tempProps.activity_id = selectedLog.activity_id;
      setTimeout(() => {
        dispatch(editLog(tempProps));
      }, 300);
      dispatch(canEditStepThree(false));
    } else {
      dispatch(addLog(tempProps));
    }
  };

  return (
    <>
      <PureHarvestAllocation
        onGoBack={onBack}
        onNext={onNext}
        defaultData={defaultData}
        unit={unit}
        isEdit={isEditStepThree}
        selectedLog={selectedLog}
        setSelectedLog={setSelectedLog}
        dispatch={dispatch}
        canConvertQuantity={canConvertQuantity}
        convertQuantity={convertQuantity}
      />
    </>
  );
}

export default HarvestAllocation;
