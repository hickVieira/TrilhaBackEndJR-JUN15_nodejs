import supertest from "supertest"
import njwt from 'njwt';
import utils from "../src/utils";

export default class test_utils {
    public static async login_user(request: supertest.Agent, email: string, password: string): Promise<[any, string]> {
        const loginResponse = await request.post("/login").send({
            email: "john@example.com",
            password: "password123"
        })

        let userToken = loginResponse.body.token
        expect(userToken).toBeDefined()

        let jwt = utils.verify_token(userToken, process.env.JWT_SECRET)
        expect(jwt).toBeDefined()
        jwt = jwt as njwt.Jwt

        const payload = jwt.body.toJSON() as any
        expect(payload).toHaveProperty("id")
        expect(payload).toHaveProperty("name")
        expect(payload).toHaveProperty("email")

        return [payload, userToken]
    }
}