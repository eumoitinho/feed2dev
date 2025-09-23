# Feed2Dev Appwrite Functions

This directory contains the Appwrite Functions for the Feed2Dev project.

## Setup

1. Install Appwrite CLI:
```bash
npm install -g appwrite-cli
```

2. Login to your Appwrite account:
```bash
appwrite login
```

3. Deploy the function:
```bash
cd functions
appwrite deploy function
```

## API Endpoints

### POST /feedback
Submit new feedback for a project.

**Request Body:**
```json
{
  "projectId": "string",
  "description": "string",
  "email": "string (optional)",
  "url": "string (optional)",
  "screenshot": "string (base64 optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "feedback_id",
    "message": "Feedback submitted successfully"
  }
}
```

### GET /project?id=PROJECT_ID
Get project configuration for widget initialization.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "project_id",
    "name": "Project Name",
    "domain": "example.com",
    "title": "Send us your feedback",
    "subtitle": "Help us improve by sharing your thoughts"
  }
}
```

## Environment Variables

The function automatically receives these Appwrite environment variables:
- `APPWRITE_FUNCTION_ENDPOINT`
- `APPWRITE_FUNCTION_PROJECT_ID`
- `APPWRITE_API_KEY`

## Database IDs

- Database: `68d2f67900061b5bc926`
- Projects Collection: `68d2f67c000a49ed8139`
- Feedbacks Collection: `68d2f68300087b90de3c`
- Storage Bucket: `68d2f698001ea7b21ee9`