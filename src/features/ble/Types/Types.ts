import { Device } from "react-native-ble-plx";

export interface BLEApi {
  isLoadingScan: boolean;
  connectingOrDeconnectingDeviceID: string | null;
  requestPermissions(): Promise<boolean>;
  readRefreshLightState: (device: Device) => Promise<void>;
  writeLightState: (
    connectedDeviceID: string,
    lightState: [number]
  ) => Promise<void>;
  scanForPeripherals(peripheralName: string): void;
  stopScanForPeripherals(): void;
  connectToDevice: (device: Device | IDevice) => Promise<void>;
  disconnectFromDevice: (device: Device | IDevice) => void;
}

export interface IDevice {
  id: string;
  name: string | null;
  localName: string | null;
  rssi: number | null;
  serviceUUIDs: string[] | null;
  manufacturerData: string | null;
  serviceData: Record<string, string> | null;
  mtu: number;
  isConnectable: boolean | null;
  txPowerLevel: number | null;
}

export type SearchDeviceState = {
  devices: IDevice[];
  devicesConnected: IDevice[];
  refreshLightState: number;
};
