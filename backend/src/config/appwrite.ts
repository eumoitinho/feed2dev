import { Client, Databases, Account, Storage, Users } from 'appwrite';

const client = new Client();

client
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://sfo.cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || '68d2f6720002e0a23941')
  .setKey(process.env.APPWRITE_API_KEY || '');

export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);
export const users = new Users(client);

export const DATABASE_ID = 'feed2dev-main';
export const COLLECTIONS = {
  PROJECTS: 'projects',
  FEEDBACKS: 'feedbacks',
  COMMENTS: 'comments',
  USERS: 'users'
};

export const STORAGE_BUCKET_ID = 'screenshots';

export { client };