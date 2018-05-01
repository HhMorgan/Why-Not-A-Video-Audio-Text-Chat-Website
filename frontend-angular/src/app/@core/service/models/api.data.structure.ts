export interface APIData {
    err,
    msg: String,
    data;
}

export interface Token {
    _id: String,
    username: String,
    role: String,
}

export interface User {
    _id: String;
    username: any,
    email: any,
    password: any,
    role: any,
    rating: any,
    numberofsessions: any,
    img: Blob,
    onlineStatus: Boolean,
    CoverImg: Blob,
    blocked: Boolean;
}

export interface Tag {
    _id: String;
    name: String;
    status: String;
    blocked: Boolean;
    color: { name: string };
}

export interface Color {
    name: string
}

export interface Profile {
    email,
    description,
    password,
    rating,
    confirmPassword,
    oldPassword
}

export interface Request {
    _id: String;
    user: String;
    createdAt: String;
    status: String;
    viewed: boolean;
}

export interface FileData {
    file: File
}

export interface Session {
    sessionId: String;
    userId: String;
}

export interface CandicateSession extends Session {
    rtcDes: String;
}

export interface Slots {
    expertId: String;
    date: Date;
    slots: [oneSlot]
}

export interface oneSlot extends Slots {
    sessionId: String;
    date: Date;
    usersAccepted: [User];
    usersRequested: [User]
}

export interface RequestData {
    sender: String;
    recipient: String;
    status: String;
    createdAt: String;
    viewed: Boolean;
    type: String;
}

export interface Notification {
    sender: String,
    recipient: String,
    status: String,
    type: String,
    createdAt: Date
}

export interface OfferedSlots {
    user_email: String;
    expert_email: String;
    slots: [String];
    status: String;
}

export interface OfferSlotBody {
    dayNo: String,
    slotNo: String
}

export interface ReserveSlotBody extends OfferSlotBody {
    expertID: String;
}

export interface ExpertAcceptSlotBody extends OfferSlotBody {
    userid: String;
}