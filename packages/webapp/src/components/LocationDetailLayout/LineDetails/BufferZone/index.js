import React from 'react';
import { useTranslation } from 'react-i18next';
import LineDetails from '../index';
import { useForm } from 'react-hook-form';
import { bufferZoneEnum } from '../../../../containers/constants';
import Unit from '../../../Form/Unit';
import { area_total_area, line_width } from '../../../../util/unit';
import LocationButtons from '../../LocationButtons';

import Form from '../../../Form';
import LocationPageHeader from '../../LocationPageHeader';
import RouterTab from '../../../RouterTab';
import { PersistedFormWrapper } from '../../PersistedFormWrapper';
import { getFormDataWithoutNulls } from '../../../../containers/hooks/useHookFormPersist/utils';

export default function PureBufferZoneWrapper(props) {
  return (
    <PersistedFormWrapper>
      <PureBufferZone {...props} />
    </PersistedFormWrapper>
  );
}
export function PureBufferZone({
  history,
  match,
  submitForm,
  system,
  isCreateLocationPage,
  isViewLocationPage,
  isEditLocationPage,
  persistedFormData,
  useHookFormPersist,
  handleRetire,
  isAdmin,
}) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    control,
    watch,

    formState: { isValid, isDirty, errors },
  } = useForm({
    mode: 'onChange',
    shouldUnregister: true,
    defaultValues: persistedFormData,
  });

  const { historyCancel } = useHookFormPersist?.(getValues) || {};

  const onError = (data) => {};
  const disabled = !isValid;
  const onSubmit = (data) => {
    const formData = getFormDataWithoutNulls({
      ...persistedFormData,
      ...data,
      type: 'buffer_zone',
    });
    formData[bufferZoneEnum.width_unit] = formData[bufferZoneEnum.width_unit]?.value;
    formData[bufferZoneEnum.length_unit] = formData[bufferZoneEnum.length_unit]?.value;
    formData[bufferZoneEnum.total_area_unit] = formData[bufferZoneEnum.total_area_unit]?.value;
    submitForm({ formData });
  };

  const title =
    (isCreateLocationPage && t('FARM_MAP.BUFFER_ZONE.TITLE')) ||
    (isEditLocationPage && t('FARM_MAP.BUFFER_ZONE.EDIT_TITLE')) ||
    (isViewLocationPage && persistedFormData.name);

  return (
    <Form
      buttonGroup={
        <LocationButtons
          disabled={disabled}
          isCreateLocationPage={isCreateLocationPage}
          isViewLocationPage={isViewLocationPage}
          isEditLocationPage={isEditLocationPage}
          onEdit={() => history.push(`/buffer_zone/${match.params.location_id}/edit`)}
          onRetire={handleRetire}
          isAdmin={isAdmin}
        />
      }
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <LocationPageHeader
        title={title}
        isCreateLocationPage={isCreateLocationPage}
        isViewLocationPage={isViewLocationPage}
        isEditLocationPage={isEditLocationPage}
        history={history}
        match={match}
        onCancel={historyCancel}
      />
      {isViewLocationPage && (
        <RouterTab
          classes={{ container: { margin: '6px 0 26px 0' } }}
          history={history}
          match={match}
          tabs={[
            {
              label: t('FARM_MAP.TAB.CROPS'),
              path: `/buffer_zone/${match.params.location_id}/crops`,
            },
            {
              label: t('FARM_MAP.TAB.DETAILS'),
              path: `/buffer_zone/${match.params.location_id}/details`,
            },
          ]}
        />
      )}
      <LineDetails
        name={t('FARM_MAP.BUFFER_ZONE.NAME')}
        history={history}
        isCreateLocationPage={isCreateLocationPage}
        isViewLocationPage={isViewLocationPage}
        isEditLocationPage={isEditLocationPage}
        register={register}
        disabled={disabled}
        setValue={setValue}
        getValues={getValues}
        setError={setError}
        control={control}
        errors={errors}
        system={system}
      >
        <div>
          <div>
            <Unit
              register={register}
              classes={{ container: { flexGrow: 1, marginBottom: '40px' } }}
              label={t('FARM_MAP.BUFFER_ZONE.WIDTH')}
              name={bufferZoneEnum.width}
              displayUnitName={bufferZoneEnum.width_unit}
              errors={errors[bufferZoneEnum.width]}
              unitType={line_width}
              system={system}
              hookFormSetValue={setValue}
              hookFormGetValue={getValues}
              hookFromWatch={watch}
              control={control}
              disabled={!isEditLocationPage}
            />
          </div>
          <div
            style={{
              flexDirection: 'row',
              display: 'inline-flex',
              paddingBottom: '40px',
              width: '100%',
              gap: '16px',
            }}
          >
            <Unit
              register={register}
              classes={{ container: { flexGrow: 1 } }}
              label={t('FARM_MAP.AREA_DETAILS.TOTAL_AREA')}
              name={bufferZoneEnum.total_area}
              displayUnitName={bufferZoneEnum.total_area_unit}
              errors={errors[bufferZoneEnum.total_area]}
              unitType={area_total_area}
              system={system}
              hookFormSetValue={setValue}
              hookFormGetValue={getValues}
              hookFromWatch={watch}
              control={control}
              required
              disabled={isViewLocationPage}
            />
          </div>
        </div>
      </LineDetails>
    </Form>
  );
}
