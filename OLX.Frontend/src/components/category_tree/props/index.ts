import { ICategory } from "../../../models/category"

export interface CategoryTreeProps {
    categoryId?: number,
    categories?: ICategory[]
    onSelect?: (id: number) => void
    className?: string
    popupClassName?: string
    displayRender?: () => JSX.Element
    placeholder?: JSX.Element | string
}