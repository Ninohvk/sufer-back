import 'dotenv/config'
// Import the framework and instantiate it
import Fastify from 'fastify'
const fastify = Fastify({
  logger: true,
})

import OpenAI from "openai";

// Declare a route
fastify.get('/', async function handler (request, reply) {
  return { deployState: 'Ok' };
})

// Declare a route
fastify.get('/movies', async function handler (request, reply) {
    console.log('/movies', process.env.OPENAI_API_KEY);
    const openai = new OpenAI({
        apiKey: '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',
    });

    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: "¿cuál es la película donde aparece un tiburon y tiene una canción iconica?" }],
        model: "gpt-3.5-turbo",
    });

  return chatCompletion;
})

// Run the server!
try {
  await fastify.listen({ host: '0.0.0.0', port: 80 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

