import { Client, Databases, Storage, ID } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const storage = new Storage(client);

  const DATABASE_ID = '68d2f67900061b5bc926';
  const PROJECTS_COLLECTION_ID = '68d2f67c000a49ed8139';
  const FEEDBACKS_COLLECTION_ID = '68d2f68300087b90de3c';
  const STORAGE_BUCKET_ID = '68d2f698001ea7b21ee9';

  try {
    if (req.method === 'POST' && req.path === '/feedback') {
      const { projectId, description, email, url, screenshot } = JSON.parse(req.body || '{}');

      // Validate required fields
      if (!projectId || !description) {
        return res.json({
          success: false,
          error: 'Missing required fields: projectId and description'
        }, 400);
      }

      // Verify project exists
      try {
        await databases.getDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, projectId);
      } catch (err) {
        return res.json({
          success: false,
          error: 'Project not found'
        }, 404);
      }

      let screenshotUrl = null;

      // Handle screenshot upload if provided
      if (screenshot) {
        try {
          // Convert base64 to buffer
          const base64Data = screenshot.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          
          // Upload to Appwrite storage
          const fileId = ID.unique();
          const file = await storage.createFile(
            STORAGE_BUCKET_ID,
            fileId,
            buffer,
            {
              'Content-Type': 'image/png'
            }
          );
          
          screenshotUrl = `${process.env.APPWRITE_FUNCTION_ENDPOINT}/storage/buckets/${STORAGE_BUCKET_ID}/files/${file.$id}/view?project=${process.env.APPWRITE_FUNCTION_PROJECT_ID}`;
        } catch (uploadError) {
          log('Screenshot upload failed:', uploadError);
          // Continue without screenshot
        }
      }

      // Create feedback document
      const feedback = await databases.createDocument(
        DATABASE_ID,
        FEEDBACKS_COLLECTION_ID,
        ID.unique(),
        {
          projectId,
          description,
          email: email || null,
          url: url || null,
          screenshotUrl,
          status: 'NEW',
          createdAt: new Date().toISOString()
        }
      );

      return res.json({
        success: true,
        data: {
          id: feedback.$id,
          message: 'Feedback submitted successfully'
        }
      });
    }

    if (req.method === 'GET' && req.path === '/project') {
      const projectId = req.query.id;
      
      if (!projectId) {
        return res.json({
          success: false,
          error: 'Project ID is required'
        }, 400);
      }

      try {
        const project = await databases.getDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, projectId);
        
        return res.json({
          success: true,
          data: {
            id: project.$id,
            name: project.name,
            domain: project.domain,
            title: project.title || 'Send us your feedback',
            subtitle: project.subtitle || 'Help us improve by sharing your thoughts'
          }
        });
      } catch (err) {
        return res.json({
          success: false,
          error: 'Project not found'
        }, 404);
      }
    }

    // Default response for unsupported routes
    return res.json({
      success: false,
      error: 'Endpoint not found'
    }, 404);

  } catch (err) {
    error('Function error:', err);
    return res.json({
      success: false,
      error: 'Internal server error'
    }, 500);
  }
};