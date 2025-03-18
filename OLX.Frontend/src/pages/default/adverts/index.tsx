import { useEffect, useMemo } from "react";
import { IAdvertSearchPageData } from "../../../models/advert";
import { useSearchParams } from "react-router-dom";
import CategoryNavigation from "../../../components/category_navigation";
import { useGetAllCategoriesQuery } from "../../../redux/api/categoryApi";
import { useGetAdvertPageQuery } from "../../../redux/api/advertApi";
import { getAdvertPageRequest, getAllParentFilterIds, getQueryString } from "../../../utilities/common_funct";
import Collapsed from "../../../components/advert_collapse";
import CategoryTree from "../../../components/category_tree";
import CategoryFilters from "../../../components/category_filters";
import AdvertsSection from "../../../components/adverts_section";
import PrimaryButton from "../../../components/buttons/primary_button";
import AdvertSort from "../../../components/advert_sort";
import { AdvertSortData } from "../../../components/advert_sort/models";
import LocationSelect from "../../../components/location_tree";
import { useAppDispatch } from "../../../redux";
import { scrollTop } from "../../../redux/slices/appSlice";

const advertPageSize: number = 6;
const updatedPageRequest = (searchParams: URLSearchParams): IAdvertSearchPageData => ({
    priceFrom: Number(searchParams.get("priceFrom")),
    priceTo: Number(searchParams.get("priceTo")),
    blocked: false,
    completed: false,
    size: Number(searchParams.get("size")) || advertPageSize,
    page: Number(searchParams.get("page")) || 1,
    sortKey: searchParams.get("sortKey") || 'date',
    isDescending: searchParams.has("isDescending") ? searchParams.get("isDescending") === "true" : true,
    categoryId: searchParams.has("categoryId") ? Number(searchParams.get("categoryId")) : undefined,
    filters: searchParams.has("filters") ? (JSON.parse(searchParams.get("filters") || '') as number[][]) : [],
    isContractPrice: searchParams.has("isContractPrice") ? searchParams.get("isContractPrice") === "true" : undefined,
    search: searchParams.get("search") || undefined,
    areaRef: searchParams.get("areaRef") || undefined,
    regionRef: searchParams.get("regionRef") || undefined,
    settlementRef: searchParams.get("settlementRef") || undefined
});

const AdvertsPage: React.FC = () => {
    const dispatch = useAppDispatch()
    const [searchParams, setSearchParams] = useSearchParams('');
    const { data: categories } = useGetAllCategoriesQuery();
    const pageRequest = useMemo(() => updatedPageRequest(searchParams), [searchParams]);
    const filters = useMemo(() => {
        return pageRequest.categoryId && categories
            ? getAllParentFilterIds(categories, pageRequest.categoryId)
            : []
    }, [categories, pageRequest.categoryId]);
    const getPageRequest = useMemo(() => getAdvertPageRequest(pageRequest, categories || []), [pageRequest, categories])
    const { data: adverts, isLoading: isAdvertsLoading, isUninitialized, refetch: advertRefetch } =
        useGetAdvertPageQuery(getPageRequest, { skip: !pageRequest || !categories || categories.length === 0 });

    useEffect(() => {
        if (!isUninitialized) {
            advertRefetch();
        }
    }, [searchParams]);

    function getAdCountText(count: number | undefined): string {
        if (!count) return '0 оголошень';

        if (count >= 1000) {
            const magnitude = Math.pow(10, Math.floor(Math.log10(count)));
            const rounded = Math.floor(count / magnitude) * magnitude;
            return `понад ${rounded.toLocaleString('uk-UA')} оголошень`;
        }

        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;

        if (lastDigit === 1 && lastTwoDigits !== 11) return `${count} оголошення`;
        if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
            return `${count} оголошення`;
        }

        return `${count} оголошень`;
    }

    const onCategoryChange = (id: number) => {
        if (id) {
            setSearchParams(getQueryString(({ ...pageRequest, categoryId: id, size: advertPageSize })))
        }
        dispatch(scrollTop())
    }



    const onSort = (data: AdvertSortData) => {
        setSearchParams(getQueryString({
            ...pageRequest,
            sortKey: data.sort,
            isDescending: data.desc
        }))
        dispatch(scrollTop())
    }

    return (
        <div className="w-[100%] gap-[8vh]  flex flex-col my-[7.5vh] ">
            <div className="mx-[8vw] gap-[8vh] h-full items-start flex  flex-col">
                <CategoryNavigation categoryId={pageRequest.categoryId} />

                <div className="w-[100%] h-full flex gap-[1vw] " >
                    <div className="w-[17%] mt-[16vh] flex flex-col gap-[3vh] advert-collapse">
                        <CategoryTree
                            popupClassName="font-montserrat mt-[2vh] text-adaptive-input-form-text"
                            placeholder={<span className="text-adaptive-card-price-text  text-[#3A211C] font-unbounded">Категорія</span>}
                            categories={categories}
                            onSelect={onCategoryChange}
                            categoryId={pageRequest.categoryId}
                            className="w-full custom-cascader"
                            displayRender={() => <span className="text-adaptive-card-price-text  text-[#3A211C] font-unbounded">Категорія</span>} />

                        <Collapsed
                            title="Фільтр"
                            className="text-adaptive-card-price-text text-[#3A211C] font-unbounded"
                            isOpen={filters && filters.length > 0}>
                            <CategoryFilters
                                className="mt-[2vh]"
                                categoryFiltersIds={filters}
                                onChange={(filters, priceFrom, priceTo, isContractPrice) => setSearchParams(getQueryString(({
                                    ...pageRequest,
                                    filters: filters,
                                    priceFrom: priceFrom,
                                    priceTo: priceTo,
                                    isContractPrice: isContractPrice,
                                    size: advertPageSize
                                })))}
                            />
                        </Collapsed>

                        <Collapsed
                            title="Сортувати"
                            className="text-adaptive-card-price-text  text-[#3A211C] font-unbounded">
                            <AdvertSort
                                className="mt-[2vh]"
                                onChange={onSort} />
                        </Collapsed>

                    </div>

                    <div className="flex-1 flex flex-col gap-[8vh]">
                        <div className="flex justify-end items-center gap-[1vw] w-[100%]">
                            <span className="font-unbounded text-[#3a211c]  font-normal text-adaptive-3_3-text mr-auto self-center">Ми знайшли {getAdCountText(adverts?.total)}</span>
                            <LocationSelect
                                onSelect={(value) => setSearchParams(getQueryString({
                                    ...pageRequest,
                                    areaRef: value.areaRef,
                                    regionRef: value.regionRef,
                                    settlementRef: value.settlementRef
                                }))} />
                            {/* <div className="h-8 justify-start items-center gap-6 inline-flex">
                                <div className="flex-col">
                                    <svg className="mb-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="11" viewBox="0 0 24 11" fill="none">
                                        <path d="M21.3333 0H2.66667C1.2 0 0 0.99 0 2.2V8.8C0 10.01 1.2 11 2.66667 11H21.3333C22.8 11 24 10.01 24 8.8V2.2C24 0.99 22.8 0 21.3333 0ZM21.3333 8.8H2.66667V2.2H21.3333V8.8Z" fill="#3A211C" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="11" viewBox="0 0 24 11" fill="none">
                                        <path d="M21.3333 0H2.66667C1.2 0 0 0.99 0 2.2V8.8C0 10.01 1.2 11 2.66667 11H21.3333C22.8 11 24 10.01 24 8.8V2.2C24 0.99 22.8 0 21.3333 0ZM21.3333 8.8H2.66667V2.2H21.3333V8.8Z" fill="#3A211C" />
                                    </svg>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                                    <path d="M11.1562 13.125H3.71875C3.19661 13.125 2.69585 12.9176 2.32663 12.5484C1.95742 12.1792 1.75 11.6784 1.75 11.1562V3.71875C1.75 3.19661 1.95742 2.69585 2.32663 2.32663C2.69585 1.95742 3.19661 1.75 3.71875 1.75H11.1562C11.6784 1.75 12.1792 1.95742 12.5484 2.32663C12.9176 2.69585 13.125 3.19661 13.125 3.71875V11.1562C13.125 11.6784 12.9176 12.1792 12.5484 12.5484C12.1792 12.9176 11.6784 13.125 11.1562 13.125ZM24.2812 13.125H16.8438C16.3216 13.125 15.8208 12.9176 15.4516 12.5484C15.0824 12.1792 14.875 11.6784 14.875 11.1562V3.71875C14.875 3.19661 15.0824 2.69585 15.4516 2.32663C15.8208 1.95742 16.3216 1.75 16.8438 1.75H24.2812C24.8034 1.75 25.3042 1.95742 25.6734 2.32663C26.0426 2.69585 26.25 3.19661 26.25 3.71875V11.1562C26.25 11.6784 26.0426 12.1792 25.6734 12.5484C25.3042 12.9176 24.8034 13.125 24.2812 13.125ZM11.1562 26.25H3.71875C3.19661 26.25 2.69585 26.0426 2.32663 25.6734C1.95742 25.3042 1.75 24.8034 1.75 24.2812V16.8438C1.75 16.3216 1.95742 15.8208 2.32663 15.4516C2.69585 15.0824 3.19661 14.875 3.71875 14.875H11.1562C11.6784 14.875 12.1792 15.0824 12.5484 15.4516C12.9176 15.8208 13.125 16.3216 13.125 16.8438V24.2812C13.125 24.8034 12.9176 25.3042 12.5484 25.6734C12.1792 26.0426 11.6784 26.25 11.1562 26.25ZM24.2812 26.25H16.8438C16.3216 26.25 15.8208 26.0426 15.4516 25.6734C15.0824 25.3042 14.875 24.8034 14.875 24.2812V16.8438C14.875 16.3216 15.0824 15.8208 15.4516 15.4516C15.8208 15.0824 16.3216 14.875 16.8438 14.875H24.2812C24.8034 14.875 25.3042 15.0824 25.6734 15.4516C26.0426 15.8208 26.25 16.3216 26.25 16.8438V24.2812C26.25 24.8034 26.0426 25.3042 25.6734 25.6734C25.3042 26.0426 24.8034 26.25 24.2812 26.25Z" fill="#3A211C" />
                                </svg>
                            </div> */}
                        </div>

                        <AdvertsSection
                            isLoading={isAdvertsLoading}
                            adverts={adverts?.items} />
                        {adverts && adverts.total != adverts.items.length &&
                            <PrimaryButton
                                onButtonClick={() => {
                                    setSearchParams(getQueryString({
                                        ...pageRequest,
                                        size: (pageRequest?.size || 0) + advertPageSize
                                    }))
                                }}
                                fontSize="clamp(14px, 2.5vh, 36px)"
                                title='Завантажити ще'
                                disabled={false}
                                isLoading={isAdvertsLoading}
                                className='w-[20vw] h-[4.5vh] mt-[2vh] mb-[4vh] font-light self-center'
                                bgColor='#9B7A5B'
                                fontColor='white'
                                brColor='#9B7A5B' />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdvertsPage