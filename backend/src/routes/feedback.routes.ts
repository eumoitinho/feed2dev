import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import {
  createFeedback,
  getFeedbacks,
  getFeedback,
  updateFeedbackStatus,
  addComment
} from '../controllers/feedback.controller';

const router = Router();

// Public route for widget to submit feedback
router.post('/', createFeedback);

// Protected routes
router.get('/project/:projectId', authMiddleware, getFeedbacks);
router.get('/:id', authMiddleware, getFeedback);
router.patch('/:id/status', authMiddleware, updateFeedbackStatus);
router.post('/:feedbackId/comments', authMiddleware, addComment);

export default router;