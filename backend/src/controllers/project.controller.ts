import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma/client';
import { AuthRequest, ApiResponse } from '../types';

const createProjectSchema = z.object({
  name: z.string().min(1),
  domain: z.string().url(),
  description: z.string().optional()
});

const updateProjectSchema = createProjectSchema.partial();

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, domain, description } = createProjectSchema.parse(req.body);

    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
      return;
    }

    const project = await prisma.project.create({
      data: {
        name,
        domain,
        description,
        userId: req.user.id
      }
    });

    res.status(201).json({
      success: true,
      data: project
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

    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
      return;
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        _count: {
          select: {
            feedbacks: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: projects
    } as ApiResponse);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
      return;
    }

    const { id } = req.params;

    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: req.user.id
      },
      include: {
        _count: {
          select: {
            feedbacks: true
          }
        }
      }
    });

    if (!project) {
      res.status(404).json({
        success: false,
        error: 'Project not found'
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: project
    } as ApiResponse);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
      return;
    }

    const { id } = req.params;
    const updates = updateProjectSchema.parse(req.body);

    const project = await prisma.project.findFirst({
      where: {
        id,
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

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updates
    });

    res.json({
      success: true,
      data: updatedProject
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

    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized'
      } as ApiResponse);
      return;
    }

    const { id } = req.params;

    const project = await prisma.project.findFirst({
      where: {
        id,
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

    await prisma.project.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Project deleted successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};