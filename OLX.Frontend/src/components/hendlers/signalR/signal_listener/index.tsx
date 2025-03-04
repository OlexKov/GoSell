import React, { useEffect } from 'react'
import { getAuth } from '../../../../redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../../../../redux';
import { adminMessageAuthApi } from '../../../../redux/api/adminMessageApi';
import { useSignalR } from '../signalRContext';
import { chatAuthApi } from '../../../../redux/api/chatAuthApi';
import { IChatMessage } from '../../../../models/chat';
import { ISetMessageReadedData } from '../../../../models/signalR';


const SignalRListener: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isUser, isAuth } = useAppSelector(getAuth)
    const signalRConnection = useSignalR();
    useEffect(() => {
        if (isAuth) {
            (async () => {
                if (isUser) {

                    signalRConnection?.connection?.on('ReceiveMessageFromAdmin', () => {
                        dispatch(adminMessageAuthApi.util.invalidateTags(['Messeges', 'UnreadedMessages']))
                    });

                    signalRConnection?.connection?.on('ReceiveChatMessage', (chatMessage: IChatMessage) => {
                        dispatch(chatAuthApi.util.invalidateTags(['Chats']))
                        dispatch(
                            chatAuthApi.util.updateQueryData("getChatMessages", chatMessage.chatId, (draft) => {
                                if (!draft) return;
                                draft.push(chatMessage);
                            }))
                    });

                    signalRConnection?.connection?.on('SetMessageReaded', () => {
                        dispatch(chatAuthApi.util.invalidateTags(['ChatMessages']))
                    });

                    signalRConnection?.connection?.on('SetChatMessageReaded', (data: ISetMessageReadedData) => {
                        dispatch(chatAuthApi.util.invalidateTags(['Chats']))
                        dispatch(
                            chatAuthApi.util.updateQueryData("getChatMessages", data.chatId, (draft) => {
                                if (!draft) return;
                                draft.forEach(x => { x.readed = data.messegesIds.includes(x.id) })
                            }))
                    });

                    signalRConnection?.connection?.on('CreateChat', (chatId) => {
                        dispatch(chatAuthApi.util.invalidateTags(['Chats']))
                        dispatch(chatAuthApi.util.invalidateTags([{ type: "ChatMessages", id: chatId }]));
                    });
                }
                else {
                    signalRConnection?.connection?.on('ReceiveMessageFromUser', () => {
                        dispatch(adminMessageAuthApi.util.invalidateTags(['AdminMessages']))
                    });
                }
            })()
        }
    }, [signalRConnection?.connection]);

    return null;
}

export default SignalRListener


