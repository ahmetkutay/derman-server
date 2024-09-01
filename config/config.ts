import dotenv from 'dotenv';
import * as process from "node:process";

dotenv.config({path: __dirname + '/../.env'});

interface Config {
    database: {
        mongodb: {
            dsn: string | undefined
        }
    },
    jwtSecrets: {
        jwtSecret: string | undefined,
        accessTokenExpiration: string | undefined,
        refreshTokenExpiration: string | undefined,
    },
    email:{
        email: string,
        password: string,
    },
    webSocket: {
        port: number | undefined,
    }
}

const config: Config = {
    database: {
        mongodb: {
            dsn: process.env.MONGO_URI
        },
    },
    jwtSecrets: {
        jwtSecret: process.env.JWT_SECRET,
        accessTokenExpiration: process.env.ACCESSTOKENEXPIRATION,
        refreshTokenExpiration: process.env.REFRESHTOKENEXPIRATION,
    },
    email: {
        email: process.env.EMAIL as string,
        password: process.env.EMAIL_PASSWORD as string,
    },
    webSocket: {
        port: process.env.WEB_SOCKET as unknown as number,
    }
};

export default config;