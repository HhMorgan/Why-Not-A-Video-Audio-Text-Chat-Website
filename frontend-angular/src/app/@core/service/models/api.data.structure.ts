export interface APIData {
    err,
    msg: String,
    data;
}

export interface User {
    email:any,
    password:any,
    role:any,
    onlineStatus: Boolean;
}

export interface Profile {
    email ,
    description,
    password,
    confirmPassword;
}

export interface FileData {
    file: File
  }
