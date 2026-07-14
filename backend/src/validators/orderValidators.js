const { z } = require('zod');

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

const updateStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

module.exports = { updateStatusSchema, ORDER_STATUSES };
