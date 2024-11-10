import Fastify from 'fastify';
import { bucket } from './server/firebaseAdmin';

const fastify = Fastify({
  logger: true
});

fastify.get('/', async (request, reply) => {
  return { hello: 'world' };
});

fastify.get('/upload', async (request, reply) => {
  //exemplo blocos de código para upload de arquivos para o Firebase Storage - não se preocupe com isso agora, iremos alterar no futuro.
  const file = bucket.file('/path/to/file'); // vamos substituir o caminho quando tivermos o caminho real
  await file.save('This is the contents of the file.', { resumable: false });
  reply.send({ message: 'File uploaded successfully!' });
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001 });
    console.log('Server is running at http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
