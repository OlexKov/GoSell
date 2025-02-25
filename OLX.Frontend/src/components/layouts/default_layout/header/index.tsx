import { Badge, Dropdown, MenuProps } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { BellFilled, BellOutlined, LogoutOutlined, MessageOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
import { Images } from "../../../../constants/images";
import { getRefreshToken, getUser } from "../../../../redux/slices/userSlice";
import UserAvatar from "../../../user_avatar";
import { useLogoutMutation } from "../../../../redux/api/accountApi";
import { useAppSelector } from "../../../../redux";
import { useGetUserMessagesQuery } from "../../../../redux/api/adminMessageApi";
import { ReactNode, useEffect, useMemo, useState } from "react";
import FavoriteButton from "../../../buttons/favorites_button";
import { useSignalR } from "../../../hendlers/signalR/signalRContext";
import SearchInput from "../../../inputs/search_input";
import { HeaderProps } from "./props";
import PrimaryButton from "../../../buttons/primary_button";
import '../../../category_tree/style.scss'

export const Header: React.FC<HeaderProps> = ({ className }) => {
    const signalRConnection = useSignalR();
    const [logout] = useLogoutMutation();
    const navigator = useNavigate();
    const user = useSelector(getUser)
    const { data: userMessages, refetch } = useGetUserMessagesQuery();
    const refreshToken = useAppSelector(getRefreshToken)
    const [messegesOpen, setMessegesOpen] = useState<boolean>(false)

    const items: MenuProps['items'] = [
        {
            icon: <UserOutlined />,
            label: <Link className="font-medium text-adaptive-1_6-text" to={'user'}>Профіль</Link>,
            key: '0',
        },
        {
            icon: <SettingOutlined />,
            label: <Link className="font-medium text-adaptive-1_6-text" to={'user/edit'}>Налаштування</Link>,
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            icon: <LogoutOutlined />,
            label: <span className="font-medium text-adaptive-1_6-text">Вийти</span>,
            key: '3',
            onClick: async () => {
                await signalRConnection?.connection?.invoke("Disconnect");
                await logout(refreshToken || '').unwrap();
            }
        },
    ];

    const unreadedMessagesCount = useMemo(() => userMessages?.length && userMessages.filter(x => !x.readed).length || 0, [userMessages])
    useEffect(() => { refetch() }, [user])

    const messagesDropdown = () =>
        <div className=" flex flex-col justify-between items-center gap-[2vh] mt-[2.4vh] shadow-[0_0_20px_10px_rgba(0,0,0,0.07)] bg-white rounded-md p-[1vh]">
            <div className="flex flex-col gap-[1vh] items-center p-[0.5vh] max-h-[70vh] w-[25vw] overflow-y-auto custom-scrollbar">
                {userMessages && userMessages.length > 0
                    ? <div className="flex flex-col items-center  w-full">
                        {userMessages.map((x, index) =>
                            <div className="w-full">
                                <div key={index} className={`flex gap-[1vw] w-full rounded-md ${x.readed ? 'bg-white' : 'bg-red-200'}`}>
                                    <div className="h-[9vh] aspect-square bg-slate-200"></div>
                                    <div className="flex flex-col font-montserrat text-adaptive-text text-[black]">
                                        <span>{x.message.subject}</span>
                                        <span>{x.message.content}</span>
                                    </div>
                                </div>
                                {index !== userMessages.length - 1 && <hr className="my-[1.5vh]" />}
                            </div>

                        )

                        }
                    </div>
                    : <span className="font-montserrat text-adaptive-text">Повідомлення відсутні</span>}
            </div>
            <PrimaryButton
                title='Переглянути все'
                className=" h-[4.3vh] rounded-md font-montserrat"
                fontColor="black"
                fontSize="clamp(14px,1.6vh,36px)"
                bgColor="white"
                brColor="#9B7A5B"
                isLoading={false} />
        </div>

    const userMenuDropdown = (originFileObj: ReactNode) =>
        <div className="mt-[2vh]">{originFileObj}</div>


    return (
        <div className={`h-[9vh] min-h-[60px] sticky px-[8vw] top-0 items-center bg-white flex-shrink-0 flex justify-between z-50 ${className}`}  >
            <div className="h-[42.5%] cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.05] hover:rotate-1">
                <img alt="logo" onClick={() => navigator('/')} className="h-full w-full" src={Images.logo} />
            </div>

            <SearchInput />
            <div className='flex gap-10  items-center text-[clamp(1rem, 2vh, 1.5rem)]'>
                {user && <Badge count={userMessages?.length} size='small'>
                    <MessageOutlined className='text-adaptive-icons text-amber-950 cursor-pointer animate-wiggle transition-all duration-300 ease-in-out hover:scale-[1.1]' />
                </Badge>}

                <FavoriteButton />

                {user && <Badge count={unreadedMessagesCount} size='small' className={unreadedMessagesCount > 0  && !messegesOpen ? "animate-pulse" : ''} >
                    <Dropdown
                        dropdownRender={messagesDropdown}
                        trigger={['click']}
                        placement="bottom"
                        onOpenChange={(open: boolean) => setMessegesOpen(open)}>
                        {!messegesOpen
                            ? <BellOutlined className={`text-adaptive-icons text-amber-950 cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.1]`} />
                            : <BellFilled className={`text-adaptive-icons text-amber-950 cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.1]`} />}

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
                        overlayClassName="w-[10vw] font-montserrat">
                        <div>
                            <UserAvatar user={user} size={40} className="transition-all duration-300 ease-in-out hover:scale-[1.2]" />
                        </div>
                    </Dropdown>
                    :
                    <UserOutlined onClick={() => navigator('auth')} className='text-adaptive-icons text-amber-950 cursor-pointer' />}

            </div>
        </div>
    )
}