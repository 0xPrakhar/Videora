class ApiError extends Error{
    constructor(message="Something went wrong", code
        ,error=[],
        stack="",
    ){
        super(message);
        this.code = code;
        this.error = error;
        this.stack = stack;
        this.data=null;
        this.success=false;
        if(stack){
this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;