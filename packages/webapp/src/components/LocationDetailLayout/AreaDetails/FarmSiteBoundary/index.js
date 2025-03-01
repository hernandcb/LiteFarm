import React from 'react';
import { useTranslation } from 'react-i18next';
import AreaDetails from '../index';
import { useForm } from 'react-hook-form';
import LocationButtons from '../../LocationButtons';
import { farmSiteBoundaryEnum } from '../../../../containers/constants';
import Form from '../../../Form';
import LocationPageHeader from '../../LocationPageHeader';
import { PersistedFormWrapper } from '../../PersistedFormWrapper';
import { getFormDataWithoutNulls } from '../../../../containers/hooks/useHookFormPersist/utils';

export default function PureFarmSiteBoundaryWrapper(props) {
  return (
    <PersistedFormWrapper>
      <PureFarmSiteBoundary {...props} />
    </PersistedFormWrapper>
  );
}

export function PureFarmSiteBoundary({
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
    watch,
    setValue,
    getValues,
    setError,
    control,

    formState: { isValid, isDirty, errors },
  } = useForm({
    mode: 'onChange',
    shouldUnregister: true,
    defaultValues: persistedFormData,
  });

  const { historyCancel } = useHookFormPersist?.(getValues) || {};

  const onError = (data) => {};
  const disabled = !isValid;
  const showPerimeter = true;
  const onSubmit = (data) => {
    data[farmSiteBoundaryEnum.total_area_unit] = data[farmSiteBoundaryEnum.total_area_unit]?.value;
    data[farmSiteBoundaryEnum.perimeter_unit] = data[farmSiteBoundaryEnum.perimeter_unit]?.value;
    const formData = getFormDataWithoutNulls({
      ...persistedFormData,
      ...data,

      type: 'farm_site_boundary',
    });
    submitForm({ formData });
  };

  const title =
    (isCreateLocationPage && t('FARM_MAP.FARM_SITE_BOUNDARY.TITLE')) ||
    (isEditLocationPage && t('FARM_MAP.FARM_SITE_BOUNDARY.EDIT_TITLE')) ||
    (isViewLocationPage && persistedFormData.name);

  return (
    <Form
      buttonGroup={
        <LocationButtons
          disabled={disabled}
          isCreateLocationPage={isCreateLocationPage}
          isViewLocationPage={isViewLocationPage}
          isEditLocationPage={isEditLocationPage}
          onEdit={() => history.push(`/farm_site_boundary/${match.params.location_id}/edit`)}
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
      <AreaDetails
        name={t('FARM_MAP.FARM_SITE_BOUNDARY.NAME')}
        history={history}
        isCreateLocationPage={isCreateLocationPage}
        isViewLocationPage={isViewLocationPage}
        isEditLocationPage={isEditLocationPage}
        register={register}
        setValue={setValue}
        getValues={getValues}
        watch={watch}
        setError={setError}
        control={control}
        showPerimeter={showPerimeter}
        errors={errors}
        system={system}
      />
    </Form>
  );
}
