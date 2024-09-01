import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions, VerifiedCallback } from 'passport-jwt';
import mongoose from 'mongoose';
import config from "../config/config";
import { PassportStatic } from 'passport';
import  {IUser} from '../model/userModel';

const User = mongoose.model<IUser>('User');

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecrets.jwtSecret as string,
};

export const jwtStrategy = (passport: PassportStatic) => {
    passport.use(new JwtStrategy(opts, async (jwtPayload, done: VerifiedCallback) => {
        try {
            const currentTime = Math.floor(Date.now() / 1000);
            if (jwtPayload.exp && currentTime > jwtPayload.exp) {
                return done(null, false, { message: 'Token expired' });
            }

            const user = await User.findById(jwtPayload.userId);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'User not found' });
            }
        } catch (err) {
            return done(err, false);
        }
    }));
};
