
import { DownOutlined, LogoutOutlined, MailOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import './style.scss'
import { Badge, Dropdown, MenuProps } from 'antd'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUserDescr } from '../../../../utilities/common_funct';
import UserAvatar from '../../../user_avatar';
import { getRefreshToken, getUser } from '../../../../redux/slices/userSlice';
import { useLogoutMutation } from '../../../../redux/api/accountApi';
import { useAppSelector } from '../../../../redux';
import { useEffect } from 'react';
import { useGetAdminUnreadedMessagesQuery } from '../../../../redux/api/adminMessageApi';
import { useSignalR } from '../../../hendlers/signalR/signalRContext';
import { Images } from '../../../../constants/images';




export const AdminHeader: React.FC = () => {
    const navigate = useNavigate();
    const [logout] = useLogoutMutation();
    const signalRConnection = useSignalR();
    const user = useSelector(getUser)
    const refreshToken = useAppSelector(getRefreshToken)
    const { data: messagesForAdmin, refetch } = useGetAdminUnreadedMessagesQuery();
    const items: MenuProps['items'] = [
        {
            icon: <SettingOutlined />,
            label: <Link to={'/admin/settings'}>Налаштування</Link>,
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            icon: <LogoutOutlined />,
            label: 'Вийти',
            key: '3',
            onClick: async () => {
                try { await signalRConnection?.connection?.invoke("Disconnect"); }
                finally { await logout(refreshToken || '').unwrap(); }
            }
        },
    ];
    useEffect(() => { refetch() }, [user])
    return (
        <div className='h-[60px] bg-header sticky top-0 items-center flex-shrink-0 flex justify-end z-50'  >
            <div className='flex justify-between gap-7 h-full w-full'>
                <img className='ml-[1vw] w-[6vw] cursor-pointer' color='white' src={Images.logo_white} onClick={() => navigate("/")} />
                <div className='flex gap-7 h-full items-center'>
                    <Badge count={messagesForAdmin?.length} size='small' className={messagesForAdmin?.length && messagesForAdmin.length > 0 ? "animate-pulse" : ''}>
                        <MailOutlined onClick={() => navigate('/admin/messages')} className='text-xl text-white' />
                    </Badge>

                    <Dropdown menu={{ items }} trigger={['click']} className=' min-w-[180] px-5 cursor-pointer h-full  flex-shrink-0 bg-orange-500 flex gap-2 justify-center items-center'>
                        <div>
                            <UserAvatar size={40} user={user} />
                            <span className='flex-shrink-0  text-base text-nowrap'>{user ? getUserDescr(user) : ''}</span>
                            <DownOutlined />
                        </div>
                    </Dropdown>
                </div>


            </div>
        </div>
    )
}