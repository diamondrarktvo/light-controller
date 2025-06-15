import { Box, Button, EmptyList, Scaffold, Text } from "_shared";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { Layouts } from "_utils";
import { useNavigation } from "@react-navigation/native";
import { ButtonSearchPeripheral } from "./ButtonSearchPeripheral";
import { selectors as bleSelectors } from "../../ble/bleSlice";
import { useAppSelector } from "_store";
import { useCallback } from "react";
import { IDevice } from "src/features/ble/Types/Types";
import { FlashList } from "@shopify/flash-list";

export default function HomeScreen() {
  const { t } = useTranslation(["home", "common"]);
  const navigation = useNavigation();
  const allDevicesConnected = useAppSelector(bleSelectors.getDevicesConnected);

  //logics
  const handleNavigateTo = useCallback(
    (deviceID: string) => {
      if (!navigation) return;

      navigation.navigate("light_controller", {
        deviceId: deviceID,
      });
    },
    [navigation]
  );

  //components
  const RenderDeviceConncected = useCallback(
    ({ item }: { item: IDevice }) => {
      return (
        <Box>
          <Button
            marginTop={"l"}
            variant="tertiary"
            color="primary"
            label={item.name}
            onPress={() => handleNavigateTo(item.id)}
          />
        </Box>
      );
    },
    [allDevicesConnected, handleNavigateTo]
  );

  return (
    <Scaffold
      typeOfScreen="tab"
      titleTabScreen={t("common:tab_navigation.label.home")}
    >
      <Box flex={1}>
        <FlashList
          keyExtractor={(item) => item.id.toString()}
          estimatedItemSize={200}
          data={allDevicesConnected}
          renderItem={RenderDeviceConncected}
          extraData={allDevicesConnected}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Box flex={1}>
              <Text variant={"primaryBold"}>{t("home:content.welcome")}</Text>
              <ButtonSearchPeripheral />
            </Box>
          }
        />
      </Box>
    </Scaffold>
  );
}

const styles = StyleSheet.create({
  lottieImg: {
    height: Layouts.RFValue(230),
    width: Layouts.RFValue(230),
  },
});
