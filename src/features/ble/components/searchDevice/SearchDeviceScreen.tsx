import { Box, Button, Column, EmptyList, Row, Scaffold, Text } from "_shared";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo } from "react";
import { FlashList } from "@shopify/flash-list";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch } from "_store";
import { Device } from "../../Types/Types";
import { setDevice } from "../../bleSlice";

export default function SearchDeviceScreen() {
  const { t } = useTranslation(["home", "common", "search"]);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  //logics
  const deviceList: Device[] = useMemo(() => {
    return [
      {
        id: "1",
        name: "Device 1",
        uuid: "123e4567-e89b-12d3-a456-426614174000",
        isConnected: false,
      },
      {
        id: "2",
        name: "Device 2",
        uuid: "123e4567-e89b-12d3-a456-426614174001",
        isConnected: false,
      },
    ];
  }, []);

  const handleGoBack = useCallback(() => {
    if (!navigation || !navigation.goBack) return;

    navigation.goBack();
  }, [navigation]);

  const handleConnectDevice = useCallback(
    (device: Device) => {
      if (!dispatch || device) return;

      dispatch(setDevice(device));
      handleGoBack();
    },
    [dispatch, handleGoBack]
  );

  //components
  const RenderDeviceItem = useCallback(({ item }: { item: Device }) => {
    return (
      <Row
        key={item.id}
        justifyContent={"space-between"}
        alignItems={"center"}
        marginBottom={"m"}
      >
        <Column>
          <Text variant={"primaryBold"} numberOfLines={1}>
            {item.name}
          </Text>
          <Text variant={"secondary"} numberOfLines={2} width={"90%"}>
            {item.uuid}
          </Text>
        </Column>

        <Button
          variant={item.isConnected ? "primary" : "tertiary"}
          color={item.isConnected ? "primary" : "secondary"}
          label={
            item.isConnected
              ? t("search:button.disconnect")
              : t("search:button.connect")
          }
          onPress={() => handleConnectDevice(item)}
        />
      </Row>
    );
  }, []);

  return (
    <Scaffold typeOfScreen="stack">
      <Box flex={1}>
        <FlashList
          keyExtractor={(item) => item.id.toString()}
          estimatedItemSize={200}
          data={deviceList}
          renderItem={RenderDeviceItem}
          extraData={deviceList}
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
                label={t("search:button.search")}
              />
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
