import { Collapse, Form, InputNumber, Select, Spin, TreeSelect } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGetAllFilterQuery } from "../../redux/api/filterApi";
import { useGetAllCategoriesQuery } from "../../redux/api/categoryApi";
import { buildTree, clamp, getAllParentFilterIds } from "../../utilities/common_funct";
import { AdminAdvertFiltersProps } from "./props";
import { FilterData } from "./models";
import { ClearOutlined } from '@ant-design/icons'
import { useSearchParams } from "react-router-dom";
import { IFilter } from "../../models/filter";
import { Tooltip } from "antd";


const AdminAdvertCollapsedFilters: React.FC<AdminAdvertFiltersProps> = ({ onFiltersChange, columns = 4 }) => {
    const [searchParams] = useSearchParams('');
    const [form] = Form.useForm();
    const { data: filters, isLoading } = useGetAllFilterQuery();
    const { data: categories, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery()
    const categoryId = useRef<number | undefined>();
    const priceFrom = useRef<number | null>();
    const priceTo = useRef<number | null>();
    const [categoryFiltersData, setCategoryFiltersData] = useState<FilterData>({
        filters: [],
        filterWidth: 0,
        isFilterClear: true,
        filtersValues: []
    });

    const onCategoryChange = (category: number | undefined) => {
        categoryId.current = category
        updateCategoryFilters(category)
        form.resetFields()
        onFiltersChange({ filters: [], categoryId: category || 0, priceFrom: priceFrom.current, priceTo: priceTo.current })
    }

    const updateCategoryFilters = (categoryId: number | undefined, filterValues?: number[][]) => {
        const categoryFilters = getAllParentFilterIds(categories || [], categoryId)
        const curentFilters = filters?.filter(x => categoryFilters.includes(x.id)) || []
        let filterWidth = curentFilters.length < columns
            ? clamp(100 / curentFilters.length - 0.8, 10, 25)
            : clamp(100 / columns - 0.8, 10, 25)
        setCategoryFiltersData({ filters: curentFilters, filterWidth: filterWidth, isFilterClear: !categoryId, filtersValues: filterValues || [] })
    }

    const confirm = (data: any) => {
        const result = Object.values(data).filter(x => x !== undefined && ((x as []).length > 0)) as number[][];
        categoryFiltersData.filtersValues = result
        onFiltersChange({ filters: result, categoryId: categoryId.current || 0, priceFrom: priceFrom.current, priceTo: priceTo.current })
    }

    const getCategoryTree = useMemo(() => buildTree(categories || []), [categories])

    useEffect(() => {
        const categoryParamsId = searchParams.has("categoryId") ? Number(searchParams.get("categoryId")) : 0
        if (categoryParamsId !== 0) {
            categoryId.current = categoryParamsId
            const filterValues = searchParams.has("filters") ? (JSON.parse(searchParams.get("filters") || '') as number[][]) : []
            updateCategoryFilters(categoryParamsId, filterValues)
        }
        priceFrom.current = Number(searchParams.get("priceFrom"))
        priceTo.current = Number(searchParams.get("priceTo"))
    }, [])

    const initFilter = (filter: IFilter): number[] => {
        if (categoryFiltersData.filtersValues.length > 0) {
            const filterValues = filter.values.map(x => x.id);
            return categoryFiltersData.filtersValues.flat().filter(item => filterValues.some(x => x == item));
        }
        return [];
    }

    const onPriceChange = (priceFilter: number | null, isFrom: boolean) => {
        isFrom ? priceFrom.current = priceFilter : priceTo.current = priceFilter;
        onFiltersChange({ filters: categoryFiltersData.filtersValues, categoryId: categoryId.current || 0, priceFrom: priceFrom.current, priceTo: priceTo.current })
    }

    const clearFilters = () => {
        priceFrom.current = 0
        priceTo.current = 0
        onCategoryChange(undefined)
    }

    const categoryFilters = useMemo(() => categoryFiltersData.filters.map(filter =>
        <Form.Item
            noStyle
            key={filter.id}
            name={filter.id}
            initialValue={initFilter(filter)}
        >
            <Select
                style={{ width: `${categoryFiltersData.filterWidth}%` }}
                allowClear
                mode='tags'
                maxTagCount='responsive'
                options={filter.values.map(value => ({ value: value.id.toString(), label: value.value }))}
                placeholder={filter.name}
                onChange={() => form.submit()}
            />
        </Form.Item>
    ), [categoryFiltersData.filters])

    return (
        <Collapse
            size='small'
            className="text-start"
            items={[
                {
                    key: '1',
                    label: 'Фільтри',
                    extra:
                        <Tooltip title="Очистити" color="gray">
                            <ClearOutlined hidden={categoryFiltersData.isFilterClear} className="text-red-700" onClick={(event) => {
                                clearFilters()
                                event.stopPropagation();
                            }} />
                        </Tooltip>,
                    children:
                        <Form
                            form={form}
                            onFinish={confirm}
                        >
                            {(isLoading || isCategoriesLoading)
                                ? <Spin size="small" />
                                :
                                <div className="flex flex-col items-start" >
                                    <div className="flex  gap-9 w-full">
                                        <div className="flex flex-col items-start w-[30%]" >
                                            <span>Категорія</span>
                                            <TreeSelect
                                                value={categoryId.current}
                                                allowClear
                                                showSearch
                                                loading={isCategoriesLoading}
                                                className="mb-3"
                                                style={{ width: '100%', minWidth: 250 }}
                                                dropdownStyle={{ maxWidth: 400, overflow: 'auto' }}
                                                treeData={getCategoryTree}
                                                placeholder="Категорія"
                                                onChange={onCategoryChange}
                                            />
                                        </div>
                                        <div className="flex flex-col items-start w-[30%]">
                                            <span>Ціна:</span>
                                            <div className="flex items-start gap-3">
                                                <InputNumber
                                                    addonBefore='Від'
                                                    value={priceFrom.current}
                                                    min={0}
                                                    placeholder="Від"
                                                    onChange={(value) => { onPriceChange(value, true) }}
                                                />
                                                <InputNumber
                                                    addonBefore='До'
                                                    value={priceTo.current}
                                                    min={0}
                                                    placeholder="До"
                                                    onChange={(value) => { onPriceChange(value, false) }}
                                                />
                                            </div>
                                        </div>

                                    </div>


                                    {categoryFiltersData.filters.length > 0 &&
                                        <>
                                            <span>Фільтри</span>
                                            <div className=" flex flex-wrap gap-[.5vw] w-full border rounded-xl p-3">
                                                {...categoryFilters}
                                            </div>
                                        </>
                                    }
                                </div>}
                        </Form>,
                }]}
        />)
};

export default AdminAdvertCollapsedFilters;