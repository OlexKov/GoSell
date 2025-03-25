import { PageHeader } from "../../../../components/page_header";
import { UserOutlined } from '@ant-design/icons';
import { Modal, Popconfirm } from "antd";
import { IOlxUser, IOlxUserPageRequest } from "../../../../models/user";
import PageHeaderButton from "../../../../components/buttons/page_header_button";
import { useEffect, useRef, useState } from "react";
import { paginatorConfig } from "../../../../utilities/pagintion_settings";
//import AdminMessageModal from "../../../../components/modals/admin_message";
import { useCreateAdminMessageMutation } from "../../../../redux/api/adminMessageApi";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton/IconButton";
import Tooltip from "@mui/material/Tooltip/Tooltip";
import { getUserDescr } from "../../../../utilities/common_funct";
import { useDeleteAccountMutation, useLockUnlockUsersMutation } from "../../../../redux/api/accountAuthApi";
import AdminLock from "../../../../components/modals/admin_user_lock";
import UserTable from "../../../../components/user_table/intedx";
import {
    SearchOff,
    MessageOutlined,
    CachedOutlined,
    IndeterminateCheckBoxOutlined,
    DeleteForever,
    LockOutlined,
    LockOpen
} from "@mui/icons-material";
import { useLocation, useSearchParams } from "react-router-dom";
import { useGetUserPageQuery } from "../../../../redux/api/userAuthApi";
import { useAppDispatch, useAppSelector } from "../../../../redux";
import useAdminPasswordCheck from "../../../../hooks/checkAdminPassword";
import { scrollTop } from "../../../../redux/slices/appSlice";
import { openMessageSendModal } from "../../../../redux/slices/modalSlice";

const updatedPageRequest = (searchParams: URLSearchParams) => ({
    isAdmin: location.pathname === '/admin/admins',
    isLocked: location.pathname === '/admin/adverts/blocked',
    size: Number(searchParams.get("size")) || paginatorConfig.pagination.defaultPageSize,
    page: Number(searchParams.get("page")) || paginatorConfig.pagination.defaultCurrent,
    sortKey: searchParams.get("sortKey") || '',
    isDescending: searchParams.get("isDescending") === "true",
    emailSearch: searchParams.get("emailSearch") || '',
    phoneNumberSearch: searchParams.get("phoneNumberSearch") || '',
    firstNameSearch: searchParams.get("firstNameSearch") || '',
    lastNameSearch: searchParams.get("lastNameSearch") || '',
    webSiteSearch: searchParams.get("webSiteSearch") || '',
    settlementSearch: searchParams.get("settlementSearch") || '',
});


const UsersPage: React.FC = () => {
    const location = useLocation()
    const dispatch = useAppDispatch()
    const currentUser = useAppSelector(state => state.user.user)
    const [searchParams] = useSearchParams('');
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const selectedUser = useRef<number | undefined>();
    const [modal, contextHolder] = Modal.useModal();
    const [isAdminLockOpen, setAminLockOpen] = useState<boolean>(false);
    const adminModalTitle = useRef<string>('')
    const [lockUsers, { isLoading: isUsersLocking }] = useLockUnlockUsersMutation();
    const [pageRequest, setPageRequest] = useState<IOlxUserPageRequest>(updatedPageRequest(searchParams));
    const { data, isLoading, refetch } = useGetUserPageQuery(pageRequest)
    const [removeUser] = useDeleteAccountMutation()
    const { passwordCheck } = useAdminPasswordCheck()

    useEffect(() => {
        setPageRequest(updatedPageRequest(searchParams));
    }, [location.search, location.pathname]);

    useEffect(() => {
        dispatch(scrollTop())
    }, [data])

    const actions = (_value: any, user: IOlxUser) =>
        <div className='flex justify-around'>
            {(location.pathname !== '/admin/admins') &&
                <>
                    <Tooltip title="Написати повідомлення">
                        <IconButton onClick={() => sendMessage(user.id)} color="info" size="small">
                            <MessageOutlined />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={location.pathname !== '/admin/adverts/blocked'
                        ? "Блокувати"
                        : "Розблокувати"}>
                        <IconButton
                            disabled={isUsersLocking}
                            onClick={() => location.pathname !== '/admin/adverts/blocked'
                                ? lockUser(user.id)
                                : unLockUser(user.id)} color="warning" size="small">
                            {location.pathname !== '/admin/adverts/blocked' ? <LockOutlined /> : <LockOpen />}
                        </IconButton>
                    </Tooltip>
                </>
            }
            {((currentUser?.id != user.id)) &&

                <Popconfirm
                    title="Видалення акаунту"
                    description={`Ви впевненні що бажаєте видалити акаунт "${getUserDescr(user)}"?`}
                    onConfirm={() => onUserRemove(user.id)}
                    okText="Видалити"
                    cancelText="Відмінити"
                >
                    <Tooltip title="Видалити">
                        <IconButton color="error" size="small">
                            <DeleteForever />
                        </IconButton>
                    </Tooltip>
                </Popconfirm>
            }
        </div >

    const onUserRemove = async (id: number) => {
        if (location.pathname === '/admin' || await passwordCheck()) {
            const result = await removeUser(id);
            if (!result.error) {
                toast(`Користувач успішно видалений`, {
                    type: 'info',
                    style: { width: 'fit-content' }
                })
            }
        }
    }
    const getUserName = (userId: number) => getUserDescr(data?.items.find(x => x.id === userId) || null)

    const sendMessage = async (userId: number) => {
        dispatch(openMessageSendModal({
            title: `Повідомлення для користувача "${getUserName(userId)}"`,
            userId: userId
        }))
    }
    const lockUser = (userId: number) => {
        selectedUser.current = userId;
        adminModalTitle.current = adminModalTitle.current = `Блокування користувача "${getUserName(userId)}"`
        setAminLockOpen(true)
    }

    const unLockUser = (userId: number) => {
        selectedUser.current = userId;
        onGroupeUnLockUsers();
    }

    const onLockUsers = async (data: any) => {
        const result = await lockUsers({
            userIds: selectedUser.current ? [selectedUser.current] : selectedUsers,
            lockReason: data.lockReason,
            lock: true,
            lockoutEndDate: data.lockEndDate
        })
        if (!result.error) {
            toast(`Користувач${selectedUsers.length > 1 ? 'ів' : 'а'} заблоковано`, {
                type: 'info',
                style: { width: 'fit-content' }
            })
            setSelectedUsers([])
            selectedUser.current = undefined;
            setAminLockOpen(false)
        }
    }

    const onGroupeLockUsers = async () => {
        if (selectedUsers.length === 1) {
            adminModalTitle.current = adminModalTitle.current = `Блокування користувача "${getUserName(selectedUsers[0])}"`
        }
        else {
            adminModalTitle.current = "Блокування обраних користувачів"
        }
        setAminLockOpen(true)
    }

    const unlockUsers = async () => {
        const result = await lockUsers({
            userIds: selectedUser.current ? [selectedUser.current] : selectedUsers,
            lock: false,
        })
        if (!result.error) {
            toast(`Користувач${selectedUsers.length > 1 ? 'ів' : 'а'} розблоковано`, {
                type: 'info',
                style: { width: 'fit-content' }
            })
            setSelectedUsers([])
            selectedUser.current = undefined;
        }
    }

    const onGroupeUnLockUsers = async () => {
        modal.confirm({
            title: `Розблокування ${selectedUser.current || selectedUsers.length === 1 ? ` користувача` : " користувачів"} `,
            icon: <LockOpen />,
            content: `Розблокувати ${selectedUser.current || selectedUsers.length === 1 ? `користувача ${getUserName(selectedUser.current || 0) || getUserName(selectedUsers[0])}` : "обраних користувачів"}?`,
            okText: 'Розблокувати',
            cancelText: 'Відмінити',
            onOk: unlockUsers,
            onCancel: () => selectedUser.current = undefined
        });
    }


    const onGroupeMessageSend = () => {
        let title = '';

        if (selectedUsers.length === 0) {
            title = "Повідомлення для всіх користувачів"
        }
        else if (selectedUsers.length === 1) {
            title = `Повідомлення для користувача "${getUserName(selectedUsers[0])}"`
        }
        else {
            title = "Повідомлення для обраних користувачів"
        }

        dispatch(openMessageSendModal({
            title: title,
            userId: undefined,
            usersIds: selectedUsers
        }))

    }

    const pageHeaderButtons = [
        <PageHeaderButton
            key='clear_filter'
            onButtonClick={() => {
                setPageRequest((prev) => ({
                    ...prev,
                    emailSearch: '',
                    phoneNumberSearch: '',
                    firstNameSearch: '',
                    lastNameSearch: '',
                    webSiteSearch: '',
                    settlementSearch: ''
                }))
            }}
            className="w-[35px] h-[35px] bg-red-900"
            buttonIcon={<SearchOff className="text-lg" />}
            tooltipMessage="Очистити фільтри"
            tooltipColor="gray"
            disabled={
                pageRequest.emailSearch === '' &&
                pageRequest.phoneNumberSearch === '' &&
                pageRequest.firstNameSearch === '' &&
                pageRequest.lastNameSearch === '' &&
                pageRequest.webSiteSearch === '' &&
                pageRequest.settlementSearch === ''} />,
        <PageHeaderButton
            key='clear_select'
            onButtonClick={() => setSelectedUsers([])}
            className="w-[35px] h-[35px] bg-red-700"
            buttonIcon={<IndeterminateCheckBoxOutlined className="text-lg" />}
            tooltipMessage="Очистити вибрані"
            tooltipColor="gray"
            disabled={selectedUsers.length === 0} />,
        <PageHeaderButton
            key='block_users'
            onButtonClick={location.pathname !== '/admin/adverts/blocked' ? onGroupeLockUsers : onGroupeUnLockUsers}
            className="w-[35px] h-[35px] bg-yellow-700"
            buttonIcon={location.pathname !== '/admin/adverts/blocked' ? <LockOutlined className="text-lg" /> : <LockOpen className="text-lg" />}
            tooltipMessage={location.pathname !== '/admin/adverts/blocked' ? "Блокувати акаунт" : "Розблокувати акаунт"}
            tooltipColor="gray"
            disabled={selectedUsers.length === 0 || location.pathname === '/admin/admins'} />,
        <PageHeaderButton
            key='send_message'
            onButtonClick={onGroupeMessageSend}
            className="w-[35px] h-[35px] bg-orange-500"
            buttonIcon={<MessageOutlined className="text-lg" />}
            tooltipMessage="Написати повідомлення"
            tooltipColor="gray"
            disabled={location.pathname === '/admin/admins'} />,
        <PageHeaderButton
            key='reload'
            onButtonClick={refetch}
            className="w-[35px] h-[35px] bg-green-700"
            buttonIcon={<CachedOutlined className="text-lg" />}
            tooltipMessage="Перезавантажити"
            tooltipColor="gray" />,
    ]

    return (
        <div className="m-6 flex-grow  text-center overflow-hidden">
            {contextHolder}
            {location.pathname !== '/admin/admins' &&
                <AdminLock
                    isOpen={isAdminLockOpen}
                    onConfirm={onLockUsers}
                    onCancel={() => setAminLockOpen(false)}
                    title={adminModalTitle.current} />
            }

            <PageHeader
                title={location.pathname === '/admin'
                    ? 'Всі користувачі'
                    : location.pathname === '/admin/admins'
                        ? 'Адміністратори'
                        : 'Заблоковані користувачі'}
                icon={<UserOutlined className="text-2xl" />}
                buttons={pageHeaderButtons} />

            <UserTable
                selectedUsers={selectedUsers}
                pageResponse={data}
                pageRequest={pageRequest}
                actions={actions}
                isLoading={isLoading}
                onRowSelection={setSelectedUsers}
                page={pageRequest.page || paginatorConfig.pagination.defaultCurrent}
                total={data?.total || 0}
                size={pageRequest.size || paginatorConfig.pagination.defaultPageSize}
                selected={location.pathname !== '/admin/admins'} />
        </div>
    );
};

export default UsersPage;