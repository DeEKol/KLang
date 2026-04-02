// src/screens/NotFoundScreen.tsx
import React, { useMemo } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useThemeTokens } from "entities/theme";
import type { TRootStackParamList } from "shared/config/navigation";
import { ENavigation, resetTo } from "shared/config/navigation";

type TNotFoundScreenProps = NativeStackScreenProps<TRootStackParamList>;

const NotFoundScreen: React.FC<TNotFoundScreenProps> = () => {
  const { colors } = useThemeTokens();
  const themedStyles = useMemo(
    () => ({
      container: { backgroundColor: colors.background },
      subtitle: { color: colors.placeholder },
    }),
    [colors],
  );

  const goHome = () => {
    resetTo(ENavigation.MAIN);
  };

  return (
    <View style={[styles.container, themedStyles.container]}>
      <View style={styles.inner}>
        <Text style={styles.title}>{"Страница не найдена"}</Text>
        <Text style={[styles.subtitle, themedStyles.subtitle]}>
          {"Ссылка некорректна или экран больше не существует."}
        </Text>

        <View style={styles.buttonWrap}>
          <Button
            title="На главный экран"
            onPress={goHome}
          />
        </View>
      </View>
    </View>
  );
};

export default NotFoundScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  inner: { paddingHorizontal: 24, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20 },
  buttonWrap: { width: "100%", paddingHorizontal: 40 },
});
