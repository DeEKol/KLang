import React, { useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import type { SkPath } from "@shopify/react-native-skia";
import { Canvas, Group, Path as SkiaPath, Skia } from "@shopify/react-native-skia";
import { useThemeTokens } from "entities/theme";

import { useHangelBoard } from "../model/useHangelBoard";

interface IAnimatedStrokeProps {
  path: SkPath;
  width: number;
  strokeColor: string;
}

const AnimatedStroke = ({ path, width, strokeColor }: IAnimatedStrokeProps) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    // opacity.value = withTiming(1, { duration: 50 });
  }, []);

  return (
    <Group opacity={opacity}>
      <SkiaPath
        path={path}
        style="stroke"
        strokeWidth={width}
        color={strokeColor}
      />
    </Group>
  );
};

const GridOverlay = ({
  width = 400,
  height = 400,
  lineColorHex,
}: {
  width?: number;
  height?: number;
  lineColorHex: string;
}) => {
  const lineColor = Skia.Color(lineColorHex);
  const lineWidth = 1.5;
  const padding = 20;

  const mainGuide = Skia.Path.Make();

  mainGuide.addRect(Skia.XYWHRect(padding, padding, width - 2 * padding, height - 2 * padding));

  mainGuide.moveTo(width / 2, padding);
  mainGuide.lineTo(width / 2, height - padding);
  mainGuide.moveTo(padding, height / 2);
  mainGuide.lineTo(width - padding, height / 2);

  const thirdW = (width - 2 * padding) / 3;
  const thirdH = (height - 2 * padding) / 3;

  for (let i = 1; i < 3; i++) {
    mainGuide.moveTo(padding + i * thirdW, padding);
    mainGuide.lineTo(padding + i * thirdW, height - padding);
  }

  for (let i = 1; i < 3; i++) {
    mainGuide.moveTo(padding, padding + i * thirdH);
    mainGuide.lineTo(width - padding, padding + i * thirdH);
  }

  return (
    <>
      <SkiaPath
        path={mainGuide}
        color={lineColor}
        style="stroke"
        strokeWidth={lineWidth}
        opacity={0.4}
      />
      <SkiaPath
        path={Skia.Path.Make().addOval(Skia.XYWHRect(width / 2 - 2, height / 2 - 2, 4, 4))}
        color={lineColor}
      />
    </>
  );
};

export const HangelBoard = ({ onExit }: { onExit?: () => void }) => {
  const { colors } = useThemeTokens();
  const {
    canvasRef,
    strokes,
    undone,
    strokeWidth,
    setStrokeWidth,
    currentPath,
    panResponder,
    handleUndo,
    handleRedo,
    handleReset,
  } = useHangelBoard();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.controls}>
        <Button
          title="Undo"
          onPress={handleUndo}
          disabled={!strokes.length}
        />
        <Button
          title="Redo"
          onPress={handleRedo}
          disabled={!undone.length}
        />
        <Button
          title="Reset"
          onPress={handleReset}
          disabled={!strokes.length && !undone.length}
        />
        {onExit && (
          <Button
            title="Exit"
            onPress={onExit}
          />
        )}
      </View>
      <Text style={[styles.label, { color: colors.text }]}>{`Stroke Width: ${strokeWidth}`}</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={20}
        step={1}
        value={strokeWidth}
        onValueChange={setStrokeWidth}
      />
      <View
        style={styles.canvasWrapper}
        {...panResponder.panHandlers}>
        <Canvas
          ref={canvasRef}
          style={[
            styles.canvas,
            { borderColor: colors.border, backgroundColor: colors.background },
          ]}>
          <GridOverlay lineColorHex={colors.disabled} />
          {strokes.map((s) => (
            <AnimatedStroke
              key={s.id}
              path={s.path}
              width={s.width}
              strokeColor={colors.text}
            />
          ))}
          {currentPath && (
            <SkiaPath
              path={currentPath}
              style="stroke"
              strokeWidth={strokeWidth}
              color={colors.text}
            />
          )}
        </Canvas>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 12,
  },
  canvasWrapper: { flex: 1 },
  canvas: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
  },
  label: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  slider: { width: "100%", height: 40 },
});
