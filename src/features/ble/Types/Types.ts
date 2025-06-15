export interface BLEApi {}

export type Device = {
  id: string;
  name: string;
  uuid: string;
  isConnected?: boolean;
};

export type SearchDeviceState = {
  devices: Device[];
};
