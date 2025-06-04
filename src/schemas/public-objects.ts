import { z } from "zod";

export const addPublicObject = {
	description: "add-object",
	summary: "Upload one public object",
	tags: ["public"],
	body: z.object({
		objectName: z.string(),
	}),
	response: {
		201: z.object({
			message: z.string(),
		}),
	},
};
