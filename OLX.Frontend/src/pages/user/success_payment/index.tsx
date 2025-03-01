import { useNavigate } from "react-router-dom";
import { BackButton } from "../../../components/buttons/back_button"
import PrimaryButton from "../../../components/buttons/primary_button"


const SuccessPayment = () => {
    const navigate = useNavigate();
    
    return (
        <div className="w-[100%] mx-[8vw] flex flex-col">
            <BackButton className="text-adaptive-1_9_text my-[7.5vh] ml-[1vw] font-medium self-start" title="Назад" />
            <div className="w-[100%] h-[500px] flex-col justify-start items-center inline-flex">
                <h1 className="font-unbounded text-4xl font-medium leadign-[50.40px] mb-[1vh]">Ура!</h1>
                <span className="text-2xl font-normal font-nontserrat mb-[6vh]">Оплата пройшла успішно :&#41;</span>
                <span className="text-base font-normal font-montserrat">Після відправки товару вам буде надіслано</span>
                <span className="text-base font-normal font-montserrat">трекер для відстеження</span>
                <PrimaryButton
                            title="На головну"
                            isLoading={false}
                            className="w-[17vw] h-[4.6vh] mt-[7.4vh]"
                            fontColor="white"
                            fontSize="clamp(14px,1.9vh,36px)"
                            bgColor="#9B7A5B"
                            brColor="#9B7A5B"
                            onButtonClick={() => navigate('/')}
                        />
            </div>
        </div>
    )
}

export default SuccessPayment