export interface APIData {
    err,
    msg: String,
    data;
}

export interface User {
    username : any,
    email:any,
    password:any,
    role:any,
    rating:any,
    numberofsessions:any,
    img:Blob,
    onlineStatus: Boolean;
}
export interface Tags {
    _id:String;
    name: String;
    status: String;
    blocked: Boolean;
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

  export interface SlotData{
    slotDate1: String;
    slotTime1: String;
    slotDate2: String;
    slotTime2: String;
    slotDate3: String;
    slotTime3: String;
}
    
export interface RequestData{
    sender: String;  
    recipient: String;
    status: String;
    createdAt: String;
    viewed:Boolean;
    type: String;   
  }
  export interface Session {
    sessionId : String;
    userId : String;
}

export interface CandicateSession extends Session {
    rtcDes : String;
}
export interface Request{
    _id:String;
    user: String;
    createdAt: String;
    status: String;
    viewed: boolean;
  }