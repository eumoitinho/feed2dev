import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma/client';
import { AuthRequest, ApiResponse } from '../types';
import { Status } from '@prisma/client';

const createFeedbackSchema = z.object({
  projectId: z.string(),
  description: z.string().min(1),
  screenshot: z.string().optional(),
  email: z.string().email().optional(),
  metadata: z.object({
    browser: z.string().optional(),
    os: z.string().optional(),
    screenResolution: z.string().optional(),
    viewport: z.string().optional()
  }).optional()
});

const updateStatusSchema = z.object({
  status: z.enum(['NEW', 'IN_PROGRESS', 'RESOLVED', 'ARCHIVED'])
});

const addCommentSchema = z.object({
  text: z.string().min(1),
  author: z.string().min(1)
});

export const createFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createFeedbackSchema.parse(req.body);
    const userAgent = req.headers['user-agent'] || '';
    const referer = req.headers['referer'] || '';

    const project = await prisma.project.findUnique({
      where: { id: data.projectId }
    });

    if (!project) {
      res.status(404).json({
        success: false,
        error: 'Project not found'
      } as ApiResponse);
      return;
    }

    const feedback = await prisma.feedback.create({
      data: {
        projectId: data.projectId,
        description: data.description,
        screenshot: data.screenshot,
        email: data.email,
        userAgent,
        url: referer,
        metadata: data.metadata || {}
      }
    });

    res.status(201).json({
      success: true,
      data: feedback
    } as ApiResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Invalid input data',
        data: error.errors
      } as ApiResponse);
      return;
    }

    console.error('Create feedback error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getFeedbacks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
      return;
    }

    const { projectId } = req.params;
    const { status, page = '1', limit = '20' } = req.query;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.user.id
      }
    });

    if (!project) {
      res.status(404).json({
        success: false,
        error: 'Project not found'
      } as ApiResponse);
      return;
    }

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const where: any = { projectId };
    if (status) {
      where.status = status as Status;
    }

    const [feedbacks, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        include: {
          comments: {
            orderBy: {
              createdAt: 'desc'
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limitNumber
      }),
      prisma.feedback.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        feedbacks,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          totalPages: Math.ceil(total / limitNumber)
        }
      }
    } as ApiResponse);
  } catch (error) {
    console.error('Get feedbacks error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
      return;
    }

    const { id } = req.params;

    const feedback = await prisma.feedback.findFirst({
      where: { id },
      include: {
        project: {
          select: {
            userId: true
          }
        },
        comments: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!feedback) {
      res.status(404).json({
        success: false,
        error: 'Feedback not found'
      } as ApiResponse);
      return;
    }

    if (feedback.project.userId !== req.user.id) {
      res.status(403).json({
        success: false,
        error: 'Forbidden'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: feedback
    } as ApiResponse);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const updateFeedbackStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
      return;
    }

    const { id } = req.params;
    const { status } = updateStatusSchema.parse(req.body);

    const feedback = await prisma.feedback.findFirst({
      where: { id },
      include: {
        project: {
          select: {
            userId: true
          }
        }
      }
    });

    if (!feedback) {
      res.status(404).json({
        success: false,
        error: 'Feedback not found'
      } as ApiResponse);
      return;
    }

    if (feedback.project.userId !== req.user.id) {
      res.status(403).json({
        success: false,
        error: 'Forbidden'
      } as ApiResponse);
      return;
    }

    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: { status: status as Status }
    });

    res.json({
      success: true,
      data: updatedFeedback
    } as ApiResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Invalid input data',
        data: error.errors
      } as ApiResponse);
      return;
    }

    console.error('Update feedback status error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
      return;
    }

    const { feedbackId } = req.params;
    const { text, author } = addCommentSchema.parse(req.body);

    const feedback = await prisma.feedback.findFirst({
      where: { id: feedbackId },
      include: {
        project: {
          select: {
            userId: true
          }
        }
      }
    });

    if (!feedback) {
      res.status(404).json({
        success: false,
        error: 'Feedback not found'
      } as ApiResponse);
      return;
    }

    if (feedback.project.userId !== req.user.id) {
      res.status(403).json({
        success: false,
        error: 'Forbidden'
      } as ApiResponse);
      return;
    }

    const comment = await prisma.comment.create({
      data: {
        feedbackId,
        text,
        author
      }
    });

    res.status(201).json({
      success: true,
      data: comment
    } as ApiResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Invalid input data',
        data: error.errors
      } as ApiResponse);
      return;
    }

    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};