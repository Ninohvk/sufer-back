import Fastify from 'fastify'
import formbody from '@fastify/formbody';
import dotenv from 'dotenv';
import OpenAI from "openai";

// Configuración de environment
dotenv.config({path: `./.env`});
const ENV = process.env;

// Import the framework and instantiate it
const fastify = Fastify({
  logger: true,
})
fastify.register(formbody)

// Data
let conversations = []

// Declare a route
fastify.get('/', async function handler (request, reply) {
  return { deployState: 'Ok' };
})

// receive message
fastify.post('/movies', async function handler (request, reply) {
  console.log('================= init /movies =================')
  const openAiKey = Buffer.from(ENV.OPENAI_API_KEY, 'base64').toString('utf-8');
  const id = request.body.WaId ? request.body.WaId : '2122';

  const openai = new OpenAI({
    apiKey: openAiKey,
  });

  let currentConversation = null
  const currentUserMessage = { role: "user", content: request.body.Body }

  if(!conversations[id]) {
      currentConversation = {
      id,
      messages: [
        { role: "system", content: "Actua como un asistente experto en películas, solo habla de temas relacionados a películas, si te preguntan o hablan de otro tema indica que no tienes permitido hablar de otro tema." },
        currentUserMessage
      ]
    }
  }
  else {
    currentConversation = conversations[id];
    currentConversation.messages.push(currentUserMessage)
  }

  const chatCompletion = await openai.chat.completions.create({
      messages: currentConversation.messages,
      model: "gpt-3.5-turbo",
  });

  const response = chatCompletion.choices[0].message.content;
  currentConversation.messages.push(chatCompletion.choices[0].message);
  conversations[id] = currentConversation;

  console.log("####### conversations ##########:")
  console.dir(conversations, { depth: null, colors: true })
  console.log('================= end /movies =================')
  return response;
});

// Run the server!
try {
  await fastify.listen({ host: '0.0.0.0', port: 80 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}

