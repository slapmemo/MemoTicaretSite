const { z } = require('zod');

const addItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).default(1),
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(1),
});

module.exports = { addItemSchema, updateItemSchema };
