import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDevice, SearchDeviceState } from "./Types/Types";

const initialState: SearchDeviceState = {
  devices: [],
  devicesConnected: [],
  refreshLightState: 0,
};

const bleSlice = createSlice({
  name: "ble",
  initialState,
  reducers: {
    setAllDevice: (state, action: PayloadAction<IDevice>) => {
      const device = action.payload;
      const existingDeviceIndex = state.devices.findIndex(
        (d) => d.id === device.id && d.name === device.name
      );

      if (existingDeviceIndex >= 0) {
        // Update existing device
        state.devices[existingDeviceIndex] = device;
      } else {
        state.devices.push(device);
      }
    },
    removeDevice: (state, action: PayloadAction<IDevice>) => {
      const device = action.payload;
      state.devices = state.devices.filter((d) => d.id !== device.id);
    },
    setDeviceConnected: (state, action: PayloadAction<IDevice>) => {
      const device = action.payload;
      state.devicesConnected.push(device);
    },
    removeDeviceConnected: (state, action: PayloadAction<IDevice>) => {
      const device = action.payload;
      state.devicesConnected = state.devicesConnected.filter(
        (d) => d.id !== device.id
      );
    },
    clearAllDeviceConnected: (state) => {
      state.devices = [];
    },
    setRefreshLightState: (state, action: PayloadAction<number>) => {
      state.refreshLightState = action.payload;
    },
    clearRefreshLightState: (state) => {
      state.refreshLightState = 0;
    },
  },
  extraReducers: (builder) => {},
});

export const selectors = {
  getAllDevices: (state: { ble: SearchDeviceState }) => state.ble.devices,
  getDevicesConnected: (state: { ble: SearchDeviceState }) =>
    state.ble.devicesConnected,
  getDeviceById: (state: { ble: SearchDeviceState }, id: string) =>
    state.ble.devices.find((device) => device.id === id),
  getRefreshLightState: (state: { ble: SearchDeviceState }) =>
    state.ble.refreshLightState,
};

export const {
  setAllDevice,
  removeDevice,
  setDeviceConnected,
  removeDeviceConnected,
  clearAllDeviceConnected,
  setRefreshLightState,
  clearRefreshLightState,
} = bleSlice.actions;

export default bleSlice.reducer;
