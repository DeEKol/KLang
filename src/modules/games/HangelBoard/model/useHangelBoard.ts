import { useCallback, useRef, useState } from "react";
import { PanResponder } from "react-native";
import type { SkPath } from "@shopify/react-native-skia";
import { Skia, useCanvasRef } from "@shopify/react-native-skia";

interface Stroke {
  id: number;
  path: SkPath;
  width: number;
}

export function useHangelBoard() {
  const strokeIdRef = useRef(0);
  const canvasRef = useCanvasRef();
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [undone, setUndone] = useState<Stroke[]>([]);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [currentPoints, setCurrentPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [currentPath, setCurrentPath] = useState<SkPath | null>(null);

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

  return {
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
  };
}
