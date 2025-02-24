import { Breadcrumb } from "antd"
import { useGetAllCategoriesQuery } from "../../redux/api/categoryApi"
import { BackButton } from "../buttons/back_button"
import { Link } from "react-router-dom"
import { useMemo } from "react"
import { getAllParents } from "../../utilities/common_funct"
import { CategoryNavigationProps } from "./props"
import './style.scss'

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({ categoryId, backRoute }) => {
    const { data: categories, isLoading } = useGetAllCategoriesQuery()
       
    const items = useMemo(() => {
        if (categories) {
            const tree = categoryId ? getAllParents(categories || [], categoryId).reverse() : []
            const newItems = tree.map(x => ({
                title: <Link style={{ color: '#3A211C' }}
                    className=" breadcrumb-link"
                    to={`/adverts?categoryId=${x.id}`}>{x.name}</Link>,
            }))
            return [
                {
                    title: <Link style={{ color: '#3A211C' }} className=" breadcrumb-link" to="/">Головна</Link>
                },
                {
                    title: <Link style={{ color: '#3A211C' }} className=" breadcrumb-link" to="/adverts">Каталог</Link>
                },
                ...newItems]
        }
        else {
            return []
        }
    }, [categories, categoryId])

    return (
        <div className="flex gap-20 items-center">
            <BackButton
                title="Назад"
                className="text-adaptive-1_9_text text-black font-medium "
                path={backRoute} />
            {!isLoading && items.length > 1 &&
                <Breadcrumb
                    separator={<span className="text-adaptive-1_8_text font-montserrat text-['#3A211C']">/</span>}
                    items={items}
                />}
        </div>)
}

export default CategoryNavigation