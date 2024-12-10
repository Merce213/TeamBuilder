import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

export const validateData =
	(schema: ZodSchema) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const parseBody = await schema.parseAsync(req.body);
			req.body = parseBody;
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				console.error('Error : ', error)
				const errorMessages = error.errors.map((issue) => ({
					field: issue.path.join("."),
					message: issue.message,
				}));
				res.status(400).json({
					error: "Invalid data",
					details: errorMessages,
				});
			} else {
				res.status(500).json({
					error: "Internal Server Error",
				});
			}
		}
	};
