declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DB_ROOT_PASSWORD: string;
            JWT_SECRET: string
            DATABASE_URL: string
        }
    }
}

export { };
