interface ErrorCode {
    code: string;
    status: string;
    text?: string;
}
class ErrorFormat<T> {
    code: string;
    status: string;
    message: string;
    data?: T;
    constructor(internalCode: ErrorCode, message: string, data: T) {
        this.code = internalCode.code;
        this.status = internalCode.status;
        this.message = message;
        this.data = data;
    }
}

export default ErrorFormat;