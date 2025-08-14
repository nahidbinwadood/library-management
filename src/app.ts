import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import config from './app/config';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import router from './app/router/router';

const app: Application = express();

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173', // Vite default port
  'http://localhost:5174', // Alternative Vite port
  config.client_base_url as string,
  config.live_client_base_url as string,
].filter(Boolean); // Remove any undefined values

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
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
