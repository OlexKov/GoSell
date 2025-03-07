import { useMemo } from "react"
import ScrolledContainer from "../scrolled_container"
import AdvertCard from "../advert_card"
import { IAdvert } from "../../models/advert"

const LockedAdverts: React.FC<{adverts:IAdvert[]}> = ({adverts}) => {
     const advertsCards = useMemo(() => adverts?.map(advert => (
        <AdvertCard
            key={advert.id}
            advert={advert}
            isCompleted = {true}
            className="min-w-[14vw] max-w-[14vw]"
        />
    )) || [], [adverts])

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
                    <p className="font-semibold font-montserrat text-adaptive-card-price-text mb-[16px]">Заблоковані оголошення відображаються тут після блокування адміном</p>
                    <p className="font-normal font-montserrat text-adaptive-card-price-text mb-[32px]">Ці оголошення можна завантажити знову після додтримання вимог адміністрації</p>
                </div>
            }
        </>
    )
}

export default LockedAdverts