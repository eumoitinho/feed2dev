import html2canvas from 'html2canvas';

export class ScreenshotCapture {
  async capture(): Promise<string> {
    try {
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: false,
        scale: 1,
        logging: false,
        width: window.innerWidth,
        height: window.innerHeight,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      });

      return canvas.toDataURL('image/png', 0.8);
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      throw error;
    }
  }
}