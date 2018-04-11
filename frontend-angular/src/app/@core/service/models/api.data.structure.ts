export interface APIData {
    err,
    msg: String,
    data;
}

export interface Session {
    sessionId : String;
    userId : String;
}

export interface CandicateSessionData extends Session {
    rtcDes : String;
}

export interface SessionData extends Session {
    userId : String;
}