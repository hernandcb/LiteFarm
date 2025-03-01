import React from 'react';
import { useTranslation } from 'react-i18next';
import AreaDetails from '../index';
import { useForm } from 'react-hook-form';
import Leaf from '../../../../assets/images/farmMapFilter/Leaf.svg';
import Input, { getInputErrors } from '../../../Form/Input';
import { gardenEnum } from '../../../../containers/constants';
import { Label } from '../../../Typography';
import LocationButtons from '../../LocationButtons';
import Form from '../../../Form';
import LocationPageHeader from '../../LocationPageHeader';
import RouterTab from '../../../RouterTab';

import { getDateInputFormat } from '../../../../util/moment';
import { PersistedFormWrapper } from '../../PersistedFormWrapper';
import RadioGroup from '../../../Form/RadioGroup';
import { getFormDataWithoutNulls } from '../../../../containers/hooks/useHookFormPersist/utils';

export default function PureGardenWrapper(props) {
  return (
    <PersistedFormWrapper>
      <PureGarden {...props} />
    </PersistedFormWrapper>
  );
}

export function PureGarden({
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
  const getDefaultValues = () => {
    return {
      [gardenEnum.transition_date]: getDateInputFormat(new Date()),
      [gardenEnum.organic_status]: 'Non-Organic',
      ...persistedFormData,
    };
  };
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
    defaultValues: getDefaultValues(),
  });

  const { historyCancel } = useHookFormPersist?.(getValues) || {};

  const onError = (data) => {};
  const gardenTypeSelection = watch(gardenEnum.organic_status);
  const disabled = !isValid;
  const showPerimeter = true;
  const onSubmit = (data) => {
    data[gardenEnum.total_area_unit] = data[gardenEnum.total_area_unit]?.value;
    data[gardenEnum.perimeter_unit] = data[gardenEnum.perimeter_unit]?.value;
    const formData = getFormDataWithoutNulls({
      ...persistedFormData,
      ...data,

      type: 'garden',
    });
    submitForm({ formData });
  };

  const title =
    (isCreateLocationPage && t('FARM_MAP.GARDEN.TITLE')) ||
    (isEditLocationPage && t('FARM_MAP.GARDEN.EDIT_TITLE')) ||
    (isViewLocationPage && persistedFormData.name);

  return (
    <Form
      buttonGroup={
        <LocationButtons
          disabled={disabled}
          isCreateLocationPage={isCreateLocationPage}
          isViewLocationPage={isViewLocationPage}
          isEditLocationPage={isEditLocationPage}
          onEdit={() => history.push(`/garden/${match.params.location_id}/edit`)}
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
            { label: t('FARM_MAP.TAB.CROPS'), path: `/garden/${match.params.location_id}/crops` },
            {
              label: t('FARM_MAP.TAB.DETAILS'),
              path: `/garden/${match.params.location_id}/details`,
            },
          ]}
        />
      )}

      <AreaDetails
        name={t('FARM_MAP.GARDEN.NAME')}
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
      >
        <div>
          <div style={{ marginBottom: '20px' }}>
            <Label
              style={{
                paddingRight: '10px',
                fontSize: '16px',
                lineHeight: '20px',
                display: 'inline-block',
              }}
            >
              {t('FARM_MAP.GARDEN.GARDEN_TYPE')}
            </Label>
            <img src={Leaf} style={{ display: 'inline-block' }} />
          </div>
          <RadioGroup
            required={true}
            disabled={isViewLocationPage}
            hookFormControl={control}
            name={gardenEnum.organic_status}
            radios={[
              {
                label: t('FARM_MAP.GARDEN.NON_ORGANIC'),
                value: 'Non-Organic',
              },
              {
                label: t('FARM_MAP.GARDEN.ORGANIC'),
                value: 'Organic',
              },
              {
                label: t('FARM_MAP.GARDEN.TRANSITIONING'),
                value: 'Transitional',
              },
            ]}
          />
          <div style={{ paddingBottom: '20px' }}>
            {gardenTypeSelection === 'Transitional' && (
              <Input
                type={'date'}
                label={t('FARM_MAP.GARDEN.DATE')}
                hookFormRegister={register(gardenEnum.transition_date, { required: true })}
                style={{ paddingTop: '16px', paddingBottom: '20px' }}
                disabled={isViewLocationPage}
                errors={getInputErrors(errors, gardenEnum.transition_date)}
              />
            )}
          </div>
        </div>
      </AreaDetails>
    </Form>
  );
}
