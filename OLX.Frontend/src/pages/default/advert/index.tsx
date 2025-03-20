import { useNavigate, useParams } from "react-router-dom";
import { useGetAdvertByIdQuery } from "../../../redux/api/advertApi";
import CategoryNavigation from "../../../components/category_navigation";
import { Divider } from "antd";
import AdvertViewer from "../../../components/advert_viewer";
import SimilarAdverts from "../../../components/similar_adverts";
import { useEffect } from "react";
import ViewedAdverts from "../../../components/viewed_adverts";
import { APP_ENV } from "../../../constants/env";


const AdvertPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const { data: advert, isLoading, isError } = useGetAdvertByIdQuery(Number(id))

    useEffect(() => {
        isError && navigate(-1)
    }, [isError])

    useEffect(() => {
        if (advert) {
            const viewedAdverts: number[] = sessionStorage.getItem(APP_ENV.VIEWED_KEY)
                ? JSON.parse(sessionStorage.getItem(APP_ENV.VIEWED_KEY) as string) : [];
            if (!viewedAdverts.some(x => x === advert.id)) {
                viewedAdverts.push(advert.id)
                sessionStorage.setItem(APP_ENV.VIEWED_KEY, JSON.stringify(viewedAdverts));
            }
        }
    }, [advert]);

    return (
        <div className="w-[100%] gap-[8vh] flex flex-col my-[7.5vh] ">
            <div className="mx-[8vw] gap-[8vh] items-start flex  flex-col">
                <CategoryNavigation categoryId={advert?.categoryId} />
                {!isLoading &&
                    <AdvertViewer advert={advert} />
                }
            </div>
            <Divider className="p-0 m-0" />
            <div className=" mx-[7vw] gap-[8vh] items-start flex flex-col">
                <SimilarAdverts advert={advert} />
                <ViewedAdverts advert={advert} />
            </div>
        </div>
    )
};

export default AdvertPage;