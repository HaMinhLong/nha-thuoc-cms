import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dataAll: [],
  data: {
    list: [],
    pagination: [],
  },
  info: {},
  query: {},
  filter: {},
};

export const medicineUnitSlice = createSlice({
  name: 'medicineUnit',
  initialState,
  reducers: {
    save: (state, action) => {
      return {
        ...state,
        data: {
          list: action.payload.list,
          pagination: action.payload.pagination,
        },
        info: {},
      };
    },
    saveAll(state, action) {
      return {
        ...state,
        dataAll: action.payload && action.payload.results,
      };
    },
    removeAndSave(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.list,
          pagination: {
            ...state.data.pagination,
            total: action.payload.pagination.total,
          },
        },
      };
    },
    info: (state, action) => {
      return {
        ...state,
        info: action.payload,
      };
    },
    filter: (state, action) => {
      return {
        ...state,
        filter: action.payload,
      };
    },
    query: (state, action) => {
      return {
        ...state,
        query: action.payload,
      };
    },
  },
});

export const { filter, save, saveAll, removeAndSave, info, query } =
  medicineUnitSlice.actions;

export const medicineUnit = ({ medicineUnit }) => medicineUnit;

export default medicineUnitSlice.reducer;