import { Cascader } from "antd"
import { useMemo, useState } from "react"
import { buildCascaderTree, getAllParentsIds } from "../../utilities/common_funct"
import { CategoryTreeProps } from "./props"
import './style.scss'
import { ExpandMore } from "@mui/icons-material";

const CategoryTree: React.FC<CategoryTreeProps> = ({ categoryId, categories, onSelect, className ,popupClassName,displayRender, placeholder}) => {
    const [open, setOpen] = useState<boolean>(false)
    const categoryTree = useMemo(() => buildCascaderTree(categories || []), [categories])
    const allParentsIds = useMemo(() => getAllParentsIds(categories || [], categoryId).sort((a: number, b: number) => a - b), [categories, categoryId])
    const onCategoryChange = (ids: number[]) => {
        onSelect && onSelect(ids[ids.length - 1])
    }

    return (
        <Cascader
            onDropdownVisibleChange={setOpen }
            allowClear={false}
            options={categoryTree}
            popupClassName={popupClassName}
            value={allParentsIds}
            onChange={onCategoryChange}
            className={className}
            changeOnSelect
            placeholder={placeholder}
            expandTrigger="hover"
            variant="borderless"
            displayRender={displayRender}
            suffixIcon={
                <ExpandMore
                    style={{
                        fontSize: 25,
                        transform: open ? "rotate(-90deg)" : "rotate(0deg)",
                        transition: "transform 0.3s",
                        color: 'black'
                    }}
                />}
        />
    )
}

export default CategoryTree