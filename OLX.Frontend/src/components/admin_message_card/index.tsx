import { APP_ENV } from "../../constants/env"
import { Images } from "../../constants/images"
import { IAdminMesssage } from "../../models/adminMesssage"
import { getFormatDateTime } from "../../utilities/common_funct"

interface AdminMessageCardProps {
    adminMessage: IAdminMesssage
    divider?: boolean
    className?: string
    dividerClassName?: string
    onDelete?: (id: number) => void
    onClick?: (id: number) => void
}
const AdminMessageCard: React.FC<AdminMessageCardProps> = ({ adminMessage, divider, className, dividerClassName, onDelete, onClick }) => {
    const deleteClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.stopPropagation()
        onDelete && onDelete(adminMessage.id)
    }
    return (
        <div className={`${onClick ? 'cursor-pointer transition-all duration-500 ease-in-out hover:scale-[1.005]' : ''}`} onClick={() => onClick && onClick(adminMessage.id)}>
            <div className={`min-h-[70px]  ${className}`}>
                <div className={`flex gap-[1vw] h-full  items-center rounded-md ${adminMessage.readed ? 'bg-white' : 'bg-slate-100'}`}>
                    <div className=" h-full aspect-square p-[0.5vh] bg-white rounded-md border border-[#9B7A5B]">
                        <img className="h-full aspect-square" src={adminMessage.messageLogo ? APP_ENV.IMAGES_200_URL + adminMessage.messageLogo : Images.logo} />
                    </div>

                    <div className="flex flex-col justify-between font-montserrat  overflow-hidden text-[black]">
                        <div >
                            <p className="text-adaptive-1_7_text text-nowrap  font-medium overflow-hidden text-ellipsis">{adminMessage.message.subject}</p>
                            <p className="text-adaptive-1_6-text text-nowrap overflow-hidden text-ellipsis">{adminMessage.message.content}</p>
                        </div>
                        <span className="text-adaptive-1_5-text text-nowrap ">{getFormatDateTime(new Date(adminMessage.created))}</span>
                    </div>
                    {onDelete &&
                        <svg onClick={deleteClick} className="h-[2vh] min-h-[14px] aspect-square cursor-pointer mr-[1vw] ml-auto flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
                            <path d="M15 7L14.16 15.398C14.033 16.671 13.97 17.307 13.68 17.788C13.4257 18.2114 13.0516 18.55 12.605 18.761C12.098 19 11.46 19 10.18 19H7.82C6.541 19 5.902 19 5.395 18.76C4.94805 18.5491 4.57361 18.2106 4.319 17.787C4.031 17.307 3.967 16.671 3.839 15.398L3 7M10.5 13.5V8.5M7.5 13.5V8.5M1.5 4.5H6.115M6.115 4.5L6.501 1.828C6.613 1.342 7.017 1 7.481 1H10.519C10.983 1 11.386 1.342 11.499 1.828L11.885 4.5M6.115 4.5H11.885M11.885 4.5H16.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>}
                </div>

            </div>
            {divider && <hr className={dividerClassName} />}
        </div>
    )
}

export default AdminMessageCard