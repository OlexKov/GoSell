import { PageRequest } from "./user"

export interface IAdminMesssage {
    id: number
    userName: string
    userId: number
    readed: boolean
    message: IMesssage
    created: string
}

export interface IMesssage {
    id: number
    content: string
    subject: string
}

export interface IAdminMesssageCreationModel {
    content: string
    userId?: number
    subject: string
    userIds?: number[]
}

export interface IAdminMesssagePageRequest extends PageRequest{
    readed?:boolean
    deleted?:boolean
}