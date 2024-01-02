import twilio from "twilio";
import formbody from '@fastify/formbody';
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
fastify.register(formbody)


import OpenAI from "openai";

// Declare a route
fastify.get('/', async function handler (request, reply) {
  return { deployState: 'Ok' };
})

// // get name of movie
// fastify.get('/movies', async function handler (request, reply) {
//     const openai = new OpenAI({
//         apiKey: ENV.OPENAI_API_KEY,
//     });

//     const chatCompletion = await openai.chat.completions.create({
//         messages: [{ role: "user", content: "¿cuál es la película donde aparece un tiburon y tiene una canción iconica?" }],
//         model: "gpt-3.5-turbo",
//     });

//   return chatCompletion;
// })

// receive message
fastify.post('/movies', async function handler (request, reply) {
  console.log('====== body ======: ', request.body.Body)

  const openai = new OpenAI({
    apiKey: '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',
  });

  const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: request.body.Body }],
      model: "gpt-3.5-turbo",
  });

  const response = chatCompletion.choices[0].message.content;
  console.log('======= chatCompletion ======', chatCompletion.choices[0].message.content)
  return response;
});

// // send message
// fastify.get('/send-message', async function handler (request, reply) {
//   const accountSid = ENV.TWILIO_ACCOUNT_SID;
//   const authToken = ENV.TWILIO_AUTH_TOKEN;
//   const client = twilio(accountSid, authToken);

//   client.messages
//     .create({
//       mediaUrl: ['https://images.unsplash.com/photo-1545093149-618ce3bcf49d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80'],
//       from: 'whatsapp:+14155238886',
//       to: 'whatsapp:+56975735503'
//     })
//     .then(message => console.log(message.sid));
//   return request.body | '/movies';
// })

// Run the server!
try {
  await fastify.listen({ host: '0.0.0.0', port: 80 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

