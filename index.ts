import express, { Express } from 'express';
import logger from './src/middlewares';
import router from './src/routes';

const server: Express = express();

server.use(logger);
server.use(express.json());
server.use('/api', router);

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});