import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FavoritesButton = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isFavoritesPage, setIsFavoritesPage] = useState(false);

    useEffect(() => {
        setIsFavoritesPage(location.pathname === '/user/favorites');
    }, [location.pathname]);

    return (
        <div  onClick={() => navigate('/user/favorites')} className="text-amber-950 cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.1]">
            {isFavoritesPage ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                    <path d="M17.0007 30.2458L14.9465 28.3758C7.65065 21.76 2.83398 17.3967 2.83398 12.0417C2.83398 7.67833 6.26232 4.25 10.6257 4.25C13.0907 4.25 15.4565 5.3975 17.0007 7.21083C18.5448 5.3975 20.9107 4.25 23.3757 4.25C27.739 4.25 31.1673 7.67833 31.1673 12.0417C31.1673 17.3967 26.3507 21.76 19.0548 28.39L17.0007 30.2458Z" fill="#3A211C" />
                </svg>
            ) : (
                <svg  xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                    <path d="M23.3757 4.25C20.9107 4.25 18.5448 5.3975 17.0007 7.21083C15.4565 5.3975 13.0907 4.25 10.6257 4.25C6.26232 4.25 2.83398 7.67833 2.83398 12.0417C2.83398 17.3967 7.65065 21.76 14.9465 28.39L17.0007 30.2458L19.0548 28.3758C26.3507 21.76 31.1673 17.3967 31.1673 12.0417C31.1673 7.67833 27.739 4.25 23.3757 4.25ZM17.1423 26.2792L17.0007 26.4208L16.859 26.2792C10.1157 20.1733 5.66732 16.1358 5.66732 12.0417C5.66732 9.20833 7.79232 7.08333 10.6257 7.08333C12.8073 7.08333 14.9323 8.48583 15.6832 10.4267H18.3323C19.069 8.48583 21.194 7.08333 23.3757 7.08333C26.209 7.08333 28.334 9.20833 28.334 12.0417C28.334 16.1358 23.8857 20.1733 17.1423 26.2792Z" fill="#3A211C" />
                </svg>
            )}
        </div>
    );
};

export default FavoritesButton;
