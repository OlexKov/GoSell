import { forwardRef, useMemo } from "react"
import { APP_ENV } from "../../constants/env"
import { useAppSelector } from "../../redux"
import { getFormatDateTime } from "../../utilities/common_funct"
import { ChatCardProps } from "./props"



const ChatCard = forwardRef<HTMLDivElement, ChatCardProps>(({ chat, className, selected, onClick }, ref) => {
    const user = useAppSelector(state => state.user.user)
    const userData = useMemo(() => {
        const unreaded = user?.id == chat.buyer.id ? chat.buyerUnreaded : chat.sellerUnreaded
        const aspect = unreaded.toString().length * 3 - ((unreaded.toString().length - 1) * 2)
        return ({
            userPhoto: user?.id == chat.buyer.id ? chat.seller.photo : chat.buyer.photo,
            userName: user?.id == chat.buyer.id ? chat.seller.description : chat.buyer.description,
            unreaded: unreaded,
            badgeAspect: aspect
        })
    }, [chat, user])

    return (
        <div
            ref={ref}
            onClick={() => onClick && onClick(chat)}
            className={`flex relative cursor-pointer p-[1vh] min-h-[100px] min-w-[300px]  hover:bg-[#9B7A5B]/10 ${selected ? 'bg-[#9B7A5B]/10' : ''} gap-[.5vw] ${className}`}
        >
            {userData.unreaded > 0 &&
                <div style={{ aspectRatio: `${userData.badgeAspect}/3` }} className={`flex absolute h-[1.5vh] items-center justify-center rounded-full text-white bg-red-500 border-white top-0 animate-pulse`}>
                    <span style={{fontSize:'clamp(10px,1.2vh,20px)'}} className="font-montserrat  leading-none">{userData.unreaded}</span>
                </div>
            }
            <img className="h-[56%] ml-[0.5vw] object-cover aspect-square rounded-full" src={APP_ENV.IMAGES_100_URL + userData.userPhoto} />
            <div className="flex flex-col h-full justify-between w-full overflow-hidden ">
                <div className="flex  justify-between ">
                    <span className="font-montserrat text-adaptive-1_7_text font-medium">{userData.userName}</span>
                    <span className="font-montserrat text-adaptive-1_3-text mr-[1.5vw]">{getFormatDateTime(new Date(chat.createAt))}</span>
                </div>
                <div className="flex flex-col gap-[.5vh] ">
                    <p className="font-montserrat text-adaptive-1_7_text  text-nowrap overflow-hidden text-ellipsis ">{chat.advert.title}</p>
                    <img className="w-[17.5%] object-contain aspect-square rounded-md " src={APP_ENV.IMAGES_100_URL + chat.advert.image} />
                </div>

            </div>

        </div>
    )
})

export default ChatCard