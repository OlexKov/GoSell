import { useMemo } from "react"
import PrimaryButton from "../buttons/primary_button"
import ScrolledContainer from "../scrolled_container"
import AdvertCard from "../advert_card"
import { useNavigate } from "react-router-dom"
import { IAdvert } from "../../models/advert"

const ActiveAdverts: React.FC<{adverts:IAdvert[]}> = ({adverts = []}) => {
    const navigate = useNavigate();
    const advertsCards = useMemo(() =>adverts.length ? adverts?.map(advert => (
        <AdvertCard
            key={advert.id}
            advert={advert}
            className="min-w-[14vw] max-w-[14vw]"
        />
    )) : [], [adverts])

    return (
        <>
            {adverts && adverts.length > 0 ?
                <div className="my-[4vh] mx-[8vw]">
                    <ScrolledContainer>
                        <div className="flex gap-[1vw]">
                            {...advertsCards}
                        </div>
                    </ScrolledContainer>
                </div>
                :
                <div className="w-[100%] py-[6vh] px-[8vw] h-[300px] flex-col justify-start items-center inline-flex">
                    <p className="font-semibold font-montserrat text-adaptive-card-price-text mb-[16px]">Активні оголошення відображаються тут до закінчення їх терміну дії</p>
                    <p className="font-normal font-montserrat text-adaptive-card-price-text mb-[32px]">Ці оголошення доступні для перегляду всім і стають неактивними через 30 днів після їх активації</p>
                    <PrimaryButton onButtonClick={() => { navigate(`advert/create`) }} className="w-[16.4vw] h-[4.8vh]" title="Створити оголошення" brColor="#9B7A5B" bgColor="#9B7A5B" fontColor="white" fontSize="clamp(14px,1.9vh,36px)" isLoading={false} />
                </div>
            }
        </>
    )
}

export default ActiveAdverts