import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, PanResponder, StyleSheet, Text, View } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import type { SkPath } from "@shopify/react-native-skia";
import { Canvas, Group, Path as SkiaPath, Skia, useCanvasRef } from "@shopify/react-native-skia";
import { useThemeTokens } from "shared/lib/theme";

interface Stroke {
  id: number;
  path: SkPath;
  width: number;
}

// Сглаживаем точки квадратичными кривыми
const createSmoothedPath = (points: Array<{ x: number; y: number }>) => {
  const path = Skia.Path.Make();

  if (!points.length) return path;

  path.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;

    path.quadTo(prev.x, prev.y, midX, midY);
  }

  return path;
};

const AnimatedStroke = ({
  path,
  width,
  strokeColor,
}: Pick<Stroke, "path" | "width"> & { strokeColor: string }) => {
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

  // Создаем основные направляющие
  const mainGuide = Skia.Path.Make();

  // 1. Границы символа
  mainGuide.addRect(Skia.XYWHRect(padding, padding, width - 2 * padding, height - 2 * padding));

  // 2. Центральные оси
  mainGuide.moveTo(width / 2, padding);
  mainGuide.lineTo(width / 2, height - padding);
  mainGuide.moveTo(padding, height / 2);
  mainGuide.lineTo(width - padding, height / 2);

  // 3. Дополнительные направляющие для хангыля
  const thirdW = (width - 2 * padding) / 3;
  const thirdH = (height - 2 * padding) / 3;

  // Вертикальные линии
  for (let i = 1; i < 3; i++) {
    mainGuide.moveTo(padding + i * thirdW, padding);
    mainGuide.lineTo(padding + i * thirdW, height - padding);
  }

  // Горизонтальные линии
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

      {/* Дополнительные точки-ориентиры */}
      <SkiaPath
        path={Skia.Path.Make().addOval(Skia.XYWHRect(width / 2 - 2, height / 2 - 2, 4, 4))}
        color={lineColor}
      />
    </>
  );
};

export const HangelBoard = () => {
  const { colors } = useThemeTokens();
  const strokeIdRef = useRef(0);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [undone, setUndone] = useState<Stroke[]>([]);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [currentPoints, setCurrentPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [currentPath, setCurrentPath] = useState<SkPath | null>(null);
  const canvasRef = useCanvasRef();

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: ({ nativeEvent }) => {
      const { locationX: x, locationY: y } = nativeEvent;
      const path = Skia.Path.Make();

      path.moveTo(x, y);

      setCurrentPath(path);
      setCurrentPoints([{ x, y }]);
    },
    onPanResponderMove: ({ nativeEvent }) => {
      if (!currentPath) return;

      const { locationX: x, locationY: y } = nativeEvent;

      currentPath.lineTo(x, y);

      setCurrentPoints((pts) => [...pts, { x, y }]);
      setCurrentPath(currentPath.copy());
    },
    onPanResponderRelease: () => {
      if (!currentPath) return;

      // const smooth = createSmoothedPath(currentPoints);
      const newStroke: Stroke = {
        id: ++strokeIdRef.current,
        path: currentPath,
        width: strokeWidth,
      };

      setStrokes((prev) => [...prev, newStroke]);
      setUndone([]);
      setCurrentPath(null);
      setCurrentPoints([]);
    },
  });

  const handleUndo = useCallback(() => {
    setStrokes((prev) => {
      const copy = [...prev];
      const last = copy.pop();

      if (last) setUndone((u) => [...u, last]);

      return copy;
    });
  }, []);

  const handleRedo = useCallback(() => {
    setUndone((prev) => {
      const copy = [...prev];
      const last = copy.pop();

      if (last) setStrokes((s) => [...s, last]);

      return copy;
    });
  }, []);

  const handleReset = useCallback(() => {
    setStrokes([]);
    setUndone([]);
  }, []);

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
