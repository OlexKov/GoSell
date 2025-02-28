import { useNavigate } from "react-router-dom";
import { useGetFavoritesQuery } from "../../../redux/api/accountAuthApi";
import PrimaryButton from "../../../components/buttons/primary_button";
import { BackButton } from "../../../components/buttons/back_button";
import AdvertsSection from "../../../components/adverts_section";

const FavoritesAdverts = () => {
    const { data: favorites, isLoading: isFavoriteLoading } = useGetFavoritesQuery();
    const navigate = useNavigate();
    return (
        <div className="w-[100%] my-[8vh] mx-[8vw]">
            <BackButton title="Назад" className="my-[7.5vh]  ml-[1vw] text-adaptive-1_9_text font-medium self-start" />
            <h2 className='text-[#3A211C] font-unbounded text-adaptive-3_5-text font-normal '>Обране</h2>
            {favorites && favorites.length > 0 ?
                <AdvertsSection
                    adverts={favorites}
                    columns={4}
                    className="gap-y-[2.5vh]  gap-x-[2.5vh] my-[6vh] "
                    isLoading={isFavoriteLoading} />
                :
                <div className="w-[100%] py-[10vh] px-[8vw] h-[400px] flex-col justify-start items-center inline-flex">
                    <p className="font-semibold font-montserrat text-adaptive-card-price-text mb-[16px]">Тут поки нічого немає</p>
                    <p className="font-normal font-montserrat text-adaptive-card-price-text mb-[32px]">Додайте декілька оголошень до обраного</p>
                    <PrimaryButton onButtonClick={() => { navigate(`/`) }} className="w-[16.4vw] h-[4.8vh]" title="На головну" brColor="#9B7A5B" bgColor="#9B7A5B" fontColor="white" fontSize="clamp(14px,1.9vh,36px)" isLoading={false} />
                </div>
            }
        </div>
    )
}

export default FavoritesAdverts