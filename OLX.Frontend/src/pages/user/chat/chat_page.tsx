import { BackButton } from "../../../components/buttons/back_button"
import '../../../components/category_tree/style.scss'
import { useAppDispatch, useAppSelector } from "../../../redux"
import {
    chatAuthApi,
    useCreateChatMutation,
    useGetChatMessagesQuery,
    useGetChatsQuery,
    useRemoveChatMutation,
    useSendChatMessageMutation,
    useSetChatMessagesReadedMutation
} from "../../../redux/api/chatAuthApi"
import { useEffect, useMemo, useRef, useState } from "react"
import ChatCard from "../../../components/chat_card"
import { IChat, IChatMessage } from "../../../models/chat"
import { APP_ENV } from "../../../constants/env"
import { formatPrice, getFormatDate, getUserDescr } from "../../../utilities/common_funct"
import ChatMessageCard from "../../../components/chat_message_card"
import { useSearchParams } from "react-router-dom"
import { useGetAdvertByIdQuery } from "../../../redux/api/advertApi"
import { IAdvert } from "../../../models/advert"
import { Divider, Popconfirm } from "antd"

const createNewChat = (userId: number, advert: IAdvert | undefined): IChat => {
    return {
        id: 0,
        sellerUnreaded: 0,
        buyerUnreaded: 0,
        buyer: {
            id: userId,
            photo: undefined,
            description: ''
        },
        seller: {
            id: advert?.user?.id || 0,
            photo: advert?.user?.photo,
            description: getUserDescr(advert?.user)
        },
        createAt: new Date(Date.now()).toISOString(),
        advert: {
            id: advert?.id || 0,
            image: advert?.images.find(x => x.priority === 0)?.name || '',
            title: advert?.title || '',
            price: advert?.price || 0
        }
    }
}
const ChatPage: React.FC = () => {
    const dispatch = useAppDispatch()
    const [searchParam] = useSearchParams()
    const [advertId, setAdvertId] = useState<number | undefined>()
    const chatMesssageContainer = useRef<HTMLDivElement | null>(null)
    const selectedMesssageRef = useRef<HTMLDivElement | null>(null)
    const [createChat, { isLoading: isChatCreating }] = useCreateChatMutation();
    const [sendMessage, { isLoading: isMesssageSending }] = useSendChatMessageMutation();
    const [deleteChat] = useRemoveChatMutation();
    const [setMessegesReaded] = useSetChatMessagesReadedMutation();
    const [message, setMessage] = useState<string>('');
    const [selectedChat, setSelectedChat] = useState<IChat>()
    const { data: advert } = useGetAdvertByIdQuery(advertId || 0, { skip: !advertId })
    const user = useAppSelector(state => state.user.user)
    const { data: chats, refetch } = useGetChatsQuery(advertId, { skip: !user })
    const { data: chatMessages } = useGetChatMessagesQuery(selectedChat?.id || 0, { skip: !selectedChat || selectedChat.id === 0 })

    const messagesMap = useMemo(() => {
        const messages = new Map<string, IChatMessage[]>()
        if (chatMessages?.length) {

            chatMessages?.slice()
                .sort((a: IChatMessage, b: IChatMessage) => a.createdAt.localeCompare(b.createdAt))
                .forEach((message: IChatMessage) => {
                    const key = getFormatDate(new Date(message.createdAt))
                    const existingMessages = messages.get(key) || []
                    messages.set(key, [...existingMessages, message])
                })
        }
        return Array.from(messages.entries()).flatMap(([key, value]) => [
            <Divider key={key}>
                <span className="font-montserrat text-adaptive-1_4-text">{key}</span>
            </Divider>,
            ...value.map(message => (
                <ChatMessageCard
                    message={message}
                    key={message.id}
                    clasName="px-[1vh]"
                />
            ))
        ])
    }, [chatMessages])


    const chatItems = useMemo(() => {
        let items = chats
            ? !advertId || chats.some(x => x.advert.id === advertId)
                ? chats
                : [createNewChat(user?.id || 0, advert), ...chats]
            : []
        return items.length > 0
            ? items.slice().sort((a: IChat, b: IChat) => b.createAt.localeCompare(a.createAt))
            : []
    }, [advert, chats])

    useEffect(() => {
        const queryAdvertId = Number(searchParam.get('id')) == 0 ? undefined : Number(searchParam.get('id'))
        if (!queryAdvertId) {
            refetch()
        }
        setAdvertId(queryAdvertId)
    }, [])

    useEffect(() => {
        (async () => {
            if (chatMessages && chatMessages.length > 0) {
                const messages = chatMessages?.filter(x => !x.readed && (x.sender.id != user?.id)).map(x => x.id)
                dispatch(
                    chatAuthApi.util.updateQueryData("getChatMessages", selectedChat?.id || 0, (draft) => {
                        if (!draft) return;
                        draft.forEach(x => {
                            if (messages.includes(x.id)) {
                                x.readed = true;
                            }
                        })
                    }))
                
                if (messages && messages.length > 0 && selectedChat) {
                    const result = await setMessegesReaded({ ids: messages, chatId: selectedChat.id })
                    if (!result.error) { 
                        dispatch(
                            chatAuthApi.util.updateQueryData("getChats", advertId, (draft) => {
                                if (!draft) return;
                                let chat = draft.find(x => x.id === selectedChat?.id)
                                if (chat) {
                                    chat.buyerUnreaded = 0;
                                    chat.sellerUnreaded = 0;
                                }
                            }))
                    }
                }
            }
        })()
        if (chatMesssageContainer.current) {
            chatMesssageContainer.current.scrollTop = chatMesssageContainer.current.scrollHeight;
        }
    }, [chatMessages?.length])

    useEffect(() => {
        if (selectedChat && selectedMesssageRef.current) {
            selectedMesssageRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            })
        }
    }, [selectedChat])

    useEffect(() => {
        if (chatItems.length > 0 && (!selectedChat || selectedChat.id == 0)) {
            const selected = chatItems.find(x => x.advert.id === advertId) || (advertId ? chatItems[0] : undefined)
            setSelectedChat(selected)
        }
    }, [advertId, chatItems])

    const onChatSelect = (chat: IChat) => {
        setSelectedChat(chat)
    }

    const onMessageSend = async () => {
        const str = message?.trim();
        if (str && str.length > 0 && !isChatCreating && !isMesssageSending && selectedChat) {
            if (selectedChat.id === 0 && advertId) {
                await createChat({ advertId: advertId, message: str })
            }
            else {
                await sendMessage({ chatId: selectedChat.id, message: str })
            }
            setMessage('')
        }
    }

    const onChatRemove = async () => {
        if (selectedChat && selectedChat.id !== 0) {
            const result = await deleteChat(selectedChat.id || 0)
            if (!result.error && selectedChat?.advert.id == advertId) {
                setAdvertId(undefined)
            }
        }
        else {
            setAdvertId(undefined)
        }
        setSelectedChat(undefined)
    }

    return (
        <div className="w-[100%] gap-[5vh] mx-[8vw] flex flex-col">
            <BackButton className="text-adaptive-1_9_text mt-[7.5vh] ml-[1vw] font-medium self-start" title="Назад" />
            <div className="flex gap-[1.25vw] ml-[1.3vw] w-[71.2vw] h-[58vh] mb-[8vh] mt-[3vh]">
                <div className=" border rounded-lg border-[#9B7A5B]/50 w-[33.4%] flex flex-col">
                    <h2 className="ml-[2vh] mb-[2vh] mt-[1.7vh] text-adaptive-1_9_text font-montserrat font-medium">Вхідні</h2>
                    <div className="my-[1vh] flex flex-col gap-[2.5vh] overflow-auto custom-scrollbar">
                        {chatItems.map((chat) =>
                            <ChatCard
                                key={chat.id}
                                className="h-[15vh] w-full flex-shrink-0"
                                chat={chat}
                                selected={selectedChat?.advert.id === chat?.advert.id}
                                ref={selectedChat?.advert.id === chat?.advert.id ? selectedMesssageRef : undefined}
                                onClick={onChatSelect} />)}
                    </div>
                </div>

                <div className=" border rounded-lg p-[1vh]  border-[#9B7A5B]/50 flex-1 flex justify-between flex-col gap-[1vh]">
                    {selectedChat
                        ? <>
                            <div className="flex gap-[.5vw]">
                                <img className="w-[8.5vh] object-cover aspect-square rounded-md " src={APP_ENV.IMAGES_100_URL + selectedChat?.advert.image} />
                                <div className="flex justify-between w-full">
                                    <div className="flex flex-col gap-[.7vh]">
                                        <span className="text-adaptive-1_7_text font-unbounded font-medium">{selectedChat.advert.title}</span>
                                        <span className="text-adaptive-1_7_text font-medium font-montserrat ">{formatPrice(selectedChat?.advert.price || 0)} грн</span>
                                    </div>
                                    <Popconfirm
                                        title="Бажаєте видалити цей чат?"
                                        onConfirm={onChatRemove}>
                                        <svg className="h-[2.1vh] min-h-[14px] aspect-square cursor-pointer flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
                                            <path d="M15 7L14.16 15.398C14.033 16.671 13.97 17.307 13.68 17.788C13.4257 18.2114 13.0516 18.55 12.605 18.761C12.098 19 11.46 19 10.18 19H7.82C6.541 19 5.902 19 5.395 18.76C4.94805 18.5491 4.57361 18.2106 4.319 17.787C4.031 17.307 3.967 16.671 3.839 15.398L3 7M10.5 13.5V8.5M7.5 13.5V8.5M1.5 4.5H6.115M6.115 4.5L6.501 1.828C6.613 1.342 7.017 1 7.481 1H10.519C10.983 1 11.386 1.342 11.499 1.828L11.885 4.5M6.115 4.5H11.885M11.885 4.5H16.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </Popconfirm>

                                </div>
                            </div>
                            <hr className="my-[1.8vh]" />
                            <div ref={chatMesssageContainer} className="flex-col flex gap-[2vh] flex-1 overflow-auto custom-scrollbar  ">
                                {messagesMap}
                            </div>
                            <div className="flex h-[3.2vh]  mx-[3.5vw] my-[.5vh] gap-[.8vw]">
                                <svg className="w-auto h-full cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.1]" xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                                    <path d="M25.5 5H21.5375L19.25 2.5H11.75L9.4625 5H5.5C4.125 5 3 6.125 3 7.5V22.5C3 23.875 4.125 25 5.5 25H25.5C26.875 25 28 23.875 28 22.5V7.5C28 6.125 26.875 5 25.5 5ZM25.5 22.5H5.5V7.5H10.5625L12.85 5H18.15L20.4375 7.5H25.5V22.5ZM15.5 8.75C12.05 8.75 9.25 11.55 9.25 15C9.25 18.45 12.05 21.25 15.5 21.25C18.95 21.25 21.75 18.45 21.75 15C21.75 11.55 18.95 8.75 15.5 8.75ZM15.5 18.75C13.4375 18.75 11.75 17.0625 11.75 15C11.75 12.9375 13.4375 11.25 15.5 11.25C17.5625 11.25 19.25 12.9375 19.25 15C19.25 17.0625 17.5625 18.75 15.5 18.75Z" fill="#3A211C" />
                                </svg>
                                <div className="flex bg-[#9B7A5B]/10 flex-1 items-center">
                                    <input
                                        value={message}
                                        onKeyDown={(e) => { e.key === 'Enter' && onMessageSend() }}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Написати"
                                        className="flex-1 font-montserrat text-adaptive-1_5-text rounded-b-sm pl-[.5vw] border-0 bg-transparent focus:border-0 focus:outline-none"
                                        type="text" />
                                    <div className="flex gap-[1vw] mx-[.5vw] h-[80%] flex-shrink-0">
                                        <svg className="w-auto h-full cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.1]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM15.5 11C16.33 11 17 10.33 17 9.5C17 8.67 16.33 8 15.5 8C14.67 8 14 8.67 14 9.5C14 10.33 14.67 11 15.5 11ZM8.5 11C9.33 11 10 10.33 10 9.5C10 8.67 9.33 8 8.5 8C7.67 8 7 8.67 7 9.5C7 10.33 7.67 11 8.5 11ZM12 17.5C14.33 17.5 16.31 16.04 17.11 14H6.89C7.69 16.04 9.67 17.5 12 17.5Z" fill="#9B7A5B" />
                                        </svg>
                                        <svg onClick={onMessageSend} className="w-auto h-full cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.1]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M4 12L5.41 13.41L11 7.83V20H13V7.83L18.58 13.42L20 12L12 4L4 12Z" fill="black" />
                                        </svg>
                                    </div>

                                </div>
                            </div>
                        </>
                        : <p className=" self-center my-auto font-montserrat text-adaptive-1_7_text">Оберіть чат для розмови</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default ChatPage