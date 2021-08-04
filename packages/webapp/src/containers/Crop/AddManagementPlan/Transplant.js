import React from 'react';
import PureTransplant from '../../../components/Crop/Transplant';
import { cropVarietySelector } from '../../cropVarietySlice';
import { useSelector } from 'react-redux';
import { HookFormPersistProvider } from '../../hooks/useHookFormPersist/HookFormPersistProvider';

function TransplantForm({ history, match }) {
  const variety_id = match.params.variety_id;

  const { can_be_cover_crop } = useSelector(cropVarietySelector(variety_id));

  return (
    <HookFormPersistProvider>
      <PureTransplant
        can_be_cover_crop={can_be_cover_crop}
        onGoBack={() => {
          history.push(`/crop/${variety_id}/add_management_plan/planted_already`);
        }}
        onCancel={() => {
          history.push(`/crop/${variety_id}/management`);
        }}
        match={match}
        history={history}
      />
    </HookFormPersistProvider>
  );
}

export default TransplantForm;
