import React, { useEffect } from 'react'
import { getAuth } from '../../../../redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../../../../redux';
import { adminMessageAuthApi } from '../../../../redux/api/adminMessageApi';
import { useSignalR } from '../signalRContext';
import { chatAuthApi } from '../../../../redux/api/chatAuthApi';




const SignalRListener: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isUser, isAuth } = useAppSelector(getAuth)
    const signalRConnection = useSignalR();
    useEffect(() => {
        if (isAuth) {
            (async () => {
                if (isUser) {
                    signalRConnection?.connection?.on('ReceiveMessageFromAdmin', () => {
                        dispatch(adminMessageAuthApi.util.invalidateTags(['Messeges','UnreadedMessages']))
                    });
                    signalRConnection?.connection?.on('ReceiveChatMessage', (chatId) => {
                        dispatch(chatAuthApi.util.invalidateTags(['Chats']))
                        dispatch(chatAuthApi.util.invalidateTags([{ type: "ChatMessages", id: chatId }]));
                    });
                    signalRConnection?.connection?.on('SetMessageReaded', () => {
                        dispatch(chatAuthApi.util.invalidateTags(['ChatMessages']))
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


