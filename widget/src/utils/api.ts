import { Client, Databases, Storage, ID } from 'appwrite';
import { FeedbackData } from '../types';

export class ApiClient {
  private client: Client;
  private databases: Databases;
  private storage: Storage;

  constructor(appwriteEndpoint: string, appwriteProjectId: string) {
    this.client = new Client()
      .setEndpoint(appwriteEndpoint)
      .setProject(appwriteProjectId);
    
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  async submitFeedback(data: FeedbackData): Promise<void> {
    try {
      let screenshotId = null;

      // Upload screenshot if provided
      if (data.screenshot) {
        try {
          // Convert base64 to blob
          const base64Data = data.screenshot.split(',')[1];
          const blob = new Blob([Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))], { type: 'image/png' });
          const file = new File([blob], `screenshot-${Date.now()}.png`, { type: 'image/png' });

          const uploadResult = await this.storage.createFile('screenshots', ID.unique(), file);
          screenshotId = uploadResult.$id;
        } catch (error) {
          console.error('Screenshot upload failed:', error);
        }
      }

      // Create feedback document
      const feedbackData = {
        projectId: data.projectId,
        description: data.description,
        email: data.email || '',
        screenshot: screenshotId,
        metadata: JSON.stringify(data.metadata),
        url: data.metadata.url,
        userAgent: data.metadata.userAgent || '',
        status: 'NEW'
      };

      await this.databases.createDocument(
        'feed2dev-main',
        'feedbacks',
        ID.unique(),
        feedbackData
      );
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}