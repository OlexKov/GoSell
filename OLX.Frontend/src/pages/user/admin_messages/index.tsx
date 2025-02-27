import { useNavigate } from "react-router-dom";
import AdminMessageCard from "../../../components/admin_message_card";
import { BackButton } from "../../../components/buttons/back_button"
import PrimaryButton from "../../../components/buttons/primary_button";
import { useGetUserMessagesPageQuery, useSetUserMessageReadedMutation, useSetUserMessageReadedRangeMutation, useSoftDeleteUserMessageMutation, useSoftDeleteUserMessagesMutation } from "../../../redux/api/adminMessageApi";
import { toast } from "react-toastify";
import { useMemo, useState } from "react";
import { IAdminMesssage, IAdminMesssagePageRequest } from "../../../models/adminMesssage";
import { confirm } from "../../../utilities/confirm_modal";
import { Modal, Pagination } from "antd";
import { getDateTime } from "../../../utilities/common_funct";
import './style.scss'
import { APP_ENV } from "../../../constants/env";
import { Images } from "../../../constants/images";

const AdminMessagesPage: React.FC = () => {
    const [pageRequest, setPageRequest] = useState<IAdminMesssagePageRequest>({
        page: 1,
        size: 7,
        sortKey: '',
        isDescending: false,
        deleted: false
    })
    const { data: userMessages } = useGetUserMessagesPageQuery(pageRequest);
    const [deleteMessege] = useSoftDeleteUserMessageMutation();
    const [deleteAllMesseges] = useSoftDeleteUserMessagesMutation();
    const [setReaded] = useSetUserMessageReadedMutation()
    const [setReadedRange] = useSetUserMessageReadedRangeMutation()

    const navigate = useNavigate()
    const [messageViewerData, setMessageViewerData] = useState<{ open: boolean, message: IAdminMesssage | undefined }>({ open: false, message: undefined })
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
        setMessageViewerData({ open: true, message: message })
    }

    const messeges = useMemo(() => {
        return userMessages && userMessages.items.length > 0
            ? userMessages.items.slice()
                .map((x, index) =>
                    <AdminMessageCard
                        key={index}
                        adminMessage={x}
                        divider={index !== userMessages.items.length - 1}
                        className="h-[9vh]"
                        dividerClassName="my-[2vh]"
                        onDelete={onDelete}
                        onClick={onClick} />)
            : []
    }, [userMessages?.items])

    const setAllReaded = async () => {
        if (messeges.length > 0) {
            const ids = userMessages?.items.map(x => x.id) || []
            await setReadedRange(ids)
        }
    }

    const deleteAll = () => {
        if (messeges.length > 0) {
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

    const onPaginationChange = (page: number) => {
        setPageRequest({ ...pageRequest, page: page })
    }

    return (
        <>
            <div className="mx-auto mb-[8vh] w-[84vw]">
                <BackButton title="Назад" className=" my-[7vh] ml-[1vw] text-adaptive-1_9_text font-medium self-start" />
                <div className="flex items-center my-[6vh] justify-between">
                    <h2 className='text-[#3A211C] font-unbounded  text-adaptive-3_5-text font-normal '>Усі сповіщення</h2>
                    <div className="flex font-unbounded text-gray-500 font-light text-adaptive-1_5-text gap-[1vw]">
                        <span onClick={setAllReaded} className="hover:underline hover:text-gray-700 cursor-pointer">позначити як прочитані</span>
                        <span onClick={deleteAll} className="hover:underline hover:text-gray-700 cursor-pointer">видалити всі на стрінці</span>
                    </div>
                </div>

                {messeges.length > 0
                    ? <div>
                        {...messeges}
                        {(userMessages?.total || 0) > messeges.length &&
                            <Pagination
                                className="mt-[5vh] custom-pagination"
                                align="center"
                                current={pageRequest.page}
                                pageSize={pageRequest.size}
                                onChange={onPaginationChange}
                                total={userMessages?.total}
                                style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(12px,1.8vh,25px)' }} />
                        }
                    </div>
                    : <div className="w-[100%] py-[10vh] px-[8vw] h-[400px] flex-col justify-start items-center inline-flex">
                        <p className="font-semibold font-montserrat text-adaptive-card-price-text mb-[16px]">Сповіщення поки немає</p>
                        <p className="font-normal font-montserrat text-adaptive-card-price-text mb-[32px]">Всі ваші сповіщення зберігатимуться тут</p>
                        <PrimaryButton onButtonClick={() => { navigate(`/`) }} className="w-[16.4vw] h-[4.8vh]" title="На головну" brColor="#9B7A5B" bgColor="#9B7A5B" fontColor="white" fontSize="clamp(14px,1.9vh,36px)" isLoading={false} />
                    </div>}

            </div>
            <Modal
                centered={true}
                title={
                    <div className="flex items-center justify-between font-montserrat ">
                        <p className="text-adaptive-1_6-text">{`Системне повідомлення`}</p>
                        <span className="text-adaptive-1_3-text pr-[1vw] text-gray-500">{getDateTime(messageViewerData.message?.created || '')}</span>
                    </div>}

                footer={
                    <PrimaryButton
                        title={"Закрити"}
                        isLoading={false}
                        onButtonClick={() => setMessageViewerData({ ...messageViewerData, open: false })}
                        bgColor="white"
                        brColor="#9B7A5B"
                        fontSize="clamp(12px,1.6vh,28px)" />
                }
                open={messageViewerData.open}
                onCancel={() => setMessageViewerData({ open: false, message: undefined })}
            >
                <div className="flex flex-col p-[1vh] font-montserrat ">
                    <p className="text-adaptive-1_7_text text-balance font-medium">{messageViewerData.message?.message.subject}</p>
                    <hr className="pb-[1vh]" />
                    <div className="flex gap-[1vw]">
                        <div className=" h-[9vh] aspect-square p-[0.5vh] bg-white rounded-md border border-[#9B7A5B]">
                            <img className="h-full aspect-square" src={messageViewerData.message?.messageLogo ? APP_ENV.IMAGES_200_URL + messageViewerData.message?.messageLogo : Images.logo} />
                        </div>
                        <p className="text-adaptive-1_6-text text-balance self-start">{messageViewerData.message?.message.content}</p>
                    </div>
                </div>
            </Modal>
        </>)
}

export default AdminMessagesPage