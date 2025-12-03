import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  client_local_url: process.env.CLIENT_LOCAL_URL,
  client_live_url: process.env.CLIENT_LIVE_URL,
  database_url: process.env.DATABASE_URL,
};
