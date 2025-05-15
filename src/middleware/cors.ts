import cors from 'cors';

export const corsOptions = {
  origin: ['https://smailenvargas.com', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export const corsMiddleware = cors(corsOptions);
