export type LinePoint = {
  x: Date;
  y: number;
};

export type CandlePoint = {
  x: number;
  o: number;
  h: number;
  l: number;
  c: number;
};

export type MixedDataPoint = LinePoint | CandlePoint | null;
