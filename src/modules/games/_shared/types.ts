export interface IGameResult {
  score: number;   // 0..1 (доля правильных ответов)
  timeMs: number;  // время прохождения в мс
  mistakes: number;
}

export interface IGameProps<TConfig = unknown> {
  config: TConfig;
  onComplete: (result: IGameResult) => void;
  onExit?: () => void;
}
