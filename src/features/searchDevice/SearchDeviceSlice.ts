import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Device, SearchDeviceState } from "./Types/Types";

const initialState: SearchDeviceState = {
  devices: [],
};

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    setDevice: (state, action: PayloadAction<Device>) => {
      const device = action.payload;
      const existingDeviceIndex = state.devices.findIndex(
        (d) => d.id === device.id
      );

      if (existingDeviceIndex >= 0) {
        // Update existing device
        state.devices[existingDeviceIndex] = device;
      } else {
        state.devices.push(device);
      }
    },
    clearAllDeviceConnected: (state) => {
      state.devices = [];
    },
  },
  extraReducers: (builder) => {},
});

export const selectors = {
  getAllDevices: (state: { deviceConnected: SearchDeviceState }) =>
    state.deviceConnected.devices,
  getDeviceById: (state: { deviceConnected: SearchDeviceState }, id: string) =>
    state.deviceConnected.devices.find((device) => device.id === id),
};

export const { setDevice, clearAllDeviceConnected } = deviceSlice.actions;

export default deviceSlice.reducer;
