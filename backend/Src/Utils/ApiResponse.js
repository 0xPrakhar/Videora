class ApiResponse {
    constructor(success, message, data = null,statuscode) {
        this.success = statuscode;
        this.message = message;
        this.data = data;
        this.statuscode = statuscode<400;
    }
}

export {ApiResponse} ;