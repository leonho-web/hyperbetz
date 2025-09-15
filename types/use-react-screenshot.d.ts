declare module 'use-react-screenshot' {
  interface ScreenshotOptions {
    type?: 'image/png' | 'image/jpeg' | 'image/webp';
    quality?: number;
  }

  export function useScreenshot(
    options?: ScreenshotOptions
  ): [string | null, (element: HTMLElement) => Promise<void>];
}
