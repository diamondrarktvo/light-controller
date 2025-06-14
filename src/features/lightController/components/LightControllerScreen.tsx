import { Box, Scaffold, Text } from "_shared";
import { useTranslation } from "react-i18next";
import AnimatedLottieView from "lottie-react-native";
import { Switch } from "_assets";
import { Pressable, StyleSheet } from "react-native";
import { useCallback, useRef, useState } from "react";

export default function LightControllerScreen() {
  const { t } = useTranslation(["home", "common"]);
  const [lightState, setLightState] = useState(false);
  const animationRef = useRef<AnimatedLottieView | null>(null);

  //logics
  const toggleLight = useCallback(() => {
    setLightState((prevState) => !prevState);
    if (animationRef.current) {
      if (lightState) {
        animationRef.current.play(0, 10);
      } else {
        animationRef.current.play(10, 0);
      }
    }
  }, [lightState]);

  return (
    <Scaffold
      typeOfScreen="tab"
      titleTabScreen={t("common:tab_navigation.label.home")}
    >
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
                  animationRef.current.play(0, 10);
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
