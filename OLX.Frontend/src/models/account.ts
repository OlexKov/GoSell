
export interface IUser {
    id: number
    firstName: string
    lastName: string
    email: string
    photo: string
    exp: number
    roles: string[],
    phone: string,
    settlement: string,
    website?: string
}

export interface IUserState {
    user: IUser | null
    auth: IUserAuth
    token: string | null
    refreshToken: string | null
}

export interface IRegisterRequest {
    email: string
    password: string
    passwordConfirmation: string
    action: string
    recapthcaToken: string
}

export interface IUserAuth {
    isAdmin: boolean
    isUser: boolean
    isAuth: boolean,
    remember: boolean,
    roles: string[]
    location: string
}

export interface IAuthResponse {
    accessToken: string,
    refreshToken: string
}

export interface ILoginRequest {
    email: string,
    password: string
    recapthcaToken: string
    action: string
}

export interface ILoginLocalRequest extends ILoginRequest {
    remember: boolean | undefined
}

export interface IGoogleLoginRequest {
    token: string,
    remember: boolean | undefined
}

export interface IEmailConfirmationModel {
    id: string
    token: string
}

export interface IResetPasswordModel {
    userId: string
    token: string
    password: string
}

export interface IUserLockModel {
    userIds: number[]
    lock: boolean
    lockoutEndDate?: string
    lockReason?: string
}

export interface IUserEditResponse {
    accessToken: string;
}

export interface IUserEditModel {
    id: number
    email: string
    firstName?: string
    imageFile?: File
    lastName?: string
    phoneNumber?: string
    settlementRef?: string
    website?: string
    oldPassword?: string
    password?: string
    passwordConfirmation?: string
    recapthcaToken?: string
    action?: string
}




