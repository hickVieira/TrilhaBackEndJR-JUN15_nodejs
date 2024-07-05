declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ADMINER_PORT: string;
            APP_PORT: string;
            APP_HOST: string;
            DB_PORT: string;
            DB_HOST: string;
            DB_NAME: string;
            DB_ROOT_PASSWORD: string;
            DB_USER: string;
        }
    }
}

export { };
