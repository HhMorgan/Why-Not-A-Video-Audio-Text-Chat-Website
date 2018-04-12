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

export interface SlotData{
    expertName:String;
    slotDate1: String;
    slotTime1: String;
    slotDate2: String;
    slotTime2: String;
    slotDate3: String;
    slotTime3: String;
}
    
  
