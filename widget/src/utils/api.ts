import { FeedbackData } from '../types';

export class ApiClient {
  private functionEndpoint: string;

  constructor(appwriteEndpoint: string, appwriteProjectId: string) {
    // Use Appwrite Function endpoint instead of direct SDK
    this.functionEndpoint = `${appwriteEndpoint}/functions/feedback-api/executions`;
  }

  async submitFeedback(data: FeedbackData): Promise<void> {
    try {
      const payload = {
        projectId: data.projectId,
        description: data.description,
        email: data.email || null,
        url: data.metadata.url,
        screenshot: data.screenshot || null
      };

      const response = await fetch(this.functionEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          path: '/feedback',
          method: 'POST',
          body: JSON.stringify(payload)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}