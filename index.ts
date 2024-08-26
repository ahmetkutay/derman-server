import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import hpp from 'hpp';
import xssClean from 'xss-clean';
import router from './routes/index';
import config from './config/config'

const app = express();

const mongoUri: string = config.database.mongodb.dsn as unknown as string;

if (!mongoUri) {
    throw new Error('MongoDB URI is not defined in the environment variables.');
}
mongoose.connect(mongoUri).then(() => {
    console.log('Connected to MongoDB');
}).catch((error: Error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(hpp());
app.use(xssClean());

const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 20
});
app.use(limiter);

app.use('/v1', router);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
