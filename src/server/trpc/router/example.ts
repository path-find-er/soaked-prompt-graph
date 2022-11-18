import { z } from 'zod';

import { publicProcedure, router } from '../trpc';

export const openAiRouter = router({
  hello: publicProcedure
    .input(z.object({ prompt: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? 'world'}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
});
