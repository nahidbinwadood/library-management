import mongoose from 'mongoose';
import app from './app';

let server;

const PORT = 7000;

const uri = `mongodb+srv://library_management:9MP8wjS6nHohPXlI@cluster0.s1tjtzs.mongodb.net/library-management?retryWrites=true&w=majority&appName=Cluster0`;

async function main() {
  try {
    await mongoose.connect(uri);
    console.log('Connected with Mongoose !');
    server = app.listen(PORT, () => {
      console.log('The server is Running');
    });
  } catch (err) {
    console.log(err);
  }
}

main();
