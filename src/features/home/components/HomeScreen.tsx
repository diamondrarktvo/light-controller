import { Box, Scaffold, Text } from "_shared";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet } from "react-native";
import AnimatedLottieView from "lottie-react-native";
import { BluetoothScan } from "_assets";
import { Layouts } from "_utils";
import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

export default function HomeScreen() {
  const { t } = useTranslation(["home", "common"]);
  const navigation = useNavigation();

  //logics
  const handleNavigateToSearchDevice = useCallback(() => {
    if (!navigation) return;

    navigation.navigate("search_device");
  }, [navigation]);

  return (
    <Scaffold
      typeOfScreen="tab"
      titleTabScreen={t("common:tab_navigation.label.home")}
    >
      <Box flex={1}>
        <Text variant={"primaryBold"}>{t("home:content.welcome")}</Text>
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
