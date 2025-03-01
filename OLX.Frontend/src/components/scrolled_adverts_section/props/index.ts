import { IAdvert } from "../../../models/advert";

export interface IScrolledAdvertsSectionProps {
    title: string,
    adverts: IAdvert[],
    className?: string,
    cardClassName?:string
}