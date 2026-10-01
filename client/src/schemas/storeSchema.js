import { z } from 'zod';

export const storeBasicsSchema = z.object({
  name: z.string().min(3, 'Store name must be at least 3 characters').regex(/^[a-z0-9-_]+$/i, 'Only letters, numbers, hyphens, and underscores'),
  description: z.string().max(200, 'Description cannot exceed 200 characters').optional(),
  port: z.number().int().min(1000).max(65535).default(5000),
  dbName: z.string().min(2, 'Database name is required').default('ecommerce_store')
});
