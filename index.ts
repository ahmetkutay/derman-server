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
import passport from 'passport';
import { jwtStrategy } from './passport/jwtStrategy';

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
app.set("trust proxy",1)

const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 200
});
app.use(limiter);

app.use(passport.initialize())
jwtStrategy(passport)

app.use('/v1', router);

app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send('This is a protected route');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
