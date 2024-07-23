export default class Err extends Error {
    errorCode: number;

    constructor(errorCode: number, message: string) {
        super();
        this.errorCode = errorCode;
        this.message = message;
    }
}