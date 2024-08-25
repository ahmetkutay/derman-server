import dotenv from 'dotenv';

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
    }
}

const config: Config = {
    database: {
        mongodb: {
            dsn: process.env.MONGO_URI
        },
    },
    jwtSecrets: {
        jwtSecret: process.env.JWTSECRET,
        accessTokenExpiration: process.env.ACCESSTOKENEXPIRATION,
        refreshTokenExpiration: process.env.REFRESHTOKENEXPIRATION,
    }
};

export default config;