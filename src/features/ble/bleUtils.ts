import { TFunction } from "i18next";
import { BleError, Device } from "react-native-ble-plx";
import { IDevice } from "./Types/Types";

export interface BleErrorContext {
  deviceID?: string;
  serviceUUID?: string;
  characteristicUUID?: string;
  descriptorUUID?: string;
}

/**
 * Handler pour convertir un BleError de react-native-ble-plx
 * en message utilisateur lisible.
 *
 * @param error      Erreur capturée (BleError ou Error)
 * @param context    Contexte additionnel pour remplacer les placeholders
 * @param t          Fonction de traduction
 * @returns          Message d'erreur formaté
 */
export function getBleErrorMessage(
  error: BleError | Error | null,
  context: BleErrorContext = {},
  t: TFunction<"common">
): string {
  const codeKey =
    typeof (error as any).errorCode !== "undefined"
      ? String((error as any).errorCode)
      : "0";

  const template = t(`ble_errors.${codeKey}`, {
    defaultValue: t("ble_errors.0"),
  });

  return template
    .replace(/{internalMessage}/g, (error as any).reason ?? "")
    .replace(/{deviceID}/g, context.deviceID ?? "")
    .replace(/{serviceUUID}/g, context.serviceUUID ?? "")
    .replace(/{characteristicUUID}/g, context.characteristicUUID ?? "")
    .replace(/{descriptorUUID}/g, context.descriptorUUID ?? "");
}

export function toSerializableDevice(device: Device): IDevice {
  return {
    id: device.id,
    name: device.name,
    localName: device.localName,
    rssi: device.rssi,
    serviceUUIDs: device.serviceUUIDs,
    manufacturerData: device.manufacturerData,
    serviceData: device.serviceData,
    mtu: device.mtu,
    isConnectable: device.isConnectable,
    txPowerLevel: device.txPowerLevel,
  };
}

export function isDeviceConnected(
  device: IDevice,
  allDevicesConnected: IDevice[]
): boolean {
  return allDevicesConnected.some((d) => d.id === device.id);
}
