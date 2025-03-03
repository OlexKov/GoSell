import React, { useEffect } from 'react'
import { getAuth } from '../../../../redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../../../../redux';
import { adminMessageAuthApi } from '../../../../redux/api/adminMessageApi';
import { useSignalR } from '../signalRContext';
import { chatAuthApi } from '../../../../redux/api/chatAuthApi';




const SignalRListener: React.FC = () => {
    const dispatcher = useAppDispatch();
    const { isUser, isAuth } = useAppSelector(getAuth)
    const signalRConnection = useSignalR();
    useEffect(() => {
        if (isAuth) {
            (async () => {
                if (isUser) {
                    signalRConnection?.connection?.on('ReceiveMessageFromAdmin', () => {
                        dispatcher(adminMessageAuthApi.util.invalidateTags(['Messeges','UnreadedMessages']))
                    });
                    signalRConnection?.connection?.on('ReceiveChatMessage', () => {
                        dispatcher(chatAuthApi.util.invalidateTags(['ChatMessages']))
                    });
                    signalRConnection?.connection?.on('SetMessageReaded', () => {
                        dispatcher(chatAuthApi.util.invalidateTags(['ChatMessages']))
                    });
                    signalRConnection?.connection?.on('CreateChat', () => {
                        dispatcher(chatAuthApi.util.invalidateTags(['Chats','ChatMessages']))
                    });
                }
                else {
                    signalRConnection?.connection?.on('ReceiveMessageFromUser', () => {
                        dispatcher(adminMessageAuthApi.util.invalidateTags(['AdminMessages']))
                    });
                }
            })()
        }
    }, [signalRConnection?.connection]);

    return null;
}

export default SignalRListener


