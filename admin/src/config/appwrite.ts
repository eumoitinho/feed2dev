import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://sfo.cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '68d2f6720002e0a23941');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = 'feed2dev-main';
export const COLLECTIONS = {
  PROJECTS: 'projects',
  FEEDBACKS: 'feedbacks',
  COMMENTS: 'comments'
};

export const STORAGE_BUCKET_ID = 'screenshots';

export { client };