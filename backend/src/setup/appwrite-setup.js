const { Client, Databases, Storage, Permission, Role } = require('node-appwrite');
require('dotenv').config();

const client = new Client();
client
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = 'feed2dev-main';
const COLLECTIONS = {
  PROJECTS: 'projects',
  FEEDBACKS: 'feedbacks',
  COMMENTS: 'comments'
};

async function setupAppwrite() {
  try {
    console.log('🚀 Setting up Appwrite...');

    // Create database
    try {
      await databases.create(DATABASE_ID, 'Feed2Dev Main Database');
      console.log('✅ Database created');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Database already exists');
      } else {
        throw error;
      }
    }

    // Create Projects collection
    try {
      await databases.createCollection(
        DATABASE_ID,
        COLLECTIONS.PROJECTS,
        'Projects',
        [
          Permission.read(Role.user()),
          Permission.create(Role.user()),
          Permission.update(Role.user()),
          Permission.delete(Role.user())
        ]
      );
      console.log('✅ Projects collection created');

      // Add attributes to Projects collection
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PROJECTS, 'name', 255, true);
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PROJECTS, 'domain', 255, true);
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PROJECTS, 'description', 1000, false);
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PROJECTS, 'apiKey', 255, true);
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PROJECTS, 'userId', 255, true);
      
      console.log('✅ Projects attributes created');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Projects collection already exists');
      } else {
        throw error;
      }
    }

    // Create Feedbacks collection
    try {
      await databases.createCollection(
        DATABASE_ID,
        COLLECTIONS.FEEDBACKS,
        'Feedbacks',
        [
          Permission.read(Role.user()),
          Permission.create(Role.any()),
          Permission.update(Role.user()),
          Permission.delete(Role.user())
        ]
      );
      console.log('✅ Feedbacks collection created');

      // Add attributes to Feedbacks collection
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.FEEDBACKS, 'projectId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.FEEDBACKS, 'description', 2000, true);
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.FEEDBACKS, 'screenshot', 255, false);
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.FEEDBACKS, 'email', 255, false);
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.FEEDBACKS, 'userAgent', 1000, false);
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.FEEDBACKS, 'url', 1000, true);
      await databases.createEnumAttribute(DATABASE_ID, COLLECTIONS.FEEDBACKS, 'status', ['NEW', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED'], false, 'NEW');
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.FEEDBACKS, 'metadata', 5000, false);
      
      console.log('✅ Feedbacks attributes created');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Feedbacks collection already exists');
      } else {
        throw error;
      }
    }

    // Create Comments collection
    try {
      await databases.createCollection(
        DATABASE_ID,
        COLLECTIONS.COMMENTS,
        'Comments',
        [
          Permission.read(Role.user()),
          Permission.create(Role.user()),
          Permission.update(Role.user()),
          Permission.delete(Role.user())
        ]
      );
      console.log('✅ Comments collection created');

      // Add attributes to Comments collection
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.COMMENTS, 'feedbackId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.COMMENTS, 'text', 2000, true);
      await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.COMMENTS, 'author', 255, true);
      
      console.log('✅ Comments attributes created');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Comments collection already exists');
      } else {
        throw error;
      }
    }

    // Create storage bucket for screenshots
    try {
      await storage.createBucket(
        'screenshots',
        'Screenshots',
        [
          Permission.read(Role.any()),
          Permission.create(Role.any()),
          Permission.update(Role.user()),
          Permission.delete(Role.user())
        ],
        false,
        undefined,
        undefined,
        ['jpg', 'jpeg', 'png', 'webp']
      );
      console.log('✅ Screenshots storage bucket created');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Screenshots bucket already exists');
      } else {
        throw error;
      }
    }

    console.log('🎉 Appwrite setup completed successfully!');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupAppwrite();