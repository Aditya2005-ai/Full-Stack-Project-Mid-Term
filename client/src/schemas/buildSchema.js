import { z } from 'zod';

export const buildConfigSchema = z.object({
  projectName: z.string().min(3),
  modules: z.array(z.string()),
  options: z.record(z.any()).default({})
});
