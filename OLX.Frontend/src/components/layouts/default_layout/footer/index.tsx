import { Divider } from "antd"
import { FacebookOutlined, InstagramOutlined } from '@ant-design/icons';
import { useAppDispatch } from "../../../../redux";
import { openMessageSendModal } from "../../../../redux/slices/modalSlice";
export const Footer: React.FC = () => {
    const dispach = useAppDispatch();
    const sendAdminMessage = ()=>{
        dispach(openMessageSendModal({
            title:"Лист для адміністрації",
            toAdmin:true
        }))
    }
    return (
        <div>
            <Divider className="p-0 m-0" />
            <div className='mx-[8vw] my-[6vh]  flex  justify-between flex-shrink-0' >
                <div className="flex flex-col h-[24vh] min-h-[100px] flex-wrap font-montserrat font-normal text-adaptive-footer-text gap-[1vh] text-[#9B7A5B]">
                    <span className="mr-[6vw]">Допомога</span>
                    <span className="mr-[6vw]">Зворотній зв'язок</span>
                    <span className="mr-[6vw]">Платні послуги</span>
                    <span className="mr-[6vw]">Умови користування</span>
                    <span className="mr-[6vw]">Політика конфіденційності</span>
                    <span className="mr-[6vw]">Правила безпеки</span>
                    <span className="mr-[6vw]">Популярні запити</span>
                    <span className="mr-[6vw]">Робота</span>
                    <span className="mr-[6vw]">Як продавати?</span>
                    <span className="mr-[6vw]">Як купувати</span>
                    <span className="mr-[6vw]">Доставка</span>
                    <span className="mr-[6vw] cursor-pointer" onClick={sendAdminMessage}>Лист адміністрації</span> 
                </div>
                <div className="flex gap-5 self-end">
                    <InstagramOutlined className="text-adaptive-footer-icons" />
                    <FacebookOutlined className="text-adaptive-footer-icons" />
                </div>
            </div>
        </div>)

}