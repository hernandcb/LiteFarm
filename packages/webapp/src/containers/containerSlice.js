import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { loginSelector, onLoadingFail, onLoadingStart } from './userFarmSlice';
import { createSelector } from 'reselect';
import { cropEntitiesSelector } from './cropSlice';
import { pick } from '../util';
import { cropLocationEntitiesSelector } from './locationSlice';
import { cropVarietyEntitiesSelector } from './cropVarietySlice';

const getContainer = (obj) => {
  return pick(obj, [
    'estimated_revenue',
    'estimated_yield',
    'estimated_yield_unit',
    'location_id',
    'management_plan_id',
    'notes',
    'planting_type',
    'container_type',
    'in_ground',
    'number_of_containers',
    'plant_spacing',
    'plant_spacing_unit',
    'planting_depth',
    'planting_depth_unit',
    'planting_soil',
    'plants_per_container',
    'total_plants',
  ]);
};

const addOneContainer = (state, { payload }) => {
  state.loading = false;
  state.error = null;
  containerAdapter.upsertOne(state, getContainer(payload));
};

const updateOneContainer = (state, { payload }) => {
  state.loading = false;
  state.error = null;
  containerAdapter.upsertOne(state, getContainer(payload));
};

const addManyContainer = (state, { payload: containers }) => {
  state.loading = false;
  state.error = null;
  state.loaded = true;
  containerAdapter.upsertMany(
    state,
    containers.map((container) => getContainer(container)),
  );
};

const containerAdapter = createEntityAdapter({
  selectId: (container) => container.management_plan_id,
});

const containerSlice = createSlice({
  name: 'containerReducer',
  initialState: containerAdapter.getInitialState({
    loading: false,
    error: undefined,
    loaded: false,
  }),
  reducers: {
    onLoadingContainerStart: onLoadingStart,
    onLoadingContainerFail: onLoadingFail,
    getContainersSuccess: addManyContainer,
    postContainerSuccess: addOneContainer,
    putContainerSuccess(state, { payload: container }) {
      containerAdapter.updateOne(state, {
        changes: container,
        id: container.management_plan_id,
      });
    },
    deleteContainerSuccess: containerAdapter.removeOne,
  },
});
export const {
  getContainersSuccess,
  postContainerSuccess,
  putContainerSuccess,
  onLoadingContainerStart,
  onLoadingContainerFail,
  deleteContainerSuccess,
} = containerSlice.actions;
export default containerSlice.reducer;

export const containerReducerSelector = (state) => state.entitiesReducer[containerSlice.name];

const containerSelectors = containerAdapter.getSelectors(
  (state) => state.entitiesReducer[containerSlice.name],
);

export const containersSelector = createSelector(
  [
    containerSelectors.selectAll,
    cropLocationEntitiesSelector,
    cropEntitiesSelector,
    cropVarietyEntitiesSelector,
    loginSelector,
  ],
  (containers, cropLocationEntities, cropEntities, cropVarietyEntities, { farm_id }) => {
    const containersOfCurrentFarm = containers.filter(
      (container) => cropLocationEntities[container.location_id]?.farm_id === farm_id,
    );
    return containersOfCurrentFarm.map((container) => {
      const crop_variety = cropVarietyEntities[container.crop_variety_id];
      const crop = cropEntities[crop_variety.crop_id];
      return {
        ...crop,
        ...crop_variety,
        location: cropLocationEntities[container.location_id],
        ...container,
        crop,
        crop_variety,
      };
    });
  },
);
