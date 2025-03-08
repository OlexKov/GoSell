import { Badge, Dropdown, MenuProps } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BellOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { Images } from "../../../../constants/images";
import { getRefreshToken, getUser } from "../../../../redux/slices/userSlice";
import UserAvatar from "../../../user_avatar";
import { useLogoutMutation } from "../../../../redux/api/accountApi";
import { useAppSelector } from "../../../../redux";
import { useGetUserUnreadedMessagesQuery } from "../../../../redux/api/adminMessageApi";
import { ReactNode, useEffect, useMemo, useState } from "react";
import FavoriteButton from "../../../buttons/favorites_button";
import { useSignalR } from "../../../hendlers/signalR/signalRContext";
import SearchInput from "../../../inputs/search_input";
import { HeaderProps } from "./props";
import PrimaryButton from "../../../buttons/primary_button";
import '../../../category_tree/style.scss'
import AdminMessageCard from "../../../admin_message_card";
import { useGetChatsQuery } from "../../../../redux/api/chatAuthApi";
import { IAdminMesssage } from "../../../../models/adminMesssage";


export const Header: React.FC<HeaderProps> = ({ className }) => {
    const { data: chats } = useGetChatsQuery(0)
    const { pathname } = useLocation()
    const signalRConnection = useSignalR();
    const [logout] = useLogoutMutation();
    const navigate = useNavigate();
    const user = useSelector(getUser)
    const { data: userUnreadedMessages, refetch } = useGetUserUnreadedMessagesQuery();
    const refreshToken = useAppSelector(getRefreshToken)
    const [messegesOpen, setMessegesOpen] = useState<boolean>(false)
    const items: MenuProps['items'] = [
        {
            icon: <UserOutlined />,
            label: <Link className="font-medium text-adaptive-1_6-text" to={'user'}><span>Профіль</span></Link>,
            key: '0',
        },
        {
            icon: <BellOutlined />,
            label: <Link className="font-medium text-adaptive-1_6-text" to={'user/messages'}>Сповіщення</Link>,
            key: '1',
        },
        {
            icon: <SettingOutlined />,
            label: <Link className="font-medium text-adaptive-1_6-text" to={'user/edit'}>Налаштування</Link>,
            key: '3',
        },
        {
            type: 'divider',
        },
        {
            icon: <LogoutOutlined />,
            label: <span className="font-medium text-adaptive-1_6-text">Вийти</span>,
            key: '4',
            onClick: async () => {
                await signalRConnection?.connection?.invoke("Disconnect");
                await logout(refreshToken || '').unwrap();
            }
        },
    ];

    const unreaded = useMemo(() =>
        chats?.length && chats?.map(x => user?.id == x.buyer.id ? x.buyerUnreaded : x.sellerUnreaded)
            .reduce((acc, num) => acc + num, 0),
        [chats,user?.id]);

    const unreadedMessagesCount = useMemo(() => userUnreadedMessages?.length && userUnreadedMessages.filter(x => !x.readed).length || 0, [userUnreadedMessages])
    useEffect(() => { refetch() }, [user])
    const messagesDropdown = () =>
        <div className=" flex flex-col justify-between items-center gap-[2vh] mt-[2.4vh] shadow-[0_0_20px_10px_rgba(0,0,0,0.07)] bg-white rounded-md p-[1vh]">
            <div className="flex flex-col gap-[1vh] items-center p-[0.5vh] max-h-[70vh] w-[25vw] overflow-y-auto custom-scrollbar">
                {userUnreadedMessages && userUnreadedMessages.length > 0
                    ? <div className="flex flex-col w-full">
                        {userUnreadedMessages.slice()
                        .sort((a:IAdminMesssage,b:IAdminMesssage)=> b.created.localeCompare(a.created))
                        .map((x, index) =>
                            <AdminMessageCard
                                key={index}
                                adminMessage={x}
                                divider={index !== userUnreadedMessages.length - 1}
                                className="h-[8.5vh]"
                                dividerClassName="my-[1.5vh]" />)}
                    </div>
                    : <span className="font-montserrat text-gray-500 text-adaptive-text"> Немає нових сповіщень </span>}
            </div>
            <PrimaryButton
                onButtonClick={() => { setMessegesOpen(false); navigate('user/messages') }}
                title='Переглянути все'
                className=" h-[4.3vh] rounded-md font-montserrat"
                fontColor="black"
                fontSize="clamp(14px,1.6vh,36px)"
                bgColor="white"
                brColor="#9B7A5B"
                isLoading={false}
                disabled={!userUnreadedMessages || userUnreadedMessages.length === 0} />
        </div>

    const userMenuDropdown = (originFileObj: ReactNode) =>
        <div className="mt-[2vh]">{originFileObj}</div>


    return (
        <div className={`h-[9vh] min-h-[60px] sticky px-[8vw] top-0 items-center bg-white flex-shrink-0 flex justify-between z-50 ${className}`}  >
            <div className="h-[42.5%] cursor-pointer  flex-shrink-0  transition-all duration-300 ease-in-out hover:scale-[1.05] hover:rotate-1">
                <img alt="logo" onClick={() => navigate('/')} className="h-full w-full" src={Images.logo} />
            </div>

            <SearchInput className="mx-[1vw]" />
            <div className='flex gap-10  items-center'>
                {user && <Badge count={location.pathname !== '/user/chat' ? unreaded : 0} size='small'>
                    <div onClick={() => navigate(`/user/chat`)} className={`h-7  text-amber-950 cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.1]`}>
                        {location.pathname !== '/user/chat'
                            ? <svg className="h-full w-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <g clipPath="url(#clip0_61_200)">
                                    <path d="M1.56537 1.57824C2.56887 0.568673 3.93168 0 5.35443 0H18.6456C20.0683 0 21.4311 0.568671 22.4347 1.57824C23.4379 2.58753 24 3.95467 24 5.3785V13.9362C23.9935 14.5962 23.8387 15.3793 23.5935 15.9917C23.3362 16.5994 22.8946 17.2644 22.4347 17.7363C21.9651 18.1994 21.3026 18.6447 20.6973 18.9041C20.0866 19.1513 19.3041 19.308 18.6456 19.3147H17.3544V21.5445H17.3501C17.3493 21.9309 17.2514 22.4213 17.1053 22.7349C16.9075 23.0846 16.477 23.5197 16.1283 23.7226L16.1284 23.7228C16.1275 23.7233 16.1266 23.7237 16.1256 23.7242C16.1249 23.7245 16.1242 23.725 16.1235 23.7254L16.1235 23.7252C15.8221 23.8721 15.3344 23.9916 15.001 24H14.9964C14.3267 23.9937 13.6881 23.7228 13.2177 23.2486L9.24948 19.3147H5.35443C3.93168 19.3147 2.56887 18.7461 1.56537 17.7363C1.10542 17.2644 0.663749 16.5994 0.406474 15.9917C0.161355 15.3793 0.00650619 14.5962 0 13.9362V5.3785C0 3.95467 0.56214 2.58753 1.56537 1.57824ZM5.35443 2.73418C4.66215 2.73418 3.99657 3.01077 3.50453 3.50577C3.01222 4.00106 2.73418 4.67453 2.73418 5.3785V13.9362C2.72767 14.3297 2.7791 14.5899 2.93474 14.9508C3.07822 15.3165 3.22397 15.536 3.50453 15.8089C3.99657 16.3039 4.66215 16.5805 5.35443 16.5805H9.81228C10.1728 16.5805 10.5187 16.7229 10.7747 16.9767L14.6203 20.789V17.9475C14.6203 17.1926 15.2323 16.5805 15.9873 16.5805H18.6456C19.0344 16.5871 19.2886 16.5362 19.6455 16.3803C20.0078 16.2365 20.2245 16.0909 20.4955 15.8089C20.7759 15.536 20.9218 15.3165 21.0653 14.9508C21.221 14.5899 21.2724 14.3297 21.2659 13.9362V5.3785C21.2659 4.67453 20.9878 4.00104 20.4955 3.50577C20.0035 3.01077 19.3378 2.73418 18.6456 2.73418H5.35443Z" fill="black" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_61_200">
                                        <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                            : <svg className="h-full w-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M1.56537 1.57809C2.56887 0.568522 3.93168 -0.000150681 5.35443 -0.000150681H18.6456C20.0683 -0.000150681 21.4311 0.568521 22.4347 1.57809C23.4379 2.58738 24 3.95452 24 5.37835V13.936C23.9935 14.596 23.8387 15.3791 23.5935 15.9916C23.3362 16.5993 22.8946 17.2642 22.4347 17.7362C21.9651 18.1992 21.3026 18.6446 20.6973 18.904C20.0866 19.1512 19.3041 19.3078 18.6456 19.3145H17.3544V21.5443H17.3501C17.3493 21.9307 17.2514 22.4212 17.1053 22.7347C16.9075 23.0844 16.477 23.5195 16.1283 23.7225L16.1256 23.724L16.1235 23.7252C15.8222 23.8721 15.3344 23.9914 15.001 23.9998H14.9964C14.3267 23.9935 13.6881 23.7226 13.2177 23.2485L9.24948 19.3145H5.35443C3.93168 19.3145 2.56887 18.7459 1.56537 17.7362C1.10542 17.2642 0.663749 16.5993 0.406474 15.9916C0.161355 15.3791 0.00650619 14.596 0 13.936V5.37835C0 3.95452 0.56214 2.58738 1.56537 1.57809Z" fill="black" />
                            </svg>}
                    </div>
                </Badge>}

                <FavoriteButton />

                {user && <Badge count={unreadedMessagesCount} size="small" className={unreadedMessagesCount > 0 && !messegesOpen && pathname !== '/user/messages' ? "animate-pulse" : ''} >
                    <Dropdown
                        dropdownRender={messagesDropdown}
                        open={messegesOpen}
                        trigger={['click']}
                        placement="bottom"
                        onOpenChange={(open: boolean) => setMessegesOpen(open && pathname !== '/user/messages')}>
                        <div className={`h-9  text-amber-950 cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.1]`}>
                            {!messegesOpen && pathname !== '/user/messages'
                                ? <svg className="h-full w-auto" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                                    <path d="M13 23.8333C14.1917 23.8333 15.1667 22.8583 15.1667 21.6666H10.8333C10.8333 22.8583 11.8083 23.8333 13 23.8333ZM19.5 17.3333V11.9166C19.5 8.59075 17.7342 5.80659 14.625 5.06992V4.33325C14.625 3.43409 13.8992 2.70825 13 2.70825C12.1008 2.70825 11.375 3.43409 11.375 4.33325V5.06992C8.27668 5.80659 6.50001 8.57992 6.50001 11.9166V17.3333L4.33334 19.4999V20.5833H21.6667V19.4999L19.5 17.3333ZM17.3333 18.4166H8.66668V11.9166C8.66668 9.22992 10.3025 7.04159 13 7.04159C15.6975 7.04159 17.3333 9.22992 17.3333 11.9166V18.4166Z" fill="black" />
                                </svg>
                                : <svg className="h-full w-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 22C13.1 22 14 21.1 14 20H10C10 20.5304 10.2107 21.0391 10.5858 21.4142C10.9609 21.7893 11.4696 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="black" />
                                </svg>}
                        </div>
                    </Dropdown>

                </Badge>}

                {user
                    ?
                    <Dropdown
                        dropdownRender={userMenuDropdown}
                        menu={{ items }}
                        trigger={['click']}
                        className='px-3 cursor-pointer  flex-shrink-0 flex gap-2 justify-center items-center'
                        placement="bottom"
                        overlayClassName="w-[10vw] font-montserrat ">
                        <div>
                            <UserAvatar user={user} size={40} className="transition-all duration-300 ease-in-out hover:scale-[1.2]" />
                        </div>
                    </Dropdown>
                    :
                    <UserOutlined onClick={() => navigate('auth')} className='text-adaptive-icons text-amber-950 cursor-pointer' />}

            </div>
        </div>
    )
}