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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/>
        </svg>
        <span class="feed2dev-trigger-text">FEEDBACK</span>
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
                    
                    <div class="feed2dev-annotation-tools">
                      <div class="feed2dev-tool-group">
                        <button type="button" class="feed2dev-annotation-tool active" data-tool="pen" title="Caneta">
                          ✏️
                        </button>
                        <button type="button" class="feed2dev-annotation-tool" data-tool="rectangle" title="Retângulo">
                          ⬜
                        </button>
                        <button type="button" class="feed2dev-annotation-tool" data-tool="arrow" title="Seta">
                          ↗️
                        </button>
                        <button type="button" class="feed2dev-annotation-tool" data-tool="text" title="Texto">
                          T
                        </button>
                      </div>
                      
                      <div class="feed2dev-tool-separator"></div>
                      
                      <div class="feed2dev-color-selector">
                        <div class="feed2dev-color-option active" data-color="#ef4444" style="background: #ef4444;" title="Vermelho"></div>
                        <div class="feed2dev-color-option" data-color="#3b82f6" style="background: #3b82f6;" title="Azul"></div>
                        <div class="feed2dev-color-option" data-color="#10b981" style="background: #10b981;" title="Verde"></div>
                        <div class="feed2dev-color-option" data-color="#f59e0b" style="background: #f59e0b;" title="Amarelo"></div>
                        <div class="feed2dev-color-option" data-color="#8b5cf6" style="background: #8b5cf6;" title="Roxo"></div>
                        <div class="feed2dev-color-option" data-color="#000000" style="background: #000000;" title="Preto"></div>
                      </div>
                      
                      <div class="feed2dev-tool-separator"></div>
                      
                      <div class="feed2dev-brush-size">
                        <span style="font-size: 12px;">Size:</span>
                        <input type="range" min="1" max="10" value="3" class="feed2dev-brush-range">
                      </div>
                      
                      <div class="feed2dev-tool-separator"></div>
                      
                      <button type="button" class="feed2dev-annotation-tool" data-tool="undo" title="Desfazer">
                        ↶
                      </button>
                      <button type="button" class="feed2dev-annotation-tool" data-tool="clear" title="Limpar">
                        🗑️
                      </button>
                    </div>
                    
                    <div class="feed2dev-screenshot-preview" style="display: none;">
                      <div class="feed2dev-canvas-container">
                        <img src="" alt="Screenshot" />
                        <canvas class="feed2dev-annotation-canvas"></canvas>
                      </div>
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
    const img = preview?.querySelector('img') as HTMLImageElement;
    const canvas = preview?.querySelector('.feed2dev-annotation-canvas') as HTMLCanvasElement;
    const tools = this.container?.querySelector('.feed2dev-annotation-tools') as HTMLElement;
    
    if (preview && img && canvas) {
      img.src = dataUrl;
      img.onload = () => {
        // Setup canvas size to match image
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
      };
      preview.style.display = 'block';
    }

    if (tools) {
      tools.classList.add('active');
    }

    const captureBtn = this.container?.querySelector('.feed2dev-btn-screenshot') as HTMLElement;
    if (captureBtn) {
      captureBtn.style.display = 'none';
    }
  }

  removeScreenshot(): void {
    this.screenshot = null;
    const preview = this.container?.querySelector('.feed2dev-screenshot-preview') as HTMLElement;
    const tools = this.container?.querySelector('.feed2dev-annotation-tools') as HTMLElement;
    
    if (preview) {
      preview.style.display = 'none';
    }

    if (tools) {
      tools.classList.remove('active');
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