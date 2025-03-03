import { useMemo } from "react"
import { APP_ENV } from "../../constants/env"
import { IChat } from "../../models/chat"
import { useAppSelector } from "../../redux"
import { getFormatDateTime } from "../../utilities/common_funct"

interface ChatCardProps {
    chat: IChat
    className?: string
    selected?: boolean
    onClick?: (chat: IChat) => void
}

const ChatCard: React.FC<ChatCardProps> = ({ chat, className, selected, onClick }) => {
    const user = useAppSelector(state => state.user.user)
    const userData = useMemo(() => ({
        userPhoto: user?.id == chat.buyer.id ? chat.seller.photo : chat.buyer.photo,
        userName: user?.id == chat.buyer.id ? chat.seller.description : chat.buyer.description,
    }), [chat, user])
    
    return (
        <div
            onClick={() => onClick && onClick(chat)}
            className={`flex cursor-pointer p-[1vh] min-h-[100px] min-w-[300px]  hover:bg-[#9B7A5B]/10 ${selected ? 'bg-[#9B7A5B]/10' : ''} gap-[.5vw] ${className}`}
        >
            <img className="h-[56%] ml-[0.5vw] object-cover aspect-square rounded-full" src={APP_ENV.IMAGES_100_URL + userData.userPhoto} />
            <div className="flex flex-col h-full justify-between w-full">
                <div className="flex  justify-between ">
                    <span className="font-montserrat text-adaptive-1_7_text font-medium">{userData.userName}</span>
                    <span className="font-montserrat text-adaptive-1_3-text mr-[1.5vw]">{getFormatDateTime(new Date(chat.createAt))}</span>
                </div>
                <div className="flex flex-col gap-[.5vh]">
                    <span className="font-montserrat text-adaptive-1_7_text">{chat.advert.title}</span>
                    <img className="w-[17.5%] object-cover aspect-square rounded-md " src={APP_ENV.IMAGES_100_URL + chat.advert.image} />
                </div>

            </div>

        </div>
    )
}

export default ChatCard