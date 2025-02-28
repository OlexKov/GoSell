import { BackButton } from "../../../components/buttons/back_button"
import '../../../components/category_tree/style.scss'
import { useAppSelector } from "../../../redux"
import { useGetChatMessagesQuery, useGetChatsQuery } from "../../../redux/api/chatAuthApi"
import { useMemo, useState } from "react"
import ChatCard from "../../../components/chat_card"
import { IChat, IChatMessage } from "../../../models/chat"
import { APP_ENV } from "../../../constants/env"
import { formatPrice } from "../../../utilities/common_funct"
import ChatMessageCard from "../../../components/chat_message_card"

const ChatPage: React.FC = () => {
    const user = useAppSelector(state => state.user.user)
    const [selectedChat, setSelectedChat] = useState<IChat>()
    const { data: chats, isLoading: isChatsLoading } = useGetChatsQuery(undefined, { skip: !user })
    const { data: chatMessages} = useGetChatMessagesQuery(selectedChat?.id || 0, { skip: !selectedChat })
    console.log(chats)
    const meseegesData = useMemo(() => chatMessages?.length && chatMessages.length > 0
        ? chatMessages.slice().sort((a: IChatMessage, b: IChatMessage) => a.createdAt.localeCompare(b.createdAt))
        : [], [chatMessages])

    return (
        <div className="w-[100%] gap-[5vh] mx-[8vw] flex flex-col">
            <BackButton className="text-adaptive-1_9_text mt-[7.5vh] ml-[1vw] font-medium self-start" title="Назад" />
            <div className="flex gap-[1.25vw] ml-[1.3vw] w-[71.2vw] h-[58vh] mt-[3vh]">
                <div className=" border rounded-lg border-[#9B7A5B]/50 w-[33.4%] flex flex-col">
                    <h2 className="ml-[2vh] mb-[2vh] mt-[1.7vh] text-adaptive-1_9_text font-montserrat font-medium">Вхідні</h2>
                    <div className="my-[1vh] flex flex-col gap-[2.5vh] overflow-auto custom-scrollbar">
                        {!isChatsLoading && chats && chats.length > 0 && chats?.map((chat, index) =>
                            <ChatCard
                                key={index}
                                className="h-[15vh] w-full "
                                chat={chat}
                                selected={selectedChat?.id === chat.id}
                                onClick={setSelectedChat} />
                        )}
                    </div>
                </div>

                <div className=" border rounded-lg p-[1vh] border-[#9B7A5B]/50 flex-1 flex flex-col gap-[1vh]">
                    {selectedChat
                        ? <><div className="flex gap-[.5vw]">
                            <img className="w-[8.5vh] object-cover aspect-square rounded-md " src={APP_ENV.IMAGES_100_URL + selectedChat?.advert.image} />
                            <div className="flex justify-between w-full">
                                <div className="flex flex-col gap-[.7vh]">
                                    <span className="text-adaptive-1_7_text font-unbounded font-medium">Сервіз синій</span>
                                    <span className="text-adaptive-1_7_text font-medium font-montserrat ">{formatPrice(selectedChat?.advert.price || 0)} грн</span>
                                </div>
                                <svg onClick={undefined} className="h-[2.1vh] min-h-[14px] aspect-square cursor-pointer flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
                                    <path d="M15 7L14.16 15.398C14.033 16.671 13.97 17.307 13.68 17.788C13.4257 18.2114 13.0516 18.55 12.605 18.761C12.098 19 11.46 19 10.18 19H7.82C6.541 19 5.902 19 5.395 18.76C4.94805 18.5491 4.57361 18.2106 4.319 17.787C4.031 17.307 3.967 16.671 3.839 15.398L3 7M10.5 13.5V8.5M7.5 13.5V8.5M1.5 4.5H6.115M6.115 4.5L6.501 1.828C6.613 1.342 7.017 1 7.481 1H10.519C10.983 1 11.386 1.342 11.499 1.828L11.885 4.5M6.115 4.5H11.885M11.885 4.5H16.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                        </div>
                            <hr className="my-[1.8vh]" />
                            <div className="flex-col flex gap-[2vh]">
                                {meseegesData.length > 0 &&
                                    meseegesData.map((message, index) =>
                                        <ChatMessageCard
                                            message={message}
                                            key={index} 
                                            clasName="h-[5.5vh]"/>)

                                }
                            </div></>
                        : <p className=" self-center my-auto font-montserrat text-adaptive-1_7_text">Оберіть чат для розмови</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default ChatPage