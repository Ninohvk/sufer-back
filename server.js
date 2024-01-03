// import twilio from "twilio";
import formbody from '@fastify/formbody';
import dotenv from 'dotenv';
const dir = `./.env`;
dotenv.config({path: dir});
const ENV = process.env;

// Import the framework and instantiate it
import Fastify from 'fastify'
const fastify = Fastify({
  logger: true,
})
fastify.register(formbody)


import OpenAI from "openai";

// Declare a route
fastify.get('/', async function handler (request, reply) {
  return { deployState: 'Ok' };
})

// receive message
fastify.post('/movies', async function handler (request, reply) {
  console.log('====== body ======: ', request.body.Body)
  const openAiKey = Buffer.from(ENV.OPENAI_API_KEY, 'base64').toString('utf-8');

  const openai = new OpenAI({
    apiKey: openAiKey,
  });

  const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: request.body.Body }],
      model: "gpt-3.5-turbo",
  });

  const response = chatCompletion.choices[0].message.content;
  console.log('======= chatCompletion ======', chatCompletion.choices[0].message.content)
  return response;
});

// Run the server!
try {
  await fastify.listen({ host: '0.0.0.0', port: 80 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

