import {
  Box,
  Button,
  Image,
  Input,
  RequestLoader,
  Scaffold,
  Text,
} from "_shared";
import { Layouts } from "_utils";
import { useTranslation } from "react-i18next";

export const LoginScreen = () => {
  const { t } = useTranslation(["login", "common"]);

  return (
    <Scaffold typeOfScreen="tab">
      <RequestLoader isLoading={false}>
        <Box flex={1}>
          <Text>Login</Text>
        </Box>
      </RequestLoader>
    </Scaffold>
  );
};
