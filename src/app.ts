import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import config from './app/config';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import router from './app/router/router';

const app: Application = express();

const corsOptions = {
  origin: [
    config.client_base_url as string,
    config.live_client_base_url as string,
  ],
  credentials: true,
};

// parser:
app.use(cors(corsOptions));
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
