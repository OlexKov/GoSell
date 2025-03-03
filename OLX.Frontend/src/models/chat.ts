import { IChatOlxUserDto } from "./user"

export interface IChat {
    id: number
    buyer:IChatOlxUserDto
    seller:IChatOlxUserDto
    createAt: string
    advert:ISmallAdvert
}



export interface ISmallAdvert{
    id: number
    image: string
    title:string
    price:number
}

export interface IChatMessage {
    id: number
    content: number
    sender: IChatOlxUserDto
    chatId: number
    readed: boolean
    createdAt: string
}

export interface IChatMessageSendModel {
    chatId: number
    message: string
}

export interface IChatCreationModel {
    message: string
    advertId: number
}