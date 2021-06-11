import '../utils/shims';
import mongoose from 'mongoose';
let connectionString;
if (process.env.NODE_ENV === 'production') {
  connectionString = process.env.DB_URL;
} else {
  connectionString = 'mongodb://localhost/healthfulKitchen';
}

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.once('open', () => {
  console.log(`connected to mongodb at ${db.host}:${db.port}`);
});
db.on('error', error => {
  console.error('[error]', 'database', error);
});

// export all models
export { User } from './User';
export { Book } from './Book';

