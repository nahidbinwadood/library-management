import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

let server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('Connected with Mongoose !');
    server = app.listen(config.port, () => {
      console.log('The server is Running');
    });
  } catch (err) {
    console.log(err);
  }
}

main();
