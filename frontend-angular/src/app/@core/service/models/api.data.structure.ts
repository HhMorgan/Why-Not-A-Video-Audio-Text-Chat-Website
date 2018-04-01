export interface APIData {
    err,
    msg: String,
    data;
}

export interface User {
    email:any,
    password:any,
    role:any
}

export interface Profile {
    email ,
    description,
    password,
    confirmPassword;
}
