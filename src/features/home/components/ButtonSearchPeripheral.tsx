import { Box, Button } from "_shared";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet } from "react-native";
import AnimatedLottieView from "lottie-react-native";
import { BluetoothScan } from "_assets";
import { Layouts } from "_utils";
import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { useAppSelector } from "_store";
import { selectors as bleSelectors } from "../../ble/bleSlice";

export function ButtonSearchPeripheral() {
  const { t } = useTranslation(["home", "common", "search"]);
  const navigation = useNavigation();
  const allDevicesConnected = useAppSelector(bleSelectors.getDevicesConnected);

  const handleNavigateToSearchDevice = useCallback(() => {
    if (!navigation) return;

    navigation.navigate("search_device");
  }, [navigation]);

  return (
    <Box>
      {allDevicesConnected?.length > 0 ? (
        <Button
          marginTop={"l"}
          variant="primary"
          label={t("search:button.scan")}
          onPress={handleNavigateToSearchDevice}
        />
      ) : (
        <Box flex={1} justifyContent={"center"} alignItems={"center"}>
          <Pressable onPress={handleNavigateToSearchDevice}>
            <AnimatedLottieView
              source={BluetoothScan}
              autoPlay
              loop
              style={styles.lottieImg}
            />
          </Pressable>
        </Box>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  lottieImg: {
    height: Layouts.RFValue(230),
    width: Layouts.RFValue(230),
  },
});
