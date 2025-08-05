import express, { Application, Request, Response } from 'express';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import router from './app/router/router';

const app: Application = express();

// parser:

app.use(express.json());

// routes==>
app.use('/api', router);

// test api==>
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'The server is running !',
  });
});

// middlewares=>
app.use(globalErrorHandler);

export default app;
