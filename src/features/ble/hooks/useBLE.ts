import { PermissionsAndroid, Platform } from "react-native";
import { BLEApi, IDevice } from "../Types/Types";
import { useTranslation } from "react-i18next";
import * as ExpoDevice from "expo-device";
import { BleError, BleManager, Device } from "react-native-ble-plx";
import { useMemo, useState } from "react";
import { Helpers } from "_utils";
import { useAppDispatch } from "_store";
import {
  removeDevice,
  removeDeviceConnected,
  setAllDevice,
  setDeviceConnected,
} from "../bleSlice";
import { getBleErrorMessage, toSerializableDevice } from "../bleUtils";
import {
  SMART_LIGHT_PERIPHERAL_CHARACTERISTIC_UUID,
  SMART_LIGHT_PERIPHERAL_SERVICE_UUID,
} from "../bleConstant";

export const useBLE = (): BLEApi => {
  const bleManager = useMemo(() => new BleManager(), []);
  const dispatch = useAppDispatch();
  const [isLoadingScan, setIsLoadingScan] = useState(false);
  const [
    connectingOrDeconnectingDeviceID,
    setConnectingOrDeconnectingDeviceID,
  ] = useState<string | null>(null);

  const { t } = useTranslation("common");
  const requestAndroid31Permissions = async (): Promise<boolean> => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: t("permissions.title"),
        message: t("permissions.bluetooth.scan"),
        buttonPositive: t("actions.ok"),
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: t("permissions.title"),
        message: t("permissions.bluetooth.connect"),
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: t("permissions.title"),
        message: t("permissions.bluetooth.location"),
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: t("permissions.title"),
            message: t("permissions.bluetooth.location"),
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const scanForPeripherals = async (peripheralName: string) => {
    setIsLoadingScan(true);
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        Helpers.logger("Scan error", error);
        Helpers.showToast("error", getBleErrorMessage(error, {}, t));
        stopScanForPeripherals();
        setIsLoadingScan(false);
      }
      if (
        device &&
        device.id &&
        device.name &&
        device.name.includes(peripheralName)
      ) {
        dispatch(setAllDevice(toSerializableDevice(device)));
      }
    });
  };

  const stopScanForPeripherals = () => {
    bleManager.stopDeviceScan();
    setIsLoadingScan(false);
  };

  const connectToDevice = async (device: Device | IDevice) => {
    try {
      setConnectingOrDeconnectingDeviceID(device.id);
      const deviceConnection = await bleManager.connectToDevice(device.id);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      await refreshLightState(deviceConnection);

      stopScanForPeripherals();
      setConnectingOrDeconnectingDeviceID(null);
      dispatch(setDeviceConnected(device));
    } catch (error) {
      Helpers.logger("Error connecting to device", error);
      Helpers.showToast(
        "error",
        getBleErrorMessage(error as BleError | Error | null, {}, t)
      );
      dispatch(removeDevice(device));
      setConnectingOrDeconnectingDeviceID(null);
    }
  };

  const refreshLightState = async (connectedDevice: Device) => {
    if (!connectedDevice) return;
    try {
      const char = await connectedDevice.readCharacteristicForService(
        SMART_LIGHT_PERIPHERAL_SERVICE_UUID,
        SMART_LIGHT_PERIPHERAL_CHARACTERISTIC_UUID
      );

      const decoded = Helpers.decodeBase64(char.value);
    } catch (e) {
      console.error("Erreur lecture état lumière :", e);
    }
  };

  const disconnectFromDevice = async (connectedDevice: Device | IDevice) => {
    if (connectedDevice) {
      setConnectingOrDeconnectingDeviceID(connectedDevice.id);
      await bleManager
        .cancelDeviceConnection(connectedDevice.id)
        .then(() => {
          dispatch(removeDeviceConnected(connectedDevice));
          dispatch(removeDevice(connectedDevice));
          setConnectingOrDeconnectingDeviceID(null);
        })
        .catch((error) => {
          Helpers.logger("Device disconnect error", error);
          setConnectingOrDeconnectingDeviceID(null);
        });
    }
  };

  return {
    isLoadingScan,
    connectingOrDeconnectingDeviceID,
    requestPermissions,
    scanForPeripherals,
    stopScanForPeripherals,
    connectToDevice,
    disconnectFromDevice,
  };
};
