import { useNavigate } from "react-router-dom"
import { formatPrice, formattedDate, getFormatDateTime } from "../../utilities/common_funct"
import PrimaryButton from "../buttons/primary_button"
import ToggleFavoriteButton from "../buttons/toggle_favorite_button"
import UserRating from "../user_rating"
import { IAdvertInfoProps } from "./props"
import { useAppSelector } from "../../redux"
import AdvertButtonMenu from "../buttons/button_menu"


const AdvertInfo: React.FC<IAdvertInfoProps> = ({ advert, buttons = true }) => {
    const user = useAppSelector(state => state.user.user)
    const navigate = useNavigate();
    return (
        <div className=" flex flex-1 flex-col justify-between gap-[8vh]">
            <div className=" flex flex-col gap-[8vh]">
                <div className="flex  justify-between relative">
                    <div className="flex  flex-col gap-[3vh]">
                        <span className="font-unbounded text-adaptive-advert-page-price-text font-medium">{formatPrice(advert?.price || 0)} грн.</span>
                        <span className="font-unbounded text-adaptive-card-price-text font-medium">{advert?.title}</span>
                    </div>
                    {buttons
                        ? !advert?.completed && user?.id != advert?.userId
                            ? <ToggleFavoriteButton
                                advertId={advert?.id || 0}
                                isAdvertPage
                                className="w-[7%] absolute right-0" />
                            : <AdvertButtonMenu
                                id={advert?.id || 0}
                                isEdit={true}
                                isComplete={true}
                                className="w-[7%] absolute right-0" />
                        : <></>
                    }
                </div>
                <div className="flex flex-col w-[28vw] gap-[1vh]">
                    <span className="font-unbounded text-adaptive-card-price-text font-medium">Опис</span>
                    <span className="font-montserrat text-adaptive-card-price-text ">{advert?.description}</span>
                </div>
            </div>
            <div className=" flex flex-col gap-[6vh]">
                {
                    !advert?.completed && !advert?.blocked
                        ? buttons &&
                        <div className="flex flex-col gap-[2.4vh]">
                            <PrimaryButton
                                title={"Купити зараз"}
                                bgColor="#9B7A5B"
                                fontColor="white"
                                fontSize="clamp(14px, 2.1vh, 36px)"
                                isLoading={false}
                                className="h-[4.6vh] w-[22vw] "
                                onButtonClick={() => navigate(`/user/advert/buy/${advert?.id}`)}
                                disabled={user?.id == advert?.userId} />
                            <PrimaryButton
                                title={"Написати продавцю"}
                                isLoading={false}
                                bgColor="transparent"
                                fontColor="#3A211C"
                                brColor="#9B7A5B"
                                fontSize="clamp(14px, 2.1vh, 36px)"
                                className="h-[4.6vh] w-[22vw] border-2"
                                onButtonClick={() => navigate(`/user/chat?id=${advert?.id}`)}
                                disabled={user?.id == advert?.userId} />
                        </div>

                        : <div className="h-[6vh] content-center rounded-sm bg-slate-100 text-center text-slate-400 font-unbounded text-adaptive-card-price-text">
                            {advert?.completed ? ' Завершено' : 'Заблоковано'}
                        </div>
                }

                <div className="flex flex-col gap-[3vh] w-[22vw]">
                    <UserRating user={advert?.user} />
                    <div className="flex gap-[1vh] flex-col">
                        <span className="font-montserrat text-adaptive-input-form-text">На GoSell з {formattedDate(new Date(advert?.user?.createdDate || '')).slice(2)}</span>
                        <span className="font-montserrat text-adaptive-input-form-text">Онлайн {getFormatDateTime(new Date(advert?.user?.lastActivity || ''))}</span>
                        <div className="flex gap-[.2vw]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-[2.6vh] p-0 m-0" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM7 9C7 6.24 9.24 4 12 4C14.76 4 17 6.24 17 9C17 11.88 14.12 16.19 12 18.88C9.92 16.21 7 11.85 7 9Z" fill="#000000" />
                                <path d="M12 11.5C13.3807 11.5 14.5 10.3807 14.5 9C14.5 7.61929 13.3807 6.5 12 6.5C10.6193 6.5 9.5 7.61929 9.5 9C9.5 10.3807 10.6193 11.5 12 11.5Z" fill="#000000" />
                            </svg>
                            <span className="font-montserrat text-adaptive-input-form-text">{advert?.settlementName}</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdvertInfo