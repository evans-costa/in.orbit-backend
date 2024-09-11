import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import z from 'zod';
import { createGoal } from '../services/create-goal';
import { getWeekPendingGoals } from '../services/get-week-pending-goals';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get('/pending-goals', async () => {
  const { pendingGoals } = await getWeekPendingGoals();

  return pendingGoals;
});

app.post(
  '/goals',
  {
    schema: {
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().int().min(1).max(7),
      }),
    },
  },
  async (request, reply) => {
    const { title, desiredWeeklyFrequency } = request.body;

    const result = await createGoal({
      title,
      desiredWeeklyFrequency,
    });

    return reply.status(201).send(result);
  }
);

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running...');
});
