import { IChatMessage } from "../../models/chat"
import { useAppSelector } from "../../redux"
import { getTime } from "../../utilities/common_funct"
import { APP_ENV } from "../../constants/env"

interface ChatMessageCardProps {
    message: IChatMessage
    clasName?: string
}

const ChatMessageCard: React.FC<ChatMessageCardProps> = ({ message, clasName }) => {
    const user = useAppSelector(state => state.user.user)
    return (
        <div className={`flex gap-[1vw] ${message.sender.id == user?.id ? 'justify-end' : ''} ${clasName}`}>
            {message.sender.id != user?.id &&
                <img className="h-[5.5vh] rounded-full aspect-square object-cover" src={APP_ENV.IMAGES_100_URL + message.sender.photo} />
            }
            <div className={`flex flex-col ${message.sender.id == user?.id ? 'items-end' : ''} max-w-[40%] gap-[1vh]`}>
                <p className="text-pretty font-montserrat text-adaptive-1_7_text" >{message.content}</p>
                <div className="flex items-center">
                    <span className="font-montserrat text-adaptive-1_3-text">{getTime(message.createdAt)}</span>
                    <svg className="h-[1.6vh] aspect-square" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        {message.readed
                            ? <path d="M18 7.00009L16.59 5.59009L10.25 11.9301L11.66 13.3401L18 7.00009ZM22.24 5.59009L11.66 16.1701L7.48003 12.0001L6.07003 13.4101L11.66 19.0001L23.66 7.00009L22.24 5.59009ZM0.410034 13.4101L6.00003 19.0001L7.41003 17.5901L1.83003 12.0001L0.410034 13.4101Z" fill="green" />
                            : <path d="M9.00002 16.2001L4.80002 12.0001L3.40002 13.4001L9.00002 19.0001L21 7.0001L19.6 5.6001L9.00002 16.2001Z" fill="green" />
                        }
                    </svg>
                </div>
            </div>

        </div>
    )
}

export default ChatMessageCard