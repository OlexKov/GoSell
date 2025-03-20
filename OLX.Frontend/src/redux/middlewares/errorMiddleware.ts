import { isRejectedWithValue, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { setError, setRedirect } from '../slices/appSlice';
import { IError } from '../../models/еrrors';
import { toast, TypeOptions } from 'react-toastify';
import { RootState } from '..';
import { logOut } from '../slices/userSlice';

interface IToastBlockedData {
    blockedRoute: string
    blockedStatuses?: number[]
}

const toastBlockedRoutes: IToastBlockedData[] = [
    {
        blockedRoute: '/auth/emailconfirm'
    },
    {
        blockedRoute: '/auth/password/reset'
    },
    {
        blockedRoute: '/advert/',
        blockedStatuses: [400]
    }
]

const showToast = (message: string, type?: TypeOptions, style?: React.CSSProperties, status?: number) => {
    const toastBlock = toastBlockedRoutes.find(x => window.location.pathname.includes(x.blockedRoute))
    if (toastBlock) {
        if (!status || status === 0 || toastBlock.blockedStatuses?.includes(status)){
            return;
        }
    }
    toast(message, {
        type: type,
        style: style
    })
}

const errorMiddleware: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const error: IError | any = action.payload as IError;
        switch (error.status) {
            case 423:
                if (error.data?.Message) {
                    const lockMessage = error.data?.UnlockTime
                        ? `до  ${new Date(error.data.UnlockTime).toLocaleDateString()} ${new Date(error.data.UnlockTime).toLocaleTimeString()}`
                        : "На невизначений термін"
                    showToast(`${error.data?.Message} ${lockMessage}`, 'info', { width: 'fit-content' })
                }
                else {
                    showToast(`${error.data?.message}`, 'info', { width: 'fit-content' })
                }
                break;
            case 401:
                if ((api.getState() as RootState).user) {
                    api.dispatch(logOut())
                }
                else {
                    api.dispatch(setRedirect('/auth'))
                }
                break;
            case 400:
            case 404:
            case 403:
            case 405:
                if (error.data?.length && error.data?.length > 0) {
                    error.data?.forEach((element: any) => {
                        showToast(`Error: "${element.ErrorMessage}"  Property: "${element.PropertyName}" Value: "${element.AttemptedValue}"`,
                            'error',
                            { width: 'fit-content' })
                    });
                }
                else {
                    showToast(error.data?.message || error.message || error.data?.Message || error.data?.title,
                        'info',
                        { width: 'fit-content' },
                        Number(error.status))
                }
                break;

            default:
                console.log(error)
                api.dispatch(setError(error))
        }
    }
    return next(action);
};

export default errorMiddleware;


