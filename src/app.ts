import express from 'express';
import router from './router';
import swaggerAutogen from 'swagger-autogen';


const app = express();

app.use(express.json());
app.use(router);


const doc = {
    info: {
      title: 'My API',
      description: 'Description'
    },
    host: 'localhost:3000'
  };
  
  const outputFile = './swagger.json';

  const routes = ['./router.ts'];

  swaggerAutogen(outputFile, routes, doc);


export default app;
