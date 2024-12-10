import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../client";

export const signUp = async (req: Request, res: Response) => {
	try {
		const parsedData = req.body;

		const existingUser = await prisma.user.findUnique({
			where: { email: parsedData.email },
		});
		if (existingUser) {
			res.status(409).json({ error: "User already exists" });
			return;
		}

		const hashedPassword = await bcrypt.hash(parsedData.password, 10);

		const user = await prisma.user.create({
			data: {
				username: parsedData.username,
				email: parsedData.email,
				password: hashedPassword,
				role: parsedData.role,
			},
		});

		const { password, ...userWithoutPassword } = user;

		res.json({
			message: "User registered successfully",
			data: userWithoutPassword,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
