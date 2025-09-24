import { ID, Query } from 'appwrite';
import { account, databases, storage, DATABASE_ID, COLLECTIONS, STORAGE_BUCKET_ID } from '../config/appwrite';
import { Project, Feedback, CreateProjectData } from '../types';

export const authService = {
  async login(email: string, password: string) {
    try {
      await account.createEmailSession(email, password);
      const user = await account.get();
      return { user, success: true };
    } catch (error) {
      throw error;
    }
  },

  async register(email: string, password: string, name: string) {
    try {
      await account.create(ID.unique(), email, password, name);
      await account.createEmailSession(email, password);
      const user = await account.get();
      return { user, success: true };
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      await account.deleteSession('current');
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      return null;
    }
  }
};

export const projectService = {
  async create(data: CreateProjectData): Promise<Project> {
    const projectData = {
      name: data.name,
      domain: data.domain,
      description: data.description || '',
      apiKey: ID.unique(),
      userId: (await account.get()).$id
    };

    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.PROJECTS,
      ID.unique(),
      projectData
    );

    return response as unknown as Project;
  },

  async getAll(): Promise<Project[]> {
    const user = await account.get();
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.PROJECTS,
      [Query.equal('userId', user.$id), Query.orderDesc('$createdAt')]
    );

    // Get feedback counts for each project
    const projectsWithCounts: Project[] = await Promise.all(
      response.documents.map(async (project) => {
        const feedbackCount = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.FEEDBACKS,
          [Query.equal('projectId', project.$id), Query.limit(1)]
        );

        const result = {
          ...project,
          id: project.$id,
          createdAt: project.$createdAt,
          updatedAt: project.$updatedAt,
          _count: {
            feedbacks: feedbackCount.total
          }
        };

        // cast via unknown to the Project interface since Appwrite returns generic payload
        return result as unknown as Project;
      })
    );

    return projectsWithCounts;
  },

  async getById(id: string): Promise<Project> {
    const response = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.PROJECTS,
      id
    );

    const feedbackCount = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.FEEDBACKS,
      [Query.equal('projectId', id), Query.limit(1)]
    );

    return {
      ...response,
      id: response.$id,
      createdAt: response.$createdAt,
      updatedAt: response.$updatedAt,
      _count: {
        feedbacks: feedbackCount.total
      }
    } as unknown as Project;
  },

  async update(id: string, data: Partial<CreateProjectData>): Promise<Project> {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.PROJECTS,
      id,
      data
    );

    return {
      ...response,
      id: response.$id,
      createdAt: response.$createdAt,
      updatedAt: response.$updatedAt
    } as unknown as Project;
  },

  async delete(id: string): Promise<void> {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.PROJECTS, id);
  }
};

export const feedbackService = {
  async create(data: {
    projectId: string;
    description: string;
    email?: string;
    screenshot?: string;
    metadata: any;
    url: string;
    userAgent?: string;
  }) {
    let screenshotId = null;

    // Upload screenshot if provided
    if (data.screenshot) {
      try {
        // Convert base64 to blob
        const base64Data = data.screenshot.split(',')[1];
        const blob = new Blob([Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))], { type: 'image/png' });
        const file = new File([blob], `screenshot-${Date.now()}.png`, { type: 'image/png' });

        const uploadResult = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), file);
        screenshotId = uploadResult.$id;
      } catch (error) {
        console.error('Screenshot upload failed:', error);
      }
    }

    const feedbackData = {
      projectId: data.projectId,
      description: data.description,
      email: data.email || '',
      screenshot: screenshotId,
      metadata: JSON.stringify(data.metadata),
      url: data.url,
      userAgent: data.userAgent || '',
      status: 'NEW'
    };

    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.FEEDBACKS,
      ID.unique(),
      feedbackData
    );

    return response;
  },

  async getByProject(projectId: string, params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    feedbacks: Feedback[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const limit = params?.limit || 20;
    const offset = ((params?.page || 1) - 1) * limit;
    
    const queries = [
      Query.equal('projectId', projectId),
      Query.orderDesc('$createdAt'),
      Query.limit(limit),
      Query.offset(offset)
    ];

    if (params?.status) {
      queries.push(Query.equal('status', params.status));
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.FEEDBACKS,
      queries
    );

    const feedbacks = await Promise.all(
      response.documents.map(async (feedback) => {
        // Get comments for each feedback
        const comments = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.COMMENTS,
          [Query.equal('feedbackId', feedback.$id), Query.orderDesc('$createdAt')]
        );

        // Get screenshot URL if exists
        let screenshotUrl = null;
        if (feedback.screenshot) {
          try {
            screenshotUrl = storage.getFileView(STORAGE_BUCKET_ID, feedback.screenshot);
          } catch (error) {
            console.error('Failed to get screenshot URL:', error);
          }
        }

        return {
          ...feedback,
          id: feedback.$id,
          createdAt: feedback.$createdAt,
          updatedAt: feedback.$updatedAt,
          metadata: JSON.parse(feedback.metadata || '{}'),
          screenshot: screenshotUrl,
          comments: comments.documents.map(comment => ({
            ...comment,
            id: comment.$id,
            createdAt: comment.$createdAt
          }))
        } as unknown as Feedback;
      })
    );

    return {
      feedbacks,
      pagination: {
        page: params?.page || 1,
        limit,
        total: response.total,
        totalPages: Math.ceil(response.total / limit)
      }
    };
  },

  async getById(id: string): Promise<Feedback> {
    const response = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.FEEDBACKS,
      id
    );

    // Get comments
    const comments = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.COMMENTS,
      [Query.equal('feedbackId', id), Query.orderDesc('$createdAt')]
    );

    // Get screenshot URL if exists
    let screenshotUrl = null;
    if (response.screenshot) {
      try {
        screenshotUrl = storage.getFileView(STORAGE_BUCKET_ID, response.screenshot);
      } catch (error) {
        console.error('Failed to get screenshot URL:', error);
      }
    }

    return {
      ...response,
      id: response.$id,
      createdAt: response.$createdAt,
      updatedAt: response.$updatedAt,
      metadata: JSON.parse(response.metadata || '{}'),
      screenshot: screenshotUrl,
      comments: comments.documents.map(comment => ({
        ...comment,
        id: comment.$id,
        createdAt: comment.$createdAt
      }))
    } as unknown as Feedback;
  },

  async updateStatus(id: string, status: string): Promise<Feedback> {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.FEEDBACKS,
      id,
      { status }
    );

    return {
      ...response,
      id: response.$id,
      createdAt: response.$createdAt,
      updatedAt: response.$updatedAt
    } as unknown as Feedback;
  },

  async addComment(feedbackId: string, text: string, author: string): Promise<void> {
    await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.COMMENTS,
      ID.unique(),
      {
        feedbackId,
        text,
        author
      }
    );
  }
};