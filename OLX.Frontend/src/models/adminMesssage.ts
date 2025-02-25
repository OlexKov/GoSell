export interface IAdminMesssage {
    id:number
    userName: string
    userId: number
    readed: boolean
    message:IMesssage
}

export interface IMesssage{
    id:number
    content: string
    subject: string
}

export interface IAdminMesssageCreationModel {
    content: string
    userId?: number
    subject: string
    userIds?:number[]
}