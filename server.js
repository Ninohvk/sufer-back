import path from 'path';
import dotenv from 'dotenv';
const dir = `./.env`;
dotenv.config({path: path.resolve(process.env.NODE_ENV? `${dir}.${process.env.NODE_ENV}` : dir)});
const ENV = process.env;

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
    const openai = new OpenAI({
        apiKey: ENV.OPENAI_API_KEY,
    });

    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: "¿cuál es la película donde aparece un tiburon y tiene una canción iconica?" }],
        model: "gpt-3.5-turbo",
    });

  return chatCompletion;
})

// Declare a route
fastify.post('/movies', async function handler (request, reply) {
  // const openai = new OpenAI({
  //     apiKey: ENV.OPENAI_API_KEY,
  // });

  // const chatCompletion = await openai.chat.completions.create({
  //     messages: [{ role: "user", content: "¿cuál es la película donde aparece un tiburon y tiene una canción iconica?" }],
  //     model: "gpt-3.5-turbo",
  // });
  console.log('request', request)
  console.log('reply', reply)
  return request.body | '/movies';
})

// Run the server!
try {
  await fastify.listen({ host: '0.0.0.0', port: 80 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

