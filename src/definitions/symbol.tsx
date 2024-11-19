export type SymbolData = {
  symbol: string;
  volumeMin: number | null;
  volume: number | null;
  pointsRange: number[];
  tradeTickValue: number | null;
  tradeTickPreviousValue: number | null;
  ask: number | null;
  decimalPoints: number | null;
};

export type WsSymbolData = {
  symbol: string;
  trade_tick_value: number | null;
  volume_min: number | null;
  ask: number | null;
  decimal_points: number | null;
};
