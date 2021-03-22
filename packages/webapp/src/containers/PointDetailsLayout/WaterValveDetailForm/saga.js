import { call, select, takeEvery, put } from 'redux-saga/effects';
import apiConfig from '../../../apiConfig';
import { loginSelector } from '../../userFarmSlice';
import { getHeader } from '../../saga';
import { createAction } from '@reduxjs/toolkit';
import { getLocationObjectFromWaterValve, postWaterValveSuccess } from '../../waterValveSlice';
import history from '../../../history';
import { resetLocationData, setSuccessMessage, showSuccessHeader } from '../../mapSlice';
import i18n from '../../../locales/i18n';

const axios = require('axios');
export const postWaterValveLocation = createAction(`postWaterValveLocationSaga`);

export function* postWaterValveLocationSaga({ payload: data }) {
  const formData = data.formData;
  const { locationURL } = apiConfig;
  let { user_id, farm_id } = yield select(loginSelector);
  formData.farm_id = farm_id;
  const header = getHeader(user_id, farm_id);
  const locationObject = getLocationObjectFromWaterValve(formData);

  try {
    const result = yield call(
      axios.post,
      `${locationURL}/${locationObject.figure.type}`,
      locationObject,
      header,
    );
    yield put(postWaterValveSuccess(result.data));
    yield put(resetLocationData());
    yield put(
      setSuccessMessage([i18n.t('FARM_MAP.MAP_FILTER.WV'), i18n.t('message:MAP.SUCCESS_POST')]),
    );
    yield put(showSuccessHeader(true));
    history.push({ pathname: '/map' });
  } catch (e) {
    console.log(e);
  }
}

export default function* waterValveLocationSaga() {
  yield takeEvery(postWaterValveLocation.type, postWaterValveLocationSaga);
}
