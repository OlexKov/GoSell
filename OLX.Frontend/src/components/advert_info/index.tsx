import { useNavigate } from "react-router-dom"
import { formatPrice, formattedDate, getFormatDateTime } from "../../utilities/common_funct"
import PrimaryButton from "../buttons/primary_button"
import ToggleFavoriteButton from "../buttons/toggle_favorite_button"
import UserRating from "../user_rating"
import { IAdvertInfoProps } from "./props"
import { useAppSelector } from "../../redux"
import AdvertButtonMenu from "../buttons/button_menu"
import '../category_tree/style.scss'
import AdminButtonMenu from "../buttons/admin_buttons_menu"
import { Tooltip } from "antd"


const AdvertInfo: React.FC<IAdvertInfoProps> = ({ advert, buttons = true }) => {
    const user = useAppSelector(state => state.user.user)
    const isAdmin = useAppSelector(state => state.user.auth.isAdmin)
    const navigate = useNavigate();
    return (
        <div className=" flex flex-1 flex-col justify-between gap-[8vh] ">
            <div className=" flex flex-col gap-[8vh] ">
                <div className="flex  justify-between relative ">
                    <div className="flex  flex-col gap-[3vh] overflow-hidden">
                        <div className="flex items-center gap-[0.5vw]">
                            {advert?.isContractPrice &&
                                <Tooltip title="Ціна договірна" color="#b3b3b3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-[3vh]" viewBox="0 0 512 501.76">
                                        <path d="M363.49 208.04 439.55 76.3 305.09 0 172.57 229.53c9.52-3.86 19.55-6.42 29.79-7.47l97.06-168.12c12.56 7.15 26.54 3.27 32.77-7.69l52.93 30.56c-6.03 10.61-2.15 24.6 8.77 30.79l-51.68 89.51c7.41 2.99 14.48 6.74 21.28 10.93zM65.73 381.06c6.11 0 11.07 4.96 11.07 11.07 0 6.12-4.96 11.07-11.07 11.07s-11.07-4.95-11.07-11.07c0-6.11 4.96-11.07 11.07-11.07zm322.2-96.59c-.01-2.1.12-4.09.38-5.97l-21.77-14.54c-3.13-2.09-6.56-4.49-10-6.9-12.38-8.67-25.13-17.6-38.87-21.21-7.42-1.95-15.98-3.25-24.75-3.42-7.64-.14-15.44.58-22.77 2.47-4.38 1.14-8.61 2.71-12.53 4.78-3.49 1.84-6.74 4.1-9.63 6.8l-14.62 17.39c-.44.86-1.07 1.6-1.83 2.17l-40.31 47.97c.6 3.07 1.81 5.64 3.46 7.69 1.92 2.38 4.48 4.15 7.43 5.25 3.12 1.17 6.72 1.62 10.53 1.31 6.08-.51 12.56-2.99 18.41-7.62l11.2-9.26c2.83-2.34 5.19-4.49 7.53-6.64 5.17-4.72 10.34-9.44 15.76-12.67 12.56-7.5 25.06-7.74 37.43 13l63.38 114.32h21.55l.02-134.92zm5.1-18.3c.98-1.36 2.1-2.61 3.36-3.74 5.53-4.98 13.45-7.41 23.61-7.42v-.03l55.1.02c11.53-.05 20.91 2.06 27.4 7.06 7.23 5.56 10.62 14.04 9.17 26.19l-12.18 125.88c-.89 11.24-3.86 20.05-9.15 26.14-5.63 6.47-13.47 9.66-23.74 9.23l-49.55.01c-6.94.36-12.82-1.52-17.74-5.46-3.61-2.87-6.59-6.81-8.98-11.72h-17.14c2.31 6.75 2.19 13.15.35 18.84-1.9 5.85-5.59 10.84-10.3 14.57-4.61 3.66-10.24 6.16-16.12 7.13-5.75.94-11.76.42-17.35-1.9-6.5 6.8-13.35 11.08-20.49 13.05-7.17 1.97-14.43 1.57-21.78-1.01-6.97 7.73-14.68 12.58-23.17 14.42-8.65 1.87-17.85.58-27.59-4.01-3.04 2.37-6.22 4.25-9.53 5.62-4.71 1.95-9.65 2.85-14.8 2.7-12.35-.37-20.67-4.02-27.29-9.94-6.31-5.64-10.56-12.89-15.35-21.23l-27.31-47.64h-21.18c-1.19 5.97-3.24 11.04-6.28 15.11l-.3.42c-5.4 6.94-13.33 10.63-24.29 10.41l-46.21.01c-9.16 1.48-17.01-.76-23.15-7.88-5.44-6.31-9.16-16.51-10.74-31.53l-.07-.55L.69 290.63c-1.89-12.77.2-21.8 5.33-27.97 5.18-6.22 12.98-9.03 22.6-9.48l.8-.05h58.5v.03c9.25-.11 17.19 1.42 23.19 5.3v.02c4.85 3.14 8.33 7.56 10.12 13.57h39.81c10-6.75 19.37-12.05 29.73-15.28 10.17-3.17 21.08-4.28 34.11-2.72l13.62-16.21.51-.54c3.8-3.61 8.05-6.58 12.62-8.99 4.8-2.53 9.96-4.45 15.3-5.83 8.5-2.2 17.46-3.04 26.19-2.88 9.89.18 19.5 1.64 27.8 3.82l.02.01c15.89 4.16 29.62 13.78 42.95 23.12 3.18 2.23 6.35 4.45 9.79 6.74l19.35 12.88zm-283.38 14.14a6.457 6.457 0 0 1-.24-2.33c-.71-4.16-2.53-6.97-5.23-8.72-3.77-2.41-9.36-3.35-16.19-3.27h-.07v.03l-58.75-.01c-6.05.29-10.69 1.74-13.28 4.86-2.79 3.34-3.79 9.11-2.43 18.05l.06.59 9.56 118.61c1.3 12.26 3.94 20.14 7.68 24.48 2.96 3.42 7 4.4 11.85 3.52.39-.07.78-.11 1.16-.11l46.27-.02.69.04c6.48.11 10.97-1.83 13.8-5.47l.23-.28c3.13-4.25 4.67-10.81 4.91-19.21l-.02-130.76zm12.89 129.74h23.64c2.5 0 4.67 1.42 5.74 3.5l29.03 50.63c4.25 7.41 8 13.83 12.73 18.06 4.42 3.95 10.21 6.4 19.09 6.66 3.33.1 6.52-.48 9.56-1.73 1.86-.77 3.69-1.81 5.48-3.11l-18.91-35.39a6.41 6.41 0 0 1 2.64-8.68c3.13-1.67 7.02-.49 8.68 2.64l20.56 38.47c7.66 3.89 14.59 5.1 20.83 3.75 5.7-1.24 11.08-4.66 16.14-10.19l-29.63-46.5a6.422 6.422 0 0 1 1.97-8.86 6.409 6.409 0 0 1 8.85 1.97l31.23 49.01c5.47 2.22 10.73 2.73 15.74 1.36 4.78-1.32 9.57-4.39 14.36-9.34l-28.29-53.25a6.44 6.44 0 0 1 2.66-8.71 6.452 6.452 0 0 1 8.71 2.67l29.26 55.09c3.81 2.2 8.21 2.78 12.45 2.08 3.7-.6 7.26-2.19 10.18-4.5 2.81-2.24 5-5.13 6.07-8.44 1.17-3.63 1.05-7.9-.97-12.54-.42-.96-.59-1.98-.52-2.97a6.418 6.418 0 0 1-3.66-4.25l-64.22-115.85c-7.14-11.94-13.58-12.25-19.8-8.55-4.41 2.63-9.05 6.88-13.7 11.12-2.81 2.57-5.64 5.16-7.98 7.09l-11.4 9.39c-7.94 6.31-16.88 9.7-25.36 10.41-5.63.46-11.13-.26-16.06-2.11-5.1-1.91-9.57-5.02-12.96-9.23-3.66-4.54-6.05-10.29-6.62-17.13-.16-1.97.58-3.79 1.87-5.09l34.71-41.3c-7.38-.1-13.91.91-20.04 2.82-9.35 2.9-18.07 7.99-27.62 14.5a6.45 6.45 0 0 1-3.99 1.38h-40.45v125.12zm321.98-28.99c6.11 0 11.07 4.96 11.07 11.07 0 6.12-4.96 11.07-11.07 11.07-6.12 0-11.08-4.95-11.08-11.07 0-6.11 4.96-11.07 11.08-11.07zm-145.85-249.3c-19.45-.76-35.83 14.38-36.59 33.83-.36 9.02 2.71 17.37 8.03 23.81 17.1-2.74 35.84-1.84 52.74 1.83a35.079 35.079 0 0 0 9.66-22.88c.76-19.45-14.39-35.83-33.84-36.59zM145.94 240.18 262.77 37.83l-19.01-10.78-117.45 203.43c4.41 2.6 8.76 6.05 12.27 9.7h7.36z" fill="green" />
                                    </svg>
                                </Tooltip>
                            }
                            <span className="font-unbounded text-adaptive-advert-page-price-text font-medium"> {formatPrice(advert?.price || 0)} грн.</span>
                        </div>

                        <p className="font-unbounded text-adaptive-card-price-text font-medium overflow-hidden text-ellipsis">{advert?.title}</p>
                    </div>
                    {
                        (!isAdmin
                            ? !advert?.completed && user?.id != advert?.userId
                                ? <ToggleFavoriteButton
                                    advertId={advert?.id || 0}
                                    isAdvertPage
                                    className="w-[7%] absolute right-0" />
                                : <AdvertButtonMenu
                                    id={advert?.id || 0}
                                    isEdit={true}
                                    isComplete={!advert?.completed}
                                    isDelete={advert?.completed}
                                    className="w-[7%] absolute right-0" />
                            : advert && <AdminButtonMenu
                                advert={advert}
                                className="w-[7%] absolute right-0" />)
                    }
                </div>
                <div className="flex flex-col flex-1  w-[28vw] gap-[1vh]">
                    <span className="font-unbounded text-adaptive-card-price-text font-medium">Опис</span>
                    <div className="w-full max-h-[23vh]  overflow-y-auto custom-scrollbar">
                        <p className="font-montserrat text-adaptive-card-price-text text-balance">{advert?.description}</p>
                    </div>

                </div>
            </div>
            <div className=" flex flex-col gap-[6vh]">
                {
                    !advert?.completed && !advert?.blocked
                        ? buttons && !isAdmin &&
                        <div className="flex flex-col gap-[2.4vh]">
                            <PrimaryButton
                                title={"Купити зараз"}
                                bgColor="#9B7A5B"
                                fontColor="white"
                                fontSize="clamp(14px, 2.1vh, 36px)"
                                isLoading={false}
                                className="h-[4.6vh] w-[22vw] "
                                onButtonClick={() => navigate(`/user/advert/buy/${advert?.id}`)}
                                disabled={user?.id == advert?.userId || isAdmin} />
                            <PrimaryButton
                                title={"Написати продавцю"}
                                isLoading={false}
                                bgColor="transparent"
                                fontColor="#3A211C"
                                brColor="#9B7A5B"
                                fontSize="clamp(14px, 2.1vh, 36px)"
                                className="h-[4.6vh] w-[22vw] border-2"
                                onButtonClick={() => navigate(`/user/chat?id=${advert?.id}`)}
                                disabled={user?.id == advert?.userId || isAdmin} />
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