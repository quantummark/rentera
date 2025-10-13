// utils/trimCanvas.ts
export function trimCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext('2d')!;
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  let xMin = width, yMin = height, xMax = 0, yMax = 0;

  // Найдём границы непрозрачных пикселей
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = imageData.data[(y * width + x) * 4 + 3];
      if (alpha > 0) {
        xMin = Math.min(xMin, x);
        yMin = Math.min(yMin, y);
        xMax = Math.max(xMax, x);
        yMax = Math.max(yMax, y);
      }
    }
  }

  const trimmedWidth = xMax - xMin + 1;
  const trimmedHeight = yMax - yMin + 1;
  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = trimmedWidth;
  croppedCanvas.height = trimmedHeight;
  croppedCanvas
    .getContext('2d')!
    .putImageData(ctx.getImageData(xMin, yMin, trimmedWidth, trimmedHeight), 0, 0);

  return croppedCanvas;
}
