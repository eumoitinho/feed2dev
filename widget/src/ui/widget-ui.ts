import { WidgetConfig } from '../types';

export class WidgetUI {
  private config: WidgetConfig;
  private container: HTMLElement | null = null;
  private screenshot: string | null = null;

  constructor(config: WidgetConfig) {
    this.config = config;
  }

  render(): void {
    this.container = document.createElement('div');
    this.container.className = 'feed2dev-widget';
    
    if (this.config.primaryColor) {
      this.container.style.setProperty('--f2d-primary', this.config.primaryColor);
    }

    this.container.innerHTML = `
      <button class="feed2dev-trigger">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
      </button>

      <div class="feed2dev-modal">
        <div class="feed2dev-container">
          <div class="feed2dev-header">
            <h2 class="feed2dev-title">${this.config.title}</h2>
            <button class="feed2dev-close">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>

          <div class="feed2dev-body">
            <div class="feed2dev-content">
              <p style="color: #6b7280; margin: 0 0 20px; font-size: 14px; font-family: system-ui, -apple-system, sans-serif;">
                ${this.config.subtitle}
              </p>

              <form class="feed2dev-form">
                <div class="feed2dev-field">
                  <label class="feed2dev-label">Description *</label>
                  <textarea 
                    name="description" 
                    class="feed2dev-textarea" 
                    placeholder="Please describe your feedback..."
                    required
                  ></textarea>
                </div>

                <div class="feed2dev-field">
                  <label class="feed2dev-label">Email (optional)</label>
                  <input 
                    type="email" 
                    name="email" 
                    class="feed2dev-input" 
                    placeholder="your.email@example.com"
                  />
                </div>

                <div class="feed2dev-field">
                  <label class="feed2dev-label">Screenshot</label>
                  <div class="feed2dev-screenshot-area">
                    <button type="button" class="feed2dev-btn feed2dev-btn-secondary feed2dev-btn-screenshot">
                      📸 Capture Screenshot
                    </button>
                    <div class="feed2dev-screenshot-preview" style="display: none;">
                      <img src="" alt="Screenshot" />
                      <button type="button" class="feed2dev-screenshot-remove">Remove</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div class="feed2dev-success-message" style="display: none;">
              <div class="feed2dev-success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
              <h3 class="feed2dev-success-title">Thank you!</h3>
              <p class="feed2dev-success-text">Your feedback has been submitted successfully.</p>
            </div>
          </div>

          <div class="feed2dev-footer">
            <button type="button" class="feed2dev-btn feed2dev-btn-secondary feed2dev-btn-cancel">
              Cancel
            </button>
            <button type="button" class="feed2dev-btn feed2dev-btn-primary feed2dev-btn-submit">
              Submit Feedback
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.container);
    this.attachInternalListeners();
    this.positionTrigger();
  }

  private attachInternalListeners(): void {
    const cancelBtn = this.container?.querySelector('.feed2dev-btn-cancel');
    const removeScreenshotBtn = this.container?.querySelector('.feed2dev-screenshot-remove');

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.close());
    }

    if (removeScreenshotBtn) {
      removeScreenshotBtn.addEventListener('click', () => this.removeScreenshot());
    }
  }

  private positionTrigger(): void {
    const trigger = this.container?.querySelector('.feed2dev-trigger') as HTMLElement;
    if (!trigger) return;

    const position = this.config.position || 'bottom-right';
    
    trigger.style.removeProperty('bottom');
    trigger.style.removeProperty('top');
    trigger.style.removeProperty('left');
    trigger.style.removeProperty('right');

    switch (position) {
      case 'bottom-left':
        trigger.style.bottom = '24px';
        trigger.style.left = '24px';
        break;
      case 'top-right':
        trigger.style.top = '24px';
        trigger.style.right = '24px';
        break;
      case 'top-left':
        trigger.style.top = '24px';
        trigger.style.left = '24px';
        break;
      default: // bottom-right
        trigger.style.bottom = '24px';
        trigger.style.right = '24px';
    }
  }

  open(): void {
    const modal = this.container?.querySelector('.feed2dev-modal');
    if (modal) {
      modal.classList.add('active');
    }
  }

  close(): void {
    const modal = this.container?.querySelector('.feed2dev-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  setScreenshot(dataUrl: string): void {
    this.screenshot = dataUrl;
    const preview = this.container?.querySelector('.feed2dev-screenshot-preview') as HTMLElement;
    const img = preview?.querySelector('img');
    
    if (preview && img) {
      img.src = dataUrl;
      preview.style.display = 'block';
    }

    const captureBtn = this.container?.querySelector('.feed2dev-btn-screenshot') as HTMLElement;
    if (captureBtn) {
      captureBtn.style.display = 'none';
    }
  }

  removeScreenshot(): void {
    this.screenshot = null;
    const preview = this.container?.querySelector('.feed2dev-screenshot-preview') as HTMLElement;
    
    if (preview) {
      preview.style.display = 'none';
    }

    const captureBtn = this.container?.querySelector('.feed2dev-btn-screenshot') as HTMLElement;
    if (captureBtn) {
      captureBtn.style.display = 'block';
    }
  }

  getScreenshot(): string | null {
    return this.screenshot;
  }

  setLoading(loading: boolean): void {
    const submitBtn = this.container?.querySelector('.feed2dev-btn-submit') as HTMLButtonElement;
    
    if (submitBtn) {
      submitBtn.disabled = loading;
      submitBtn.textContent = loading ? 'Submitting...' : 'Submit Feedback';
    }
  }

  showSuccess(): void {
    const content = this.container?.querySelector('.feed2dev-content') as HTMLElement;
    const success = this.container?.querySelector('.feed2dev-success-message') as HTMLElement;
    const footer = this.container?.querySelector('.feed2dev-footer') as HTMLElement;

    if (content) content.style.display = 'none';
    if (success) success.style.display = 'block';
    if (footer) footer.style.display = 'none';
  }

  reset(): void {
    const form = this.container?.querySelector('.feed2dev-form') as HTMLFormElement;
    const content = this.container?.querySelector('.feed2dev-content') as HTMLElement;
    const success = this.container?.querySelector('.feed2dev-success-message') as HTMLElement;
    const footer = this.container?.querySelector('.feed2dev-footer') as HTMLElement;

    if (form) form.reset();
    if (content) content.style.display = 'block';
    if (success) success.style.display = 'none';
    if (footer) footer.style.display = 'flex';
    
    this.removeScreenshot();
    this.setLoading(false);
  }

  destroy(): void {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
}