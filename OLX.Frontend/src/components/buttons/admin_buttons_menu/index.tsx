import '../button_menu/style.scss'
import { useState } from "react";
import { useApproveAdvertMutation, useDeleteAdvertMutation } from "../../../redux/api/advertAuthApi";
import { toast } from "react-toastify";
import { confirm } from "../../../utilities/confirm_modal";
import { Tooltip } from "antd";
import { AdminButtonMenuProps } from './props';
import { useAppDispatch } from '../../../redux';
import { openLockModal } from '../../../redux/slices/modalSlice';

const AdminButtonMenu: React.FC<AdminButtonMenuProps> = ({ className, advert }) => {
    const [open, setOpen] = useState<boolean>()
    const [deleteAdvert] = useDeleteAdvertMutation()
    const dispatch = useAppDispatch()
    const [approveAdvert] = useApproveAdvertMutation();

    const onDelete = async () => {
        confirm({
            title: <span className="font-unbounded font-medium text-adaptive-1_7_text text-[red]">Видалення оголошення</span>,
            content: <div className="font-montserrat text-adaptive-1_7_text my-[2vh] mr-[1.5vw]">Ви впевненні що хочете видалити це оголошення?</div>,
            onOk: async () => {
                const result = await deleteAdvert(advert.id);
                if (!result.error) {
                    toast(`Оголошення успішно видалене`, {
                        type: "success"
                    })
                }
            },
            okText: 'Видалити'
        })
    }

    const onLock = async () => {
        confirm({
            title: <span className="font-unbounded font-medium text-adaptive-1_7_text text-[red]">Блокування оголошення</span>,
            content: <div className="font-montserrat text-adaptive-1_7_text my-[2vh] mr-[1.5vw]">Ви впевненні що хочете заблокувати це оголошення?</div>,
            onOk: async () => {
                dispatch(openLockModal({ advert }))
            },
            okText: 'Заблокувати'
        })
    }

    const onApprove = async () => {
        confirm({
            title: <span className="font-unbounded font-medium text-adaptive-1_7_text text-[red]">Підтвердження оголошення</span>,
            content: <div className="font-montserrat text-adaptive-1_7_text my-[2vh] mr-[1.5vw]">Ви впевненні що хочете підтвердити це оголошення?</div>,
            onOk: async () => {
                const result = await approveAdvert(advert.id);
                if (!result.error) {
                    toast(`Оголошення ${advert.title} успішно підтверджено`, { type: 'info' })
                }
            },
            okText: 'Підтвердити'
        })
    }

    return (
        <div className={` button-menu ${className}`} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} >

            <div className="bg-white/30  hover:bg-white/60 z-50 rounded-md">
                <svg className=" w-full h-full cursor-pointer  transition-all duration-300 ease-in-out hover:scale-[1.1]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M21.67 18.1701L16.37 12.8701H15.38L12.84 15.4101V16.4001L18.14 21.7001C18.53 22.0901 19.16 22.0901 19.55 21.7001L21.67 19.5801C21.7627 19.4876 21.8362 19.3777 21.8864 19.2567C21.9366 19.1358 21.9624 19.0061 21.9624 18.8751C21.9624 18.7441 21.9366 18.6145 21.8864 18.4935C21.8362 18.3725 21.7627 18.2626 21.67 18.1701V18.1701Z" fill="chocolate" />
                    <path d="M17.34 10.19L18.75 8.78L20.87 10.9C21.4318 10.3375 21.7474 9.575 21.7474 8.78C21.7474 7.985 21.4318 7.2225 20.87 6.66L17.33 3.12L15.92 4.53V1.71L15.22 1L11.68 4.54L12.39 5.25H15.22L13.81 6.66L14.87 7.72L11.98 10.61L7.85 6.48V5.06L4.83 2.04L2 4.87L5.03 7.9H6.44L10.57 12.03L9.72 12.88H7.6L2.3 18.18C2.2073 18.2725 2.13375 18.3824 2.08357 18.5034C2.03339 18.6243 2.00756 18.754 2.00756 18.885C2.00756 19.016 2.03339 19.1457 2.08357 19.2666C2.13375 19.3876 2.2073 19.4975 2.3 19.59L4.42 21.71C4.81 22.1 5.44 22.1 5.83 21.71L11.13 16.41V14.29L16.28 9.14L17.34 10.19Z" fill="chocolate" />
                </svg>
            </div>

            <div className={`flex flex-col w-[95%] mx-auto gap-[2vh] button-menu-container z-0 ${open !== undefined ? !open ? 'close' : 'open' : ''}`}>
                {!advert.approved &&
                    <Tooltip title="Підтвердити" color="gray" placement="rightTop">
                        <div className="bg-white/30 p-[10%] hover:bg-white/60 rounded-md" >
                            <svg xmlns="http://www.w3.org/2000/svg" onClick={onApprove} className=" transition-all duration-300 ease-in-out hover:scale-[1.1] w-full h-auto cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9.00003 16.1701L4.83003 12.0001L3.41003 13.4101L9.00003 19.0001L21 7.00009L19.59 5.59009L9.00003 16.1701Z" fill="green" />
                            </svg>
                        </div>
                    </Tooltip>
                }
                {!advert.blocked &&
                    <Tooltip title="Заблокувати" color="gray" placement="rightTop">
                        <div className="bg-white/30 p-[10%] hover:bg-white/60 rounded-md" >
                            <svg xmlns="http://www.w3.org/2000/svg" className=" transition-all duration-300 ease-in-out hover:scale-[1.1] w-full h-auto cursor-pointer" width="24" height="24" onClick={onLock} viewBox="0 0 24 24" fill="none">
                                <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z" fill="blue" />
                            </svg>
                        </div>
                    </Tooltip>
                }

                <Tooltip title="Видалити" color="gray" placement="rightTop">
                    <div className="bg-white/30 p-[10%] hover:bg-white/60 rounded-md" >
                        <svg className=" transition-all duration-300 ease-in-out hover:scale-[1.1] w-full h-auto cursor-pointer" onClick={onDelete} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M19.452 7.5H4.547C4.47737 7.49972 4.40846 7.51398 4.34466 7.54187C4.28087 7.56977 4.2236 7.61068 4.17653 7.66198C4.12946 7.71329 4.09363 7.77386 4.07132 7.83981C4.04902 7.90577 4.04073 7.97566 4.047 8.045L5.334 22.181C5.37917 22.6781 5.60858 23.1403 5.97717 23.4769C6.34575 23.8135 6.82687 24.0001 7.326 24H16.673C17.1721 24.0001 17.6532 23.8135 18.0218 23.4769C18.3904 23.1403 18.6198 22.6781 18.665 22.181L19.95 8.045C19.9562 7.97586 19.9479 7.90619 19.9257 7.84042C19.9035 7.77465 19.8678 7.71423 19.821 7.663C19.7742 7.61169 19.7172 7.5707 19.6537 7.54264C19.5901 7.51457 19.5215 7.50005 19.452 7.5ZM10.252 20.5C10.252 20.6989 10.173 20.8897 10.0323 21.0303C9.89168 21.171 9.70091 21.25 9.502 21.25C9.30309 21.25 9.11232 21.171 8.97167 21.0303C8.83102 20.8897 8.752 20.6989 8.752 20.5V11.5C8.752 11.3011 8.83102 11.1103 8.97167 10.9697C9.11232 10.829 9.30309 10.75 9.502 10.75C9.70091 10.75 9.89168 10.829 10.0323 10.9697C10.173 11.1103 10.252 11.3011 10.252 11.5V20.5ZM15.252 20.5C15.252 20.6989 15.173 20.8897 15.0323 21.0303C14.8917 21.171 14.7009 21.25 14.502 21.25C14.3031 21.25 14.1123 21.171 13.9717 21.0303C13.831 20.8897 13.752 20.6989 13.752 20.5V11.5C13.752 11.3011 13.831 11.1103 13.9717 10.9697C14.1123 10.829 14.3031 10.75 14.502 10.75C14.7009 10.75 14.8917 10.829 15.0323 10.9697C15.173 11.1103 15.252 11.3011 15.252 11.5V20.5ZM22 4H17.25C17.1837 4 17.1201 3.97366 17.0732 3.92678C17.0263 3.87989 17 3.8163 17 3.75V2.5C17 1.83696 16.7366 1.20107 16.2678 0.732233C15.7989 0.263392 15.163 0 14.5 0H9.5C8.83696 0 8.20107 0.263392 7.73223 0.732233C7.26339 1.20107 7 1.83696 7 2.5V3.75C7 3.8163 6.97366 3.87989 6.92678 3.92678C6.87989 3.97366 6.8163 4 6.75 4H2C1.73478 4 1.48043 4.10536 1.29289 4.29289C1.10536 4.48043 1 4.73478 1 5C1 5.26522 1.10536 5.51957 1.29289 5.70711C1.48043 5.89464 1.73478 6 2 6H22C22.2652 6 22.5196 5.89464 22.7071 5.70711C22.8946 5.51957 23 5.26522 23 5C23 4.73478 22.8946 4.48043 22.7071 4.29289C22.5196 4.10536 22.2652 4 22 4ZM9 3.75V2.5C9 2.36739 9.05268 2.24021 9.14645 2.14645C9.24021 2.05268 9.36739 2 9.5 2H14.5C14.6326 2 14.7598 2.05268 14.8536 2.14645C14.9473 2.24021 15 2.36739 15 2.5V3.75C15 3.8163 14.9737 3.87989 14.9268 3.92678C14.8799 3.97366 14.8163 4 14.75 4H9.25C9.1837 4 9.12011 3.97366 9.07322 3.92678C9.02634 3.87989 9 3.8163 9 3.75Z" fill="red" />
                        </svg>
                    </div>
                </Tooltip>

            </div>
        </div>)
}
export default AdminButtonMenu