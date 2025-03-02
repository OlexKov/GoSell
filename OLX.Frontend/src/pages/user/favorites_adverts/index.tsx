import { useNavigate } from "react-router-dom";
import { useGetFavoritesQuery } from "../../../redux/api/accountAuthApi";
import PrimaryButton from "../../../components/buttons/primary_button";
import { BackButton } from "../../../components/buttons/back_button";
import AdvertsSection from "../../../components/adverts_section";
import { APP_ENV } from "../../../constants/env";
import { useGetAllAdvertsQuery } from "../../../redux/api/advertApi";
import { IAdvert } from "../../../models/advert";
import { useSelector } from "react-redux";
import { getUser } from "../../../redux/slices/userSlice";
import { useEffect, useState } from "react";
import Collapsed from "../../../components/advert_collapse";
import AdvertSort from "../../../components/advert_sort";
import { AdvertSortData } from "../../../components/advert_sort/models";

const FavoritesAdverts = () => {
    const navigate = useNavigate();
    const user = useSelector(getUser);
    const { data: favorites, isLoading: isFavoriteLoading } = useGetFavoritesQuery();
    const { data: allAdverts } = useGetAllAdvertsQuery();
    const [userFavorites, setUserFavorites] = useState<IAdvert[]>([]);
    const [storageUpdated, setStorageUpdated] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            setStorageUpdated(prev => !prev);
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    useEffect(() => {
        if (user) {
            setUserFavorites(favorites || []);
        } else if (allAdverts) {
            const localFavoritesIds: number[] = JSON.parse(localStorage.getItem(APP_ENV.FAVORITES_KEY) || "[]");
            const localFavorites = allAdverts.filter((ad: IAdvert) => localFavoritesIds.includes(ad.id));
            setUserFavorites(localFavorites || []);
        }
        onSort({ sort: 'date', desc: true });
    }, [favorites, user, allAdverts, storageUpdated]);

    const onSort = (data: AdvertSortData) => {
        console.log(data);
        setUserFavorites((prevFavorites) => {
            const sortedFavorites = [...prevFavorites].sort((a, b) => {
                if (!data.sort) return 0;

                if (data.sort === "price") {
                    return data.desc ? b.price - a.price : a.price - b.price;
                }

                if (data.sort === "date") {
                    return data.desc
                        ? new Date(b.date).getTime() - new Date(a.date).getTime()
                        : new Date(a.date).getTime() - new Date(b.date).getTime();
                }

                return 0;
            });

            return sortedFavorites;
        });
    };

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
    );
};

export default FavoritesAdverts;
