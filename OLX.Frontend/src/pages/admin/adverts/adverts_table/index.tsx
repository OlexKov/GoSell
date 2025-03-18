import { PageHeader } from "../../../../components/page_header";
import { ClearOutlined, ProfileOutlined } from '@ant-design/icons';
import PageHeaderButton from "../../../../components/buttons/page_header_button";
import { CachedOutlined, CheckOutlined, DeleteForever, Info, LockOutlined, SearchOff, SearchOutlined } from "@mui/icons-material";
import AdminAdvertCollapsedFilters from "../../../../components/admin_colapsed_filter";
import { AdminFilterResultModel } from "../../../../components/admin_colapsed_filter/models";
import { Pagination, Popconfirm, Table, TableColumnsType, Tooltip, Image, Input, Button } from "antd";
import { IAdvert, IAdvertSearchPageData } from "../../../../models/advert";
import { paginatorConfig } from "../../../../utilities/pagintion_settings";
import { APP_ENV } from "../../../../constants/env";
import { useGetAllCategoriesQuery } from "../../../../redux/api/categoryApi";
import { formatPrice, getAdvertPageRequest, getDateTime, getQueryString } from "../../../../utilities/common_funct";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Key, useEffect, useMemo, useState } from "react";
import { useGetAdvertPageQuery } from "../../../../redux/api/advertApi";
import { IconButton } from "@mui/material";
import { ColumnType, TableProps } from "antd/es/table";
import { useApproveAdvertMutation, useDeleteAdvertMutation } from "../../../../redux/api/advertAuthApi";
import { toast } from "react-toastify";
import AdvertLockModal from "../../../../components/modals/advert_lock";


const updatedPageRequest = (searchParams: URLSearchParams): IAdvertSearchPageData => ({
    priceFrom: Number(searchParams.get("priceFrom")),
    priceTo: Number(searchParams.get("priceTo")),
    approved: location.pathname === '/admin/adverts',
    blocked: false,
    completed: false,
    size: Number(searchParams.get("size")) || paginatorConfig.pagination.defaultPageSize,
    page: Number(searchParams.get("page")) || paginatorConfig.pagination.defaultCurrent,
    sortKey: searchParams.get("sortKey") || '',
    isDescending: searchParams.get("isDescending") === "true",
    categoryId: searchParams.has("categoryId") ? Number(searchParams.get("categoryId")) : undefined,
    filters: searchParams.has("filters") ? (JSON.parse(searchParams.get("filters") || '') as number[][]) : [],
    isContractPrice: searchParams.get("isContractPrice") === "true" || undefined,
    search: searchParams.get("search") || '',
    categorySearch: searchParams.get("categorySearch") || '',
    phoneSearch: searchParams.get("phoneSearch") || '',
    emailSearch: searchParams.get("emailSearch") || '',
    settlementSearch: searchParams.get("settlementSearch") || '',
});


const AdminAdvertTable: React.FC = () => {
    const [advertToLock, setAdvertToLock] = useState<IAdvert>();
    const navigate = useNavigate()
    const location = useLocation()
    const { data: categories } = useGetAllCategoriesQuery()
    const [searchParams, setSearchParams] = useSearchParams('');
    const pageRequest = useMemo(() => updatedPageRequest(searchParams), [location]);
    const getPageRequest = useMemo(() => getAdvertPageRequest(pageRequest, categories || []), [pageRequest, categories])
    const [approveAdvert] = useApproveAdvertMutation();
    const [deleteAdvert] = useDeleteAdvertMutation();
    const { data: adverts, isLoading, refetch } = useGetAdvertPageQuery(getPageRequest);
    useEffect(() => {
        refetch()
    }, [location])
    const getColumnSearchProps = (dataIndex: keyof IAdvertSearchPageData): ColumnType<IAdvert> => ({
        filterDropdown: ({ close }) => (
            <div className="p-3 flex gap-2" style={{ width: 300, padding: 8 }}>
                <Input
                    placeholder={`Пошук`}
                    value={pageRequest[dataIndex]?.toString()}
                    onChange={(e) => {
                        setSearchParams(getQueryString({ ...pageRequest, [dataIndex]: e.target.value }))
                    }}
                    size="small"
                />
                <Tooltip title="Очистити" color="gray">
                    <Button
                        onClick={() => {
                            setSearchParams(getQueryString({ ...pageRequest, [dataIndex]: '' }))
                            close()
                        }}
                        size="small"
                        style={{ paddingLeft: 3, paddingRight: 3 }}
                        danger
                        icon={<ClearOutlined />}
                    />
                </Tooltip>
            </div>
        ),
        filterIcon: () => (
            <SearchOutlined style={{ width: 20, color: pageRequest[dataIndex] !== '' ? '#1890ff' : undefined }} />
        ),
    });

    const onTableChange: TableProps<IAdvert>['onChange'] = (_pagination, _filters, sorter, extra) => {
        if (extra.action === 'sort') {
            let descending: boolean;
            let key: Key | undefined;
            if (Array.isArray(sorter)) {
                const firstSorter = sorter[0];
                descending = firstSorter.order === 'descend';
                key = firstSorter.columnKey;
            } else {
                descending = sorter.order === 'descend';
                key = sorter.columnKey;
            }
            setSearchParams(getQueryString({ ...pageRequest, isDescending: descending ? descending : undefined, sortKey: key?.toString() }))
        }
    }

    const columns: TableColumnsType<IAdvert> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 50,
            fixed: 'left',
            align: 'center',
            sorter: true,
        },
        {
            title: 'Фото',
            key: 'photo',
            render: (_, advert: IAdvert) =>
                <div className="flex  items-center">
                    <Image.PreviewGroup
                        items={advert.images.map(x => APP_ENV.IMAGES_1200_URL + x.name)}>
                        <Image className="self-center" width={60} src={APP_ENV.IMAGES_100_URL + advert.images.find(x => x.priority === 0)?.name} />
                    </Image.PreviewGroup>
                </div>,
            width: 80,
            fixed: 'left',
            align: 'center'
        },
        {
            title: "Заголовок",
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            width: 'auto',
            fixed: 'left',
            sorter: true,
            ...getColumnSearchProps('search')
        },
        {
            title: "Категорія",
            dataIndex: 'categoryId',
            key: 'categoryName',
            ellipsis: true,
            width: 150,
            render: (categoryId: number) => <span >{categories?.find(x => x.id === categoryId)?.name}</span>,
            sorter: true,
            ...getColumnSearchProps('categorySearch')
        },
        {
            title: "Ціна",
            dataIndex: 'price',
            key: 'price',
            ellipsis: true,
            width: 150,
            render: (price: number) => formatPrice(price) + ' грн.',
            sorter: true,
        },
        {
            title: "Телефон",
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            ellipsis: true,
            width: 150,
            render: (value: string) => <span >{value ? value : "- - - - - - "}</span>,
            align: 'center',
            sorter: true,
            ...getColumnSearchProps('phoneSearch')
        },
        {
            title: "Електронна пошта",
            dataIndex: 'contactEmail',
            key: 'contactEmail',
            ellipsis: true,
            width: 200,
            sorter: true,
            ...getColumnSearchProps('emailSearch')
        },


        {
            title: "Місто",
            dataIndex: 'settlementName',
            key: 'settlementName',
            width: 150,
            sorter: true,
            ...getColumnSearchProps('settlementSearch')
        },

        {
            title: "Дата",
            dataIndex: 'date',
            key: 'date',
            render: (value: string) => <span >{getDateTime(value)}</span>,
            width: 160,
            align: 'center',
            sorter: true,
        },
        {
            key: 'actions',
            width: 100,
            render: (_, advert: IAdvert) =>
                <div className='flex justify-around'>
                    <Tooltip title="Показати">
                        <IconButton onClick={() => { navigate(`/admin/adverts/preview/${advert.id}`) }} color="success" size="small">
                            <Info />
                        </IconButton>
                    </Tooltip>
                    {location.pathname === '/admin/adverts/approve' &&
                        <Tooltip title="Підтвердити оголошення">
                            <Popconfirm
                                title="Підтвердження оголошення"
                                description={`Ви впевненні що бажаєте підтвердити оголошення "${advert.title}"?`}
                                onConfirm={() => { approve(advert) }}
                                okText="Підтвердити"
                                cancelText="Відмінити"
                            >
                                <IconButton color="success" size="small">
                                    <CheckOutlined />
                                </IconButton>
                            </Popconfirm>
                        </Tooltip>}

                    <Tooltip title="Блокувати оголошення">
                        <Popconfirm
                            title="Блокування оголошення"
                            description={`Ви впевненні що бажаєте заблокувати оголошення "${advert.title}"?`}
                            onConfirm={() => { setAdvertToLock(advert) }}
                            okText="Заблокувати"
                            cancelText="Відмінити"
                        >
                            <IconButton color="success" size="small">
                                <LockOutlined />
                            </IconButton>
                        </Popconfirm>
                    </Tooltip>

                    <Tooltip title="Видалити оголошення">
                        <Popconfirm
                            title="Видалення оголошення"
                            description={`Ви впевненні що бажаєте видалити оголошення "${advert.title}"?`}
                            onConfirm={() => { advertDelete(advert) }}
                            okText="Видалити"
                            cancelText="Відмінити"
                        >
                            <IconButton color="error" size="small">
                                <DeleteForever />
                            </IconButton>
                        </Popconfirm>
                    </Tooltip>
                </div>,
            fixed: 'right',
            align: 'center'
        }
    ];

    const approve = async (advert: IAdvert) => {
        const result = await approveAdvert(advert.id);
        if (!result.error) {
            toast(`Оголошення ${advert.title} успішно підтверджено`, { type: 'info' })
        }
    }

    const advertDelete = async (advert: IAdvert) => {
        const result = await deleteAdvert(advert.id);
        if (!result.error) {
            toast(`Оголошення ${advert.title} успішно видалено`, { type: 'info' })
        }
    }

    const advertLockCancel = () => {
        setAdvertToLock(undefined);
    }


    const onFiltersChange = (filterValues: AdminFilterResultModel) => {
        console.log(filterValues)
        setSearchParams(getQueryString({
            ...pageRequest,
            categoryId: filterValues.categoryId === 0 ? undefined : filterValues.categoryId,
            filters: filterValues.filters,
            priceTo: filterValues.priceTo,
            priceFrom: filterValues.priceFrom
        }))
    }

    const onPaginationChange = (currentPage: number, pageSize: number) => {
        setSearchParams(getQueryString({ ...pageRequest, page: currentPage, size: pageSize }))
    }

    return (
        <div className="m-6 flex-grow  text-center overflow-hidden">
            <AdvertLockModal
                advert={advertToLock}
                onCancel={advertLockCancel}
            />
            <PageHeader
                title={`${location.pathname === '/admin/adverts' ? "Діючі" : "Непідтверджені"} оголошення`}
                icon={<ProfileOutlined className="text-2xl" />}
                buttons={[
                    <PageHeaderButton
                        key='clear_filter'
                        onButtonClick={() => {
                            setSearchParams(getQueryString(({
                                ...pageRequest,
                                emailSearch: '',
                                phoneSearch: '',
                                categorySearch: '',
                                search: '',
                                settlementSearch: ''
                            })))
                        }}
                        className="w-[35px] h-[35px] bg-red-900"
                        buttonIcon={<SearchOff className="text-lg" />}
                        tooltipMessage="Очистити фільтри"
                        tooltipColor="gray"
                        disabled={
                            pageRequest.emailSearch === '' &&
                            pageRequest.phoneSearch === '' &&
                            pageRequest.categorySearch === '' &&
                            pageRequest.search === '' &&
                            pageRequest.settlementSearch === ''} />,
                    <PageHeaderButton
                        key='reload'
                        onButtonClick={() => { refetch() }}
                        className="w-[35px] h-[35px] bg-sky-700"
                        buttonIcon={<CachedOutlined className="text-lg" />}
                        tooltipMessage="Перезавантажити"
                        tooltipColor="gray" />
                ]}
            />
            <div className="bg-white p-5 flex flex-col gap-3">
                {location.pathname === "/admin/adverts"
                    && <AdminAdvertCollapsedFilters onFiltersChange={onFiltersChange} />}


                <Table<IAdvert>
                    size="small"
                    rowKey="id"
                    columns={columns}
                    dataSource={adverts?.items}
                    scroll={{ x: 'max-content' }}
                    loading={isLoading}
                    bordered
                    // rowSelection={selected ? rowSelection : undefined}
                    pagination={false}
                    showSorterTooltip={{ target: 'sorter-icon' }}
                    onChange={onTableChange}
                />

                {((adverts?.total || 0) > paginatorConfig.pagination.defaultPageSize) &&
                    <Pagination
                        align="center"
                        showSizeChanger
                        pageSizeOptions={paginatorConfig.pagination.pageSizeOptions}
                        locale={paginatorConfig.pagination.locale}
                        showTotal={paginatorConfig.pagination.showTotal}
                        current={pageRequest.page}
                        total={adverts?.total}
                        pageSize={pageRequest.size}
                        onChange={onPaginationChange}
                        className='mt-4' />
                }
            </div>
        </div>)
};

export default AdminAdvertTable;