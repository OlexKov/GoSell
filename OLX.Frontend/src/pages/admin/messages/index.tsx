import { CachedOutlined, DeleteSweep, DoneAll, EmailOutlined } from "@mui/icons-material";
import PageHeaderButton from "../../../components/buttons/page_header_button";
import { PageHeader } from "../../../components/page_header"
import { IAdminMesssagePageRequest } from "../../../models/adminMesssage";
import { useMemo, useState } from "react";
import { useGetAdminMessagesPageQuery, useSetUserMessageReadedMutation, useSetUserMessageReadedRangeMutation, useSoftDeleteMessageMutation, useSoftDeleteMessagesMutation } from "../../../redux/api/adminMessageApi";
import { Pagination } from "antd";
import UserMessageCard from "../../../components/user_message_card";
import { toast } from "react-toastify";
import { confirm } from "../../../utilities/confirm_modal";
import { useAppDispatch } from "../../../redux";
import { openMessageViewModal } from "../../../redux/slices/modalSlice";

const UserMessagesPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const [deleteMessege] = useSoftDeleteMessageMutation();
    const [deleteAllMesseges] = useSoftDeleteMessagesMutation();
    const [setReaded] = useSetUserMessageReadedMutation()
    const [setReadedRange] = useSetUserMessageReadedRangeMutation()
    const [pageRequest, setPageRequest] = useState<IAdminMesssagePageRequest>({
        page: 1,
        size: 7,
        sortKey: '',
        isDescending: false,
        deleted: false
    })
    const { data: userMessages, refetch } = useGetAdminMessagesPageQuery(pageRequest);

    const onDelete = async (id: number) => {
        const result = await deleteMessege(id)
        if (!result.error) {
            toast(`Повідомлення успішно видалено`, {
                type: "success"
            })
        }
    }
    const onClick = async (id: number) => {
        const message = userMessages?.items.find(x => x.id === id)
        if (!message?.readed) {
            await setReaded(id)
        }
        dispatch(openMessageViewModal({
            title: `Повідомлення від користувача "${message?.userName}"`,
            adminMessage: message
        }))
    }

    const setAllReaded = async () => {
        if (messages.length > 0) {
            const ids = userMessages?.items.map(x => x.id) || []
            await setReadedRange(ids)
        }
    }

    const deleteAll = () => {
        if (messages.length > 0) {
            const ids = userMessages?.items.map(x => x.id) || []
            confirm({
                title: <span className="font-unbounded font-medium text-adaptive-1_7_text text-[red]">Видалення всіх сповіщень</span>,
                content: <div className="font-montserrat text-adaptive-1_7_text my-[2vh] mr-[1.5vw]">Ви впевненні що хочете видалити всі сповіщення?</div>,
                onOk: async () => {
                    const result = await deleteAllMesseges(ids)
                    if (!result.error) {
                        toast(`Сповіщення успішно видалені`, {
                            type: "success"
                        })
                    }
                },
                okText: 'Видалити'
            })
        }
    }

    const messages = useMemo(() => {
        return userMessages && userMessages.items.length > 0
            ? userMessages.items.slice()
                .map((x, index) =>
                    <UserMessageCard
                        key={x.id}
                        adminMessage={x}
                        divider={index !== userMessages.items.length - 1}
                        className="h-[6vh]"
                        dividerClassName="my-[2vh]"
                        onDelete={onDelete}
                        onClick={onClick}
                    />)
            : []
    }, [userMessages?.items])

    const onPaginationChange = (page: number) => {
        setPageRequest({ ...pageRequest, page: page })
    }
    return (<div className="m-6 flex-grow  text-center overflow-hidden">
        <PageHeader
            title="Повідомлення від користувачів"
            icon={<EmailOutlined className="text-2xl" />}
            buttons={[
                <PageHeaderButton
                    key='checkAll'
                    onButtonClick={setAllReaded}
                    className="w-[35px] h-[35px] bg-green-700"
                    buttonIcon={<DoneAll className="text-lg" />}
                    tooltipMessage="Позначити всі як прочитані"
                    disabled={userMessages?.items && userMessages.items.filter(x => !x.readed).length < 2}
                    tooltipColor="gray" />,
                <PageHeaderButton
                    key='removeAll'
                    onButtonClick={deleteAll}
                    className="w-[35px] h-[35px] bg-red-700"
                    buttonIcon={<DeleteSweep className="text-lg" />}
                    tooltipMessage="Видалити всі"
                    disabled={userMessages?.items && userMessages.items.length < 2}
                    tooltipColor="gray" />,
                <PageHeaderButton
                    key='reload'
                    onButtonClick={refetch}
                    className="w-[35px] h-[35px] bg-sky-700"
                    buttonIcon={<CachedOutlined className="text-lg" />}
                    tooltipMessage="Перезавантажити"
                    tooltipColor="gray" />
            ]}
        />
        <div className="flex flex-col mt-[2vh] p-5">
            {...messages}
            {(userMessages?.total || 0) > messages.length &&
                <Pagination
                    className="mt-[5vh]"
                    align="center"
                    current={pageRequest.page}
                    pageSize={pageRequest.size}
                    onChange={onPaginationChange}
                    total={userMessages?.total}
                    style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(12px,1.8vh,25px)' }} />
            }
        </div>

    </div>)
}

export default UserMessagesPage

