import { useNavigate } from "react-router-dom";
import AdminMessageCard from "../../../components/admin_message_card";
import { BackButton } from "../../../components/buttons/back_button"
import PrimaryButton from "../../../components/buttons/primary_button";
import { useGetUserMessagesQuery, useSetUserMessageReadedMutation, useSoftDeleteUserMessageMutation } from "../../../redux/api/adminMessageApi";
import { toast } from "react-toastify";
import { useMemo } from "react";
import { IAdminMesssage } from "../../../models/adminMesssage";

const AdminMessagesPage: React.FC = () => {
    const { data: userdMessages } = useGetUserMessagesQuery();
    const [deleteMessege] = useSoftDeleteUserMessageMutation();
    const [setReaded] = useSetUserMessageReadedMutation()
    const navigate = useNavigate()
    const onDelete = async (id: number) => {
        console.log(id)
        const result = await deleteMessege(id)
        if (!result.error) {
            toast(`Повідомлення успішно видалено`, {
                type: "success"
            })
        }
    }
    const onClick = async (id: number) => {
        const result = await setReaded(id)
        if (!result.error) {
            
        }
    }

    const messeges = useMemo(() => {
        return userdMessages && userdMessages.length > 0
            ? userdMessages.slice()
            .sort((a:IAdminMesssage, b:IAdminMesssage) =>{
                if(a.readed !== b.readed){
                  return  Number(a.readed) - Number(b.readed)
                }
                else return b.created.localeCompare(a.created)
            })
            .map((x, index) =>
                <AdminMessageCard
                    key={index}
                    adminMessage={x}
                    divider={index !== userdMessages.length - 1}
                    className="h-[9vh]"
                    dividerClassName="my-[2vh]"
                    onDelete={onDelete}
                    onClick={onClick} />)
            : []
    }, [userdMessages])

    return (<>
        <div className="mx-auto mb-[8vh] w-[84vw]">
            <BackButton title="Назад" className=" my-[7vh] ml-[1vw] text-adaptive-1_9_text font-medium self-start" />
            <h2 className='text-[#3A211C] font-unbounded my-[6vh] text-adaptive-3_5-text font-normal '>Усі сповіщення</h2>
            {messeges.length > 0
                ? [...messeges]
                : <div className="w-[100%] py-[10vh] px-[8vw] h-[400px] flex-col justify-start items-center inline-flex">
                    <p className="font-semibold font-montserrat text-adaptive-card-price-text mb-[16px]">Сповіщення поки немає</p>
                    <p className="font-normal font-montserrat text-adaptive-card-price-text mb-[32px]">Всі ваші сповіщення зберігатимуться тут</p>
                    <PrimaryButton onButtonClick={() => { navigate(`/`) }} className="w-[16.4vw] h-[4.8vh]" title="На головну" brColor="#9B7A5B" bgColor="#9B7A5B" fontColor="white" fontSize="clamp(14px,1.9vh,36px)" isLoading={false} />
                </div>}

        </div>
    </>)
}

export default AdminMessagesPage