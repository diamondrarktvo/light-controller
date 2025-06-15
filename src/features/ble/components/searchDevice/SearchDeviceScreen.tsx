import { Box, Button, Column, EmptyList, Row, Scaffold, Text } from "_shared";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { FlashList } from "@shopify/flash-list";
import { useAppSelector } from "_store";
import { IDevice } from "../../Types/Types";
import { selectors as bleSelectors } from "../../bleSlice";
import { useBLE } from "../../hooks/useBLE";
import { SMART_LIGHT_PERIPHERAL_NAME } from "../../bleConstant";
import { isDeviceConnected } from "../../bleUtils";

export default function SearchDeviceScreen() {
  const { t } = useTranslation(["home", "common", "search"]);
  const allDevices = useAppSelector(bleSelectors.getAllDevices);
  const allDevicesConnected = useAppSelector(bleSelectors.getDevicesConnected);
  const {
    isLoadingScan,
    connectingOrDeconnectingDeviceID,
    requestPermissions,
    scanForPeripherals,
    stopScanForPeripherals,
    connectToDevice,
    disconnectFromDevice,
  } = useBLE();

  //logics
  const handleStartAndStopScanForPeripherals = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      if (isLoadingScan) {
        stopScanForPeripherals();
      } else {
        scanForPeripherals(SMART_LIGHT_PERIPHERAL_NAME);
      }
    }
  };

  const handleConnectOrDisconnectDevice = useCallback(
    (device: IDevice) => {
      const isThisDeviceConnected = isDeviceConnected(
        device,
        allDevicesConnected
      );
      if (isThisDeviceConnected) {
        disconnectFromDevice(device);
      } else {
        connectToDevice(device);
      }
    },
    [allDevicesConnected, disconnectFromDevice, connectToDevice]
  );

  //components
  const RenderDeviceItem = useCallback(
    ({ item }: { item: IDevice }) => {
      const isThisDeviceConnected = isDeviceConnected(
        item,
        allDevicesConnected
      );

      const isConnectingThisDevice =
        connectingOrDeconnectingDeviceID === item.id;

      return (
        <Row
          key={item.id}
          justifyContent={"space-between"}
          alignItems={"center"}
          marginBottom={"m"}
        >
          <Column flex={1}>
            <Text variant={"primaryBold"} numberOfLines={1}>
              {item.name}
            </Text>
            <Text variant={"secondary"} numberOfLines={2} width={"90%"}>
              {item.id}
            </Text>
          </Column>

          {item.isConnectable && (
            <Button
              variant={isThisDeviceConnected ? "primary" : "tertiary"}
              color={isThisDeviceConnected ? "white" : "primary"}
              label={
                isThisDeviceConnected
                  ? t("search:button.disconnect")
                  : t("search:button.connect")
              }
              loading={isConnectingThisDevice}
              onPress={() => handleConnectOrDisconnectDevice(item)}
            />
          )}
        </Row>
      );
    },
    [allDevicesConnected, connectingOrDeconnectingDeviceID]
  );

  return (
    <Scaffold typeOfScreen="stack">
      <Box flex={1}>
        <FlashList
          keyExtractor={(item) => item.id.toString()}
          estimatedItemSize={200}
          data={allDevices}
          renderItem={RenderDeviceItem}
          extraData={[
            allDevices,
            allDevicesConnected,
            connectingOrDeconnectingDeviceID,
          ]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Box marginBottom={"l"}>
              <Text variant={"title"} fontWeight={"bold"}>
                {t("search:content.search_device")}
              </Text>

              <Button
                marginTop={"l"}
                variant="tertiary"
                color="primary"
                label={
                  isLoadingScan
                    ? t("search:button.stop")
                    : t("search:button.search")
                }
                onPress={handleStartAndStopScanForPeripherals}
              />
              {isLoadingScan && (
                <Text textAlign={"center"} variant={"tertiary"}>
                  {t("search:content.searching")}
                </Text>
              )}
            </Box>
          }
          ListEmptyComponent={
            <EmptyList textToShow={t("search:content.empty_list")} />
          }
        />
      </Box>
    </Scaffold>
  );
}
