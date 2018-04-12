export interface APIData {
    err,
    msg: String,
    data;
}

export interface User {
    email : any,
    password : any,
    role : any,
    username : any
}

export interface Profile {
    email ,
    description ,
    password ,
    confirmPassword;
}

export interface FileData {
    file: File
}

export interface Session {
    sessionId : String;
    userId : String;
}

export interface CandicateSession extends Session {
    rtcDes : String;
}
