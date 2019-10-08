import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app';

let dbUrl = process.env.DATABASE_URL;
if (process.env.NODE_ENV === 'test') {
  dbUrl = process.env.TEST_DATABASE_URL;
}
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('Db connection successful'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`app listening on port ${process.env.PORT}!`)
);

export default app;
