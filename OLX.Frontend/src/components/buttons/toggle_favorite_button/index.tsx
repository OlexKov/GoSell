import React, { useEffect, useState } from "react"
import { ToggleFavoriteButtonProps } from "./props"
import { useAddToFavoritesMutation, useGetFavoritesQuery, useRemoveFromFavoritesMutation } from "../../../redux/api/accountAuthApi";
import { useSelector } from "react-redux";
import { getUser } from "../../../redux/slices/userSlice";
import { APP_ENV } from "../../../constants/env";

const ToggleFavoriteButton: React.FC<ToggleFavoriteButtonProps> = ({ className, advertId, isAdvertPage = false }) => {
    const [addToFavorites] = useAddToFavoritesMutation();
    const [removeFromFavorites] = useRemoveFromFavoritesMutation();
    const { data: favorites } = useGetFavoritesQuery();
    const [isFavorite, setIsFavorite] = useState(false);
    const user = useSelector(getUser);

    useEffect(() => {
        if (user != null) {
            setIsFavorite(favorites?.length && favorites?.some(fav => fav.id === advertId) || false);
        } else {
            const localFavorites = JSON.parse(localStorage.getItem(APP_ENV.FAVORITES_KEY) || "[]");
            setIsFavorite(localFavorites.includes(advertId));
        }
    }, [favorites, advertId, user]);

    const toggleButton = async () => {
        if (!user) {
            const localFavorites = JSON.parse(localStorage.getItem(APP_ENV.FAVORITES_KEY) || "[]");
            if (isFavorite) {
                const updatedFavorites = localFavorites.filter((id: number) => id !== advertId);
                localStorage.setItem(APP_ENV.FAVORITES_KEY, JSON.stringify(updatedFavorites));
                window.dispatchEvent(new Event('storage'));
            } else {
                localFavorites.push(advertId);
                localStorage.setItem(APP_ENV.FAVORITES_KEY, JSON.stringify(localFavorites));
            }

            setIsFavorite(!isFavorite);
            return;
        }

        if (isFavorite) {
            await removeFromFavorites(advertId);
        } else {
            await addToFavorites(advertId);
        }
    }
    return (
        <div className={`${className} cursor-pointer transition-all duration-300 ease-in-out hover:bg-white/60 rounded-md bg-white/30`}>
            <div className="transition-all duration-300 ease-in-out hover:scale-[1.1]">
                {isAdvertPage
                    ? <svg onClick={toggleButton} className={`w-full h-full`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        {isFavorite
                            ? <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="chocolate" />
                            : <path d="M16.5 3C14.76 3 13.09 3.81 12 5.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5C2 12.28 5.4 15.36 10.55 20.04L12 21.35L13.45 20.03C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3ZM12.1 18.55L12 18.65L11.9 18.55C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5C9.04 5 10.54 5.99 11.07 7.36H12.94C13.46 5.99 14.96 5 16.5 5C18.5 5 20 6.5 20 8.5C20 11.39 16.86 14.24 12.1 18.55Z" fill="chocolate" />}
                    </svg>

                    : <svg onClick={toggleButton} className={`w-full h-full `} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        {isFavorite
                            ? <path d="M17 3H7C5.9 3 5.01 3.9 5.01 5L5 21L12 18L19 21V5C19 3.9 18.1 3 17 3Z" fill="chocolate" />
                            : <path d="M17 3H7C5.9 3 5 3.9 5 5V21L12 18L19 21V5C19 3.9 18.1 3 17 3ZM17 18L12 15.82L7 18V5H17V18Z" fill="chocolate" />}
                    </svg>
                }
            </div>

        </div>
    )
}

export default ToggleFavoriteButton