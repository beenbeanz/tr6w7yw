declare module 'html2canvas' {
  export default function html2canvas(
    element: Element | HTMLElement | Document,
    options?: any
  ): Promise<HTMLCanvasElement>;
}
