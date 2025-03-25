import React, { useEffect } from 'react'
import { getAuth, logOut } from '../../../../redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../../../../redux';
import { adminMessageAuthApi } from '../../../../redux/api/adminMessageApi';
import { useSignalR } from '../signalRContext';
import { chatAuthApi } from '../../../../redux/api/chatAuthApi';
import { IChatMessage } from '../../../../models/chat';
import { ISetMessageReadedData } from '../../../../models/signalR';
import { advertAuthApi } from '../../../../redux/api/advertAuthApi';


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

                    signalRConnection?.connection?.on('AdminDeleteAdvert', () => {
                        dispatch(advertAuthApi.util.invalidateTags(['UserAdverts']))
                    });

                    signalRConnection?.connection?.on('AdminLockAdvert', () => {
                        dispatch(advertAuthApi.util.invalidateTags(['UserAdverts']))
                    });

                    signalRConnection?.connection?.on('AdminRemoveAccount', () => {
                        console.log('AdminRemoveAccount')
                        dispatch(logOut())
                    });

                    signalRConnection?.connection?.on('SetChatMessageReaded', (data: ISetMessageReadedData) => {
                        dispatch(
                            chatAuthApi.util.updateQueryData("getChatMessages", data.chatId, (draft) => {
                                if (!draft) return;
                                draft.forEach(x => {
                                    if (data.messegesIds.includes(x.id)) {
                                        x.readed = true;
                                    }
                                })
                            }))
                    });

                    signalRConnection?.connection?.on('CreateChat', (chatId) => {
                        dispatch(chatAuthApi.util.invalidateTags(['Chats']))
                        dispatch(chatAuthApi.util.invalidateTags([{ type: "ChatMessages", id: chatId }]));
                    });
                }
                else {
                    signalRConnection?.connection?.on('ReceiveMessageFromUser', () => {
                        dispatch(adminMessageAuthApi.util.invalidateTags(['AdminMessages','UnreadedMessages']))
                    });
                }
            })()
        }
    }, [signalRConnection?.connection]);

    return null;
}

export default SignalRListener


