import { Box, Button, Column, EmptyList, Row, Scaffold, Text } from "_shared";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo } from "react";
import { Device } from "../Types/Types";
import { FlashList } from "@shopify/flash-list";

export default function SearchDeviceScreen() {
  const { t } = useTranslation(["home", "common", "search"]);

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
          variant="primary"
          label={
            item.isConnected
              ? t("search:button.disconnect")
              : t("search:button.connect")
          }
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
          data={[]}
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
