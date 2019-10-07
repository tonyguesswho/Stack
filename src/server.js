import 'dotenv/config';
import mongoose from 'mongoose'
import app from './app'

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('Db connection successful'));

const PORT = process.env.PORT || 3000
app.listen(PORT, () =>
  console.log(`app listening on port ${process.env.PORT}!`)
);
  