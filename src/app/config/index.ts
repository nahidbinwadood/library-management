import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  client_base_url: process.env.CLIENT_BASE_URL,
  live_client_base_url: process.env.LIVE_CLIENT_BASE_URL,
  database_url: process.env.DATABASE_URL,
  server_base_url: process.env.SERVER_BASE_URL,
};
