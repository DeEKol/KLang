// src/screens/ModalScreen.tsx
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  navigate,
  type TAllStackParamList,
  type TRootStackParamList,
} from "shared/config/navigation";

type TModalScreenProps = NativeStackScreenProps<TRootStackParamList>;

const ModalScreen: React.FC<TModalScreenProps> = ({ navigation, route }) => {
  const { screen } = (route.params as { screen?: string }) || {};

  const onClose = () => {
    navigation.goBack();
  };

  const openTarget = () => {
    // Если Modal был вызван с указанием target-screen,
    // можно перенаправить пользователя туда (если он доступен)
    // Пример: route.params?.screen = "HomeScreen"
    if (screen) {
      // Безопаснее — использовать dispatch + CommonActions.navigate,
      // чтобы избежать ошибок, если навигатор в другом состоянии.
      navigate(screen as keyof TAllStackParamList);
    } else {
      onClose();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{"Modal"}</Text>
        {screen ? (
          <Text style={styles.text}>
            {"Открыть целевой экран: "}
            {String(screen)}
          </Text>
        ) : (
          <Text style={styles.text}>
            {"Здесь может быть подтверждение, форма или детальный контент."}
          </Text>
        )}

        <View style={styles.buttons}>
          <Button
            title="Close"
            onPress={onClose}
          />
          <View style={styles.space} />
          <Button
            title={screen ? "Open target" : "Done"}
            onPress={openTarget}
          />
        </View>
      </View>
    </View>
  );
};

export default ModalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    //  backgroundColor: "rgba(0,0,0,0.05)"
  },
  card: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    // backgroundColor: "white",
    // ! лёгкая тень — платформозависимо
    // shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  text: {
    fontSize: 16,
    marginBottom: 16,
    // color: "#333"
  },
  buttons: { flexDirection: "row", justifyContent: "flex-end" },
  space: { width: 12 },
});
