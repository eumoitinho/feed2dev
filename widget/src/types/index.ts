export interface WidgetConfig {
  projectId: string;
  appwriteEndpoint?: string;
  appwriteProjectId?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  primaryColor?: string;
  title?: string;
  subtitle?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface FeedbackData {
  projectId: string;
  description: string;
  email?: string;
  screenshot?: string;
  metadata: {
    url: string;
    userAgent: string;
    screenResolution: string;
    viewport: string;
    browser?: string;
    os?: string;
  };
}

export type DrawingTool = 'pen' | 'rectangle' | 'arrow' | 'text' | 'highlight';

export interface DrawingState {
  isDrawing: boolean;
  tool: DrawingTool;
  color: string;
  lineWidth: number;
}