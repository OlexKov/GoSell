import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux";
import { chatAuthApi, useGetChatMessagesQuery, useSetChatMessagesReadedMutation } from "../../../../redux/api/chatAuthApi";
import { IChatMessage } from "../../../../models/chat";
import { getFormatDate } from "../../../../utilities/common_funct";

const useGetMessages = (chatId: number | undefined, advertId: number | undefined) => {
    const user = useAppSelector(state => state.user.user)
    const { data: messages } = useGetChatMessagesQuery(chatId || 0, { skip: !chatId })
    const dispatch = useAppDispatch()
    const [setMessegesReaded] = useSetChatMessagesReadedMutation();
    const [messagesMap, setMessageMap] = useState<Map<string, IChatMessage[]>>(new Map<string, IChatMessage[]>())

    useEffect(() => {
        (async () => {
            const messagesMap = new Map<string, IChatMessage[]>()
            if (messages && messages.length && chatId !== 0) {
                const unreaded = messages.filter(x => !x.readed && (x.sender.id != user?.id)).map(x => x.id)
                if (unreaded.length && chatId) {
                    dispatch(
                        chatAuthApi.util.updateQueryData("getChatMessages", chatId, (draft) => {
                            if (!draft) return;
                            draft.forEach(x => {
                                if (unreaded.includes(x.id)) {
                                    x.readed = true;
                                }
                            })
                        }))
                    const result = await setMessegesReaded({ ids: unreaded, chatId: chatId })
                    if (!result.error) {
                        dispatch(chatAuthApi.util.invalidateTags(["Chats"]))
                    }
                }
                
                messages.slice().sort((a: IChatMessage, b: IChatMessage) => a.createdAt.localeCompare(b.createdAt))
                    .forEach((message: IChatMessage) => {
                        const key = getFormatDate(new Date(message.createdAt))
                        const existingMessages = messagesMap.get(key) || []
                        messagesMap.set(key, [...existingMessages, message])
                    })
               
            }
            setMessageMap(messagesMap)
        })()
    }, [messages, advertId, chatId])
    return { messagesMap }
}

export default useGetMessages