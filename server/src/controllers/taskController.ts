import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { error } from 'console';


const prisma = new PrismaClient();

//validate zod
const createTaskSchema = z.object({
	title: z.string().min(1, { message: "Title is required" }),
	description: z.string().min(5, {
		message: "Description is required and has at least 5 characters",
	}),
	status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
	priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
	tags: z.string({ message: "Tags is required" }),
	startDate: z
		.string({ message: "Start date is required" })
		.refine((date) => !isNaN(Date.parse(date)), {
			message: "Start Date must have data type datetime",
		}),
	dueDate: z
		.string({ message: "Start date is required" })
		.refine((date) => !isNaN(Date.parse(date)), {
			message: "Start Date must have data type datetime",
		}),
	points: z.number().int().optional(),
	projectId: z.number().int(),
	authorUserId: z.number().int(),
	assignedUserId: z.number().int().optional(),
});

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query
  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId:Number(projectId)
      },
      include: {
        author: true,
        assignee: true,
        comments: true,
        attachments:true
      }
    })
    res.status(200).json(tasks)
  } catch (error:any) {
    res.status(500).json({
      message:`Error getting tasks: ${error}`
    })
  }
}

export const createTasks = async (req: Request, res: Response): Promise<void> => {
  const result = createTaskSchema.safeParse(req.body);

  if(!result.success){
    res.status(400).json({
      message: 'Valedation failed',
      errors: result.error.errors
    })
  }

  const {
		title,
		description,
		status,
		priority,
		tags,
		startDate,
		dueDate,
		points,
		projectId,
		authorUserId,
		assignedUserId,
  } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        points,
        projectId,
        authorUserId,
        assignedUserId,
      },
    });

    res.status(200).json({
      message: 'Create Task created successfully',
      data:newTask
    })

  } catch (error:any) {
    res.status(500).json({
      message:`Error creating a task: ${error.message}`,
    })

  }
}

export const updateTaskStatus = async(
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const updateTask = await prisma.task.update({
      where: {
        id:Number(taskId)
      },
      data: {
        status:status
      }
    })
    res.status(200).json({
      message: 'Task updated successfully',
      data:updateTask
    })
  } catch (e: any) {
    res.status(500).json({
      message:`Error updating task: ${e.message}`
    })
  }

}

export const getUserTasks = async (req: Request, res: Response): Promise<void> => {
  const {userId} = req.params
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { authorUserId: Number(userId) },
          { assignedUserId: Number(userId) },
        ],
      },
      include: {
        author: true,
        assignee: true,
      },
    });
    res.status(200).json(tasks);
  } catch (error:any) {
    res.status(500).json({
      message: `Error get user tasks: ${error.message}`
    })
  }

}
