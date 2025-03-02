import { SettingFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import './style.scss'
import { useState } from "react";
import { useCompleteUserAdvertMutation, useDeleteAdvertMutation } from "../../../redux/api/advertAuthApi";
import { toast } from "react-toastify";
import { confirm } from "../../../utilities/confirm_modal";

interface AdvertButtonMenuProps {
    className?: string
    id: number,
    isDelete?: boolean
    isEdit?: boolean
    isComplete?: boolean
}

const AdvertButtonMenu: React.FC<AdvertButtonMenuProps> = ({ className, id, isEdit = false, isComplete = false, isDelete = false }) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>()
    const [completeAdvert] = useCompleteUserAdvertMutation()
    const [deleteAdvert] = useDeleteAdvertMutation()


    const onComplete = async () => {
        confirm({
            title: <span className="font-unbounded font-medium text-adaptive-1_7_text text-[red]">Завершення оголошення</span>,
            content: <div className="font-montserrat text-adaptive-1_7_text my-[2vh] mr-[1.5vw]">Ви впевненні що хочете завершити це оголошення?</div>,
            onOk: async () => {
                const result = await completeAdvert(id);
                if (!result.error) {
                    toast(`Оголошення успішно завершене`, {
                        type: "success"
                    })
                }
            },
            okText: 'Завершити'
        })
    }

    const onDelete = async () => {
        confirm({
            title: <span className="font-unbounded font-medium text-adaptive-1_7_text text-[red]">Видалення оголошення</span>,
            content: <div className="font-montserrat text-adaptive-1_7_text my-[2vh] mr-[1.5vw]">Ви впевненні що хочете видалити це оголошення?</div>,
            onOk: async () => {
                const result = await deleteAdvert(id);
                if (!result.error) {
                    toast(`Оголошення успішно видалене`, {
                        type: "success"
                    })
                }
            },
            okText: 'Видалити'
        })
    }

    return (
        <div className={`${className}`}>
            <div className={` button-menu `} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} >
                <SettingFilled className="transition-all duration-300 ease-in-out hover:scale-[1.1] w-full h-full text-5xl cursor-pointer z-50" style={{ backgroundColor: "transparent", color: "grey" }} />
                <div className={`flex flex-col  gap-[2vh] button-menu-container z-0 ${open !== undefined ? !open ? 'close' : 'open' : ''}`}>
                    {isEdit &&
                        <svg className="transition-all duration-300 ease-in-out hover:scale-[1.2] h-full w-auto cursor-pointer " onClick={() => { navigate(`user/advert/edit/${id}`) }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C20.8027 6.94749 20.8762 6.8376 20.9264 6.71663C20.9766 6.59565 21.0024 6.46597 21.0024 6.335C21.0024 6.20403 20.9766 6.07435 20.9264 5.95338C20.8762 5.83241 20.8027 5.72252 20.71 5.63L18.37 3.29C18.2775 3.1973 18.1676 3.12375 18.0466 3.07357C17.9257 3.02339 17.796 2.99756 17.665 2.99756C17.534 2.99756 17.4043 3.02339 17.2834 3.07357C17.1624 3.12375 17.0525 3.1973 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="green" />
                        </svg>
                    }
                    {isComplete &&
                        <svg className="transition-all duration-300 ease-in-out hover:scale-[1.2] h-full w-auto cursor-pointer" onClick={onComplete} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M13 24C9.74004 24 6.81004 22.01 5.60004 18.98L2.57004 11.37C2.49982 11.1934 2.48137 11.0005 2.51686 10.8138C2.55234 10.627 2.6403 10.4543 2.77042 10.3158C2.90054 10.1773 3.06744 10.0787 3.25156 10.0316C3.43568 9.98457 3.62941 9.99094 3.81004 10.05L4.60004 10.31C5.16004 10.49 5.62004 10.92 5.84004 11.47L7.25004 15H8.00004V3.25C8.00004 2.91848 8.13174 2.60054 8.36616 2.36612C8.60058 2.1317 8.91852 2 9.25004 2C9.58156 2 9.89951 2.1317 10.1339 2.36612C10.3683 2.60054 10.5 2.91848 10.5 3.25V12H11.5V1.25C11.5 0.918479 11.6317 0.600537 11.8662 0.366117C12.1006 0.131696 12.4185 0 12.75 0C13.0816 0 13.3995 0.131696 13.6339 0.366117C13.8683 0.600537 14 0.918479 14 1.25V12H15V2.75C15 2.41848 15.1317 2.10054 15.3662 1.86612C15.6006 1.6317 15.9185 1.5 16.25 1.5C16.5816 1.5 16.8995 1.6317 17.1339 1.86612C17.3683 2.10054 17.5 2.41848 17.5 2.75V12H18.5V5.75C18.5 5.41848 18.6317 5.10054 18.8662 4.86612C19.1006 4.6317 19.4185 4.5 19.75 4.5C20.0816 4.5 20.3995 4.6317 20.6339 4.86612C20.8683 5.10054 21 5.41848 21 5.75V16C21 20.42 17.42 24 13 24Z" fill="blue" />
                        </svg>
                    }
                    {isDelete &&
                        <svg className="transition-all duration-300 ease-in-out hover:scale-[1.2] h-full w-auto cursor-pointer" onClick={onDelete} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M19.452 7.5H4.547C4.47737 7.49972 4.40846 7.51398 4.34466 7.54187C4.28087 7.56977 4.2236 7.61068 4.17653 7.66198C4.12946 7.71329 4.09363 7.77386 4.07132 7.83981C4.04902 7.90577 4.04073 7.97566 4.047 8.045L5.334 22.181C5.37917 22.6781 5.60858 23.1403 5.97717 23.4769C6.34575 23.8135 6.82687 24.0001 7.326 24H16.673C17.1721 24.0001 17.6532 23.8135 18.0218 23.4769C18.3904 23.1403 18.6198 22.6781 18.665 22.181L19.95 8.045C19.9562 7.97586 19.9479 7.90619 19.9257 7.84042C19.9035 7.77465 19.8678 7.71423 19.821 7.663C19.7742 7.61169 19.7172 7.5707 19.6537 7.54264C19.5901 7.51457 19.5215 7.50005 19.452 7.5ZM10.252 20.5C10.252 20.6989 10.173 20.8897 10.0323 21.0303C9.89168 21.171 9.70091 21.25 9.502 21.25C9.30309 21.25 9.11232 21.171 8.97167 21.0303C8.83102 20.8897 8.752 20.6989 8.752 20.5V11.5C8.752 11.3011 8.83102 11.1103 8.97167 10.9697C9.11232 10.829 9.30309 10.75 9.502 10.75C9.70091 10.75 9.89168 10.829 10.0323 10.9697C10.173 11.1103 10.252 11.3011 10.252 11.5V20.5ZM15.252 20.5C15.252 20.6989 15.173 20.8897 15.0323 21.0303C14.8917 21.171 14.7009 21.25 14.502 21.25C14.3031 21.25 14.1123 21.171 13.9717 21.0303C13.831 20.8897 13.752 20.6989 13.752 20.5V11.5C13.752 11.3011 13.831 11.1103 13.9717 10.9697C14.1123 10.829 14.3031 10.75 14.502 10.75C14.7009 10.75 14.8917 10.829 15.0323 10.9697C15.173 11.1103 15.252 11.3011 15.252 11.5V20.5ZM22 4H17.25C17.1837 4 17.1201 3.97366 17.0732 3.92678C17.0263 3.87989 17 3.8163 17 3.75V2.5C17 1.83696 16.7366 1.20107 16.2678 0.732233C15.7989 0.263392 15.163 0 14.5 0H9.5C8.83696 0 8.20107 0.263392 7.73223 0.732233C7.26339 1.20107 7 1.83696 7 2.5V3.75C7 3.8163 6.97366 3.87989 6.92678 3.92678C6.87989 3.97366 6.8163 4 6.75 4H2C1.73478 4 1.48043 4.10536 1.29289 4.29289C1.10536 4.48043 1 4.73478 1 5C1 5.26522 1.10536 5.51957 1.29289 5.70711C1.48043 5.89464 1.73478 6 2 6H22C22.2652 6 22.5196 5.89464 22.7071 5.70711C22.8946 5.51957 23 5.26522 23 5C23 4.73478 22.8946 4.48043 22.7071 4.29289C22.5196 4.10536 22.2652 4 22 4ZM9 3.75V2.5C9 2.36739 9.05268 2.24021 9.14645 2.14645C9.24021 2.05268 9.36739 2 9.5 2H14.5C14.6326 2 14.7598 2.05268 14.8536 2.14645C14.9473 2.24021 15 2.36739 15 2.5V3.75C15 3.8163 14.9737 3.87989 14.9268 3.92678C14.8799 3.97366 14.8163 4 14.75 4H9.25C9.1837 4 9.12011 3.97366 9.07322 3.92678C9.02634 3.87989 9 3.8163 9 3.75Z" fill="red" />
                        </svg>
                    }
                </div>
            </div>
        </div>)
}
export default AdvertButtonMenu