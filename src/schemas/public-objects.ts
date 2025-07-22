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

export const getPublicObjects = {
  params: z.object({
    object_id: z.string(),
  }),
  response: {
    201: z.object({
      data: z.object({
        objects: z.array(
          z.object({
            key: z.string(),
            url: z.string(),
            size: z.number(),
            lastModified: z.date(),
          })
        ),
      }),
    }),
  },
  tags: ["public"],
  summary: "Get an objects list by your key prefix or your complete key",
};

export const deletePublicObject = {
  params: z.object({
    object_id: z.string(),
  }),

  response: {
    204: z.null(),
  },
  tags: ["public"],
  summary: "Delete an public object by your complete key",
};
