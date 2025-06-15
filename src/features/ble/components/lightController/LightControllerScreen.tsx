import { Box, Scaffold, Text } from "_shared";
import { useTranslation } from "react-i18next";
import AnimatedLottieView from "lottie-react-native";
import { Switch } from "_assets";
import { Pressable, StyleSheet } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppSelector } from "_store";
import { selectors as bleSelectors } from "../../bleSlice";
import { useBLE } from "../../hooks/useBLE";
import { useRoute } from "@react-navigation/native";

export default function LightControllerScreen() {
  const { t } = useTranslation(["home", "common"]);
  const { deviceId } = useRoute().params as { deviceId: string };

  const refreshLightState = useAppSelector(bleSelectors.getRefreshLightState);
  const devicesConnected = useAppSelector((state) =>
    bleSelectors.getDeviceById(state, deviceId)
  );
  const [lightState, setLightState] = useState(
    refreshLightState ? true : false
  );
  const animationRef = useRef<AnimatedLottieView | null>(null);
  const { writeLightState } = useBLE();

  //logics
  const toggleLight = useCallback(() => {
    if (!devicesConnected) return;

    setLightState((prevState) => !prevState);

    writeLightState(devicesConnected.id, lightState ? [0] : [1]);

    if (animationRef.current) {
      if (lightState) {
        animationRef.current.play(0, 10);
      } else {
        animationRef.current.play(10, 0);
      }
    }
  }, [lightState, refreshLightState]);

  useEffect(() => {
    setLightState(refreshLightState ? true : false);
  }, [refreshLightState]);

  return (
    <Scaffold typeOfScreen="stack">
      <Box flex={1}>
        <Box flex={1} justifyContent={"center"} alignItems={"center"}>
          <Text variant={"title"}>
            {t("home:content.lightState", {
              lightState: lightState ? "ON" : "OFF",
            })}
          </Text>

          <Pressable onPress={toggleLight}>
            <AnimatedLottieView
              ref={animationRef}
              source={Switch}
              autoPlay={false}
              onAnimationLoaded={() => {
                if (animationRef.current) {
                  if (lightState) {
                    animationRef.current.play(10, 0);
                  } else {
                    animationRef.current.play(0, 10);
                  }
                }
              }}
              loop={false}
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
    height: 200,
    width: 200,
  },
});
