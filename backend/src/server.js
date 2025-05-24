import Hapi from '@hapi/hapi';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

const init = async () => {
  const server = Hapi.server({ 
    port: 3000, 
    host: 'localhost',
    routes: {
    cors: {
        origin: ['*'],
        credentials: true,
      },
    }, 
  });
  
    await server.register([
    {
      plugin: userRoutes,
      options: {},
      routes: { prefix: '/api' }
    },
    {
      plugin: authRoutes,
      options: {},
      routes: { prefix: '/api' }
    }
  ]);

  await server.start();
  console.log('Server running at', server.info.uri);
};

init();
