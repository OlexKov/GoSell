import { Modal } from "antd"
import PrimaryButton from "../../buttons/primary_button"
import { useAppDispatch, useAppSelector } from "../../../redux"
import { getDateTime, getNameInitials, stringToColor } from "../../../utilities/common_funct"
import { APP_ENV } from "../../../constants/env"
import { Images } from "../../../constants/images"
import { closeMessageViewModal } from "../../../redux/slices/modalSlice"
import { useMemo } from "react"

const AdminMessageViewer: React.FC = () => {
    const { isMessageViewModalOpen, adminMessage, title } = useAppSelector(state => state.modalSlice)
    const dispatch = useAppDispatch();
    const userInitials = useMemo(() => getNameInitials(adminMessage?.userName), [adminMessage]);
    return (
        <Modal
            width={'40vw'}
            centered={true}
            title={
                <div className="flex items-center justify-between font-montserrat ">
                    <p className="text-adaptive-1_6-text">{title}</p>
                    <span className="text-adaptive-1_3-text pr-[1.5vw] text-gray-500">{getDateTime(adminMessage?.created || '')}</span>
                </div>}

            footer={
                <PrimaryButton
                    title={"Закрити"}
                    isLoading={false}
                    onButtonClick={() => dispatch(closeMessageViewModal())}
                    bgColor="white"
                    brColor="#9B7A5B"
                    fontSize="clamp(12px,1.6vh,28px)" />
            }
            open={isMessageViewModalOpen}
            onCancel={() => dispatch(closeMessageViewModal())}
        >
            <div className="flex flex-col p-[1vh] min-h-[40vh]  font-montserrat ">
                <p className="text-adaptive-1_7_text text-balance font-medium">{adminMessage?.message.subject}</p>
                <hr className="my-[2vh] w-full " />
                <div className="flex gap-[1vw] ">
                    {location.pathname !== '/admin/messages'
                        ? <div className=" h-[9vh] aspect-square p-[0.5vh] bg-white rounded-md border border-[#9B7A5B]">
                            <img className="h-full aspect-square" src={adminMessage?.messageLogo ? APP_ENV.IMAGES_200_URL + adminMessage?.messageLogo : Images.logo} />
                        </div>
                        : (adminMessage?.messageLogo
                            ? <img className="h-[7vh] aspect-square rounded-full" src={APP_ENV.IMAGES_200_URL + adminMessage.messageLogo} />
                            : <div style={{ backgroundColor: stringToColor(adminMessage?.userName || '') }} className={`p-2 overflow-hidden h-[7vh] flex items-center justify-center aspect-square rounded-full `}>
                                <span style={{ fontSize: `clamp(14px,${6 - userInitials.length}vh,90px)`, color: 'white' }}>{userInitials}</span>
                            </div>)
                    }

                    <p className="text-adaptive-1_6-text overflow-hidden text-balance self-start">{adminMessage?.message.content}</p>
                </div>
            </div>
        </Modal>
    )
}

export default AdminMessageViewer