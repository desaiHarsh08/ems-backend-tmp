class ApiResponse {
    constructor (statusCode, payload, message = "Success") {
        this.statusCode = statusCode;
        this.success = statusCode < 400;
        this.payload = payload;
        this.message = message;
    }
}

export default ApiResponse;