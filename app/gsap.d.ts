declare module 'gsap/ScrollSmoother' {
  interface ScrollSmoothConfig {
    smooth?: number;
    effects?: boolean;
    onUpdate?: (self: any) => void;
    onStop?: (self: any) => void;
  }

  export class ScrollSmoother {
    static create(config?: ScrollSmoothConfig): ScrollSmoother;
    smooth?: number;
    effects?: boolean;
    kill(): void;
  }
}
