import * as jwt from 'jsonwebtoken';
import config from '../config/config';

class JWT {
    private readonly secretKey: string;
    private readonly accessTokenExpiresIn: string;
    private readonly refreshTokenExpiresIn: string;

    constructor() {
        this.secretKey  = config.jwtSecrets.jwtSecret as string;
        this.accessTokenExpiresIn = config.jwtSecrets.accessTokenExpiration as string;
        this.refreshTokenExpiresIn = config.jwtSecrets.refreshTokenExpiration as string;
    }

    generateAccessToken(payload: object): string {
        return jwt.sign(payload, this.secretKey, { expiresIn: this.accessTokenExpiresIn });
    }

    generateRefreshToken(payload: object): string {
        return jwt.sign(payload, this.secretKey, { expiresIn: parseInt(this.refreshTokenExpiresIn) });
    }

    verifyToken(token: string): object | null {
        try {
            return jwt.verify(token, this.secretKey) as object;
        } catch (err) {
            return null;
        }
    }
    isRefreshTokenExpired(token: string): boolean {
        try {
            jwt.verify(token, this.secretKey);
            return false;
        } catch (err) {
            return true;
        }
    }
    extractTokenVariables(token: string): { [key: string]: any } | null {
        try {
            const decodedToken = jwt.decode(token);
            if (typeof decodedToken === 'object' && decodedToken !== null) {
                return decodedToken as { [key: string]: any };
            }
            return null;
        } catch (err) {
            return null;
        }
    }
}

export default JWT;