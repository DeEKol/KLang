// ? Library Imports
import type { ReactNode } from "react";
import * as React from "react";
import type { ViewStyle } from "react-native";
import { Dimensions, StyleSheet, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
// ? Layer Imports
import { EPalette } from "shared/lib/theme";

// ? Types
export type TStepsSwiperProps = {
  data: ReactNode[];
};

/*
 * Компонент, свайпер шагов в уроке
 * @data Массив шагов
 TODO: Доделать когда передается один элемент
 TODO: Разобраться с отображаемым стеком шагов
 */
export function StepsSwiper(props: TStepsSwiperProps) {
  // ? Props From
  const { data } = props;

  // ? Variables
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;

  // ? Styles
  const styles = createStyles(height);

  // ? Render
  return (
    <View style={styles.container}>
      <Carousel
        style={styles.carousel}
        width={width - 40}
        pagingEnabled={true}
        snapEnabled={true}
        mode="horizontal-stack"
        loop={false}
        autoPlay={false}
        autoPlayReverse={false}
        data={data}
        modeConfig={{
          snapDirection: "left",
          stackInterval: 18,
        }}
        customConfig={() => ({ type: "positive", viewCount: 5 })}
        renderItem={({ index }) => <View style={styles.dataContainer}>{data[index]}</View>}
      />
    </View>
  );
}

// ? Types
type TStepsSwiperStyle = {
  container: ViewStyle;
  carousel: ViewStyle;
  dataContainer: ViewStyle;
};

// ? Styles
const createStyles = (height: number) => {
  const styles = StyleSheet.create<TStepsSwiperStyle>({
    container: { flex: 1, backgroundColor: EPalette.BLUE, justifyContent: "center" },
    carousel: { width: "100%", height: height, justifyContent: "center" },
    dataContainer: {
      borderWidth: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: EPalette.RED,
      height: height - 120,
    },
  });
  return styles;
};
