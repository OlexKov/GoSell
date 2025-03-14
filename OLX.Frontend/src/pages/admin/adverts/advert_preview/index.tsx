import { Preview } from "@mui/icons-material"
import { PageHeader } from "../../../../components/page_header"
import { BackButton } from "../../../../components/buttons/back_button"
import { useParams } from "react-router-dom";
import { useGetAdvertByIdQuery } from "../../../../redux/api/advertApi";
import AdvertViewer from "../../../../components/advert_viewer";

const AdminAdvertPreview: React.FC = () => {
    const { id } = useParams();
    const { data: advert, isLoading } = useGetAdvertByIdQuery(Number(id))
    return (
        <div className="m-6 flex-grow  overflow-hidden">
            <PageHeader
                title={`Oголошення  "${advert?.title}"`}
                icon={<Preview className="text-2xl" />}/>
            <BackButton className="my-5 text-adaptive-text" title="Назад" />
            {!isLoading &&
                <div className="m-16">
                    <AdvertViewer buttons={false} advert={advert}/>
                </div>
            }
        </div>
    )
}

export default AdminAdvertPreview