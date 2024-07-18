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

    public static format_date_to_sql(date: Date): string {
        return new Date(date).toISOString().slice(0, 19).replace("T", " ")
        // return date.toISOString().split('T')[0] as string;
        // return date.toISOString().slice(0, 19).replace('T', ' ');
    }

    public static extract_token_payload(token: string): njwt.Jwt | undefined {
        const jwt = this.verify_token(token, process.env.JWT_SECRET);
        const payload = jwt?.body.toJSON() as any
        return payload
    }
}