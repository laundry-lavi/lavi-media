import { z } from "zod";

export const addPublicObject = {
	description: "add-object",
	summary: "Upload one public object",
	tags: ["public"],
	response: {
		201: z.object({
			message: z.string(),
			details: z.object({
				key: z.string(),
				lastModified: z.date(),
				size: z.number(),
				url: z.string(),
			}),
		}),
	},
};
