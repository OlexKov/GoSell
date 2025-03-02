import { IAdvert } from "../../../models/advert";

export interface AdvertCardProps{
    isFavorite?: boolean,
    isCompleted?:boolean,
    className?:string,
    advert?:IAdvert
 }