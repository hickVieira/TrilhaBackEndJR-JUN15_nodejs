import njwt from 'njwt';

export default class utils {
    static readonly algo: string = "HS256";

    public static create_token(payload: any, secret: string, expiresHours: number): njwt.Jwt {
        const jwt: njwt.Jwt = njwt.create(payload, secret, this.algo);
        jwt.setExpiration(new Date().getTime() + (expiresHours * 60 * 60 * 1000));
        return jwt;
    }

    public static verify_token(token: string, secret: string): njwt.Jwt | undefined {
        return njwt.verify(token, secret, this.algo);
    }
}