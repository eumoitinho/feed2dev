import { WidgetConfig, FeedbackData } from '../types';
import { WidgetUI } from '../ui/widget-ui';
import { ScreenshotCapture } from '../utils/screenshot';
import { ApiClient } from '../utils/api';

export class WidgetCore {
  private config: WidgetConfig;
  private ui: WidgetUI;
  private screenshotCapture: ScreenshotCapture;
  private apiClient: ApiClient;
  private isOpen: boolean = false;

  constructor(config: WidgetConfig) {
    this.config = {
      appwriteEndpoint: 'https://sfo.cloud.appwrite.io/v1',
      appwriteProjectId: '68d2f6720002e0a23941',
      position: 'bottom-right',
      title: 'Send Feedback',
      subtitle: 'We would love to hear from you!',
      ...config
    };
    
    this.ui = new WidgetUI(this.config);
    this.screenshotCapture = new ScreenshotCapture();
    this.apiClient = new ApiClient(this.config.appwriteEndpoint!, this.config.appwriteProjectId!);
  }

  init(): void {
    this.ui.render();
    this.attachEventListeners();
  }

  open(): void {
    this.isOpen = true;
    this.ui.open();
  }

  close(): void {
    this.isOpen = false;
    this.ui.close();
  }

  destroy(): void {
    this.ui.destroy();
  }

  private attachEventListeners(): void {
    const triggerBtn = document.querySelector('.feed2dev-trigger');
    const closeBtn = document.querySelector('.feed2dev-close');
    const submitBtn = document.querySelector('.feed2dev-btn-submit');
    const screenshotBtn = document.querySelector('.feed2dev-btn-screenshot');
    const modal = document.querySelector('.feed2dev-modal');

    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => this.open());
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.close();
        }
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.handleSubmit());
    }

    if (screenshotBtn) {
      screenshotBtn.addEventListener('click', () => this.captureScreenshot());
    }
  }

  private async captureScreenshot(): Promise<void> {
    try {
      this.close();
      
      setTimeout(async () => {
        const screenshot = await this.screenshotCapture.capture();
        this.ui.setScreenshot(screenshot);
        this.open();
      }, 300);
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      this.open();
    }
  }

  private async handleSubmit(): Promise<void> {
    const form = document.querySelector('.feed2dev-form') as HTMLFormElement;
    
    if (!form) return;

    const formData = new FormData(form);
    const description = formData.get('description') as string;
    const email = formData.get('email') as string;

    if (!description) {
      alert('Please provide a description');
      return;
    }

    const screenshot = this.ui.getScreenshot();
    
    const feedbackData: FeedbackData = {
      projectId: this.config.projectId,
      description,
      email: email || undefined,
      screenshot: screenshot || undefined,
      metadata: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        browser: this.getBrowserInfo(),
        os: this.getOSInfo()
      }
    };

    try {
      this.ui.setLoading(true);
      await this.apiClient.submitFeedback(feedbackData);
      this.ui.showSuccess();
      
      if (this.config.onSuccess) {
        this.config.onSuccess();
      }

      setTimeout(() => {
        this.close();
        this.ui.reset();
      }, 2000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      this.ui.setLoading(false);
      
      if (this.config.onError) {
        this.config.onError(error as Error);
      } else {
        alert('Failed to submit feedback. Please try again.');
      }
    }
  }

  private getBrowserInfo(): string {
    const ua = navigator.userAgent;
    if (ua.indexOf('Firefox') > -1) return 'Firefox';
    if (ua.indexOf('SamsungBrowser') > -1) return 'Samsung Browser';
    if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) return 'Opera';
    if (ua.indexOf('Trident') > -1) return 'Internet Explorer';
    if (ua.indexOf('Edge') > -1) return 'Edge';
    if (ua.indexOf('Chrome') > -1) return 'Chrome';
    if (ua.indexOf('Safari') > -1) return 'Safari';
    return 'Unknown';
  }

  private getOSInfo(): string {
    const ua = navigator.userAgent;
    if (ua.indexOf('Win') > -1) return 'Windows';
    if (ua.indexOf('Mac') > -1) return 'macOS';
    if (ua.indexOf('Linux') > -1) return 'Linux';
    if (ua.indexOf('Android') > -1) return 'Android';
    if (ua.indexOf('iOS') > -1) return 'iOS';
    return 'Unknown';
  }
}