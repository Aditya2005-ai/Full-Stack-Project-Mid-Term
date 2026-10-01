import { z } from 'zod';

export const moduleSelectionSchema = z.object({
  selectedModules: z.array(z.string()).min(1, 'Please select at least one module')
});
