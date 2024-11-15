import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users)

  } catch (error: any) {
    res.status(500).json({
		message: `Error retrieving users: ${error.message} `,
	});
  }
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { cognitoId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        cognitoId:cognitoId
      }
    })

    if (!user) {
      res.status(400).json({message: `User not found id:${cognitoId} `});
    }
    res.status(200).json( user);
  } catch (e: any) {
    res.status(500).json({
      message: `Error retrieving user: ${e.message}`
    })

  }
}

export const postUser = async (req: Request, res: Response) => {
	try {
		const {
			username,
			cognitoId,
			profilePictureUrl = "i1.jpg",
			teamId = 1,
		} = req.body;
		const newUser = await prisma.user.create({
			data: {
				username,
				cognitoId,
				profilePictureUrl,
				teamId,
			},
		});
		res.json(newUser);
	} catch (error: any) {
		res.status(500).json({
			message: `Error retrieving users: ${error.message}`,
		});
	}
};
