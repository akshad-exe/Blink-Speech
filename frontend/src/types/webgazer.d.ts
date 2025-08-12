declare module 'webgazer' {
  interface WebGazerOptions {
    regression?: string;
    tracker?: string;
  }

  interface GazeData {
    x: number | null;
    y: number | null;
    confidence?: number;
  }

  interface WebGazer {
    setRegression(regression: string): WebGazer;
    setTracker(tracker: string): WebGazer;
    setGazeListener(callback: (data: GazeData) => void): WebGazer;
    begin(): Promise<void>;
    end(): void;
    getCurrentPrediction(): GazeData;
  }

  const webgazer: WebGazer;
  export default webgazer;
} 