import { Jwt, create } from 'njwt';

export default class utils {
    public static create_token(payload: any, secret: string, expiresHours: number): Jwt {
        const jwt: Jwt = create(payload, secret, "HS256");
        jwt.setExpiration(new Date().getTime() + (expiresHours * 60 * 60 * 1000));
        return jwt;
    }
}