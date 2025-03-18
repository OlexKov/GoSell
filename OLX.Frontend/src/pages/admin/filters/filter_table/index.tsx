import { Button, Input, Pagination, Popconfirm, Table, TableColumnsType, Tooltip } from "antd";
import { PageHeader } from "../../../../components/page_header";
import { ClearOutlined, FilterOutlined } from '@ant-design/icons';
import { paginatorConfig } from "../../../../utilities/pagintion_settings";
import { IFilter, IFilterPageRequest, IFilterValue } from "../../../../models/filter";
import { Key, useEffect, useState } from "react";
import { useGetFilterPageQuery } from "../../../../redux/api/filterApi";
import { ColumnType, TableProps } from "antd/es/table";
import { IconButton } from "@mui/material";
import { AddCircleOutline, CachedOutlined, DeleteForever, EditCalendar, SearchOutlined } from "@mui/icons-material";
import PageHeaderButton from "../../../../components/buttons/page_header_button";
import { useDeleteFilterMutation } from "../../../../redux/api/filterAuthApi";
import { toast } from "react-toastify";
import AdminFilterCreate from "../../../../components/drawers/filter_create";
import { useSearchParams } from "react-router-dom";
import { getQueryString } from "../../../../utilities/common_funct";
import { FilterDrawerDataModel } from "./models";
import { scrollTop } from "../../../../redux/slices/appSlice";
import { useAppDispatch } from "../../../../redux";

const getPageRequest = (searchParams: URLSearchParams) => ({
    size: Number(searchParams.get("size")) || paginatorConfig.pagination.defaultPageSize,
    page: Number(searchParams.get("page")) || paginatorConfig.pagination.defaultCurrent,
    sortKey: searchParams.get("sortKey") || '',
    isDescending: searchParams.get("isDescending") === "true",
    searchName: searchParams.get("searchName") || "",
})

const AdminFilterTable: React.FC = () => {
    const dispatch  = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams('');
    const [drawerData, setDrawerData] = useState<FilterDrawerDataModel>({
        isDrawerOpen: false,
        selectedFilter: undefined
    })
    const [delFilter] = useDeleteFilterMutation();
    const [pageRequest, setPageRequest] = useState<IFilterPageRequest>(getPageRequest(searchParams))
    const { data, isLoading, refetch } = useGetFilterPageQuery(pageRequest)
    
    useEffect(() => {
        setPageRequest(getPageRequest(searchParams))
    }, [location.search])

    useEffect(()=>{
        dispatch(scrollTop())
    },[data])


    const getColumnSearchProps = (): ColumnType<IFilter> => ({
        filterDropdown: ({ close }) => (
            <div style={{ width: 300 }} className="p-3 flex gap-2">
                <Input
                    size="small"
                    placeholder={`Пошук`}
                    value={searchParams.get('searchName') || undefined}
                    onChange={(e) => {
                        setSearchParams(getQueryString({ ...pageRequest, page: 1, searchName: e.target.value }))
                    }}
                />
                <Tooltip title="Очистити" color="gray">
                    <Button
                        onClick={() => {
                            if (searchParams.get("searchName")) {
                                setSearchParams(getQueryString({ ...pageRequest, page: 1, searchName: '' }))
                            }
                            close();
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
            <SearchOutlined style={{ width: 20, color: searchParams.get("searchName") ? 'red' : undefined }} />
        ),
    });

    const onTableChange: TableProps<IFilter>['onChange'] = (_pagination, _filters, sorter, extra) => {
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

    const deleteFilter = async (filterId: number) => {
        const result = await delFilter(filterId);
        if (!result.error) {
            toast(`Фільтер успішно видалений`, {
                type: 'info'
            })
        }
    }

    const editFilter = (filter: IFilter) => {
        setDrawerData({
            isDrawerOpen: true,
            selectedFilter: filter
        })
    }

    const onDrawerClose = () => {
        setDrawerData({
            isDrawerOpen: false,
            selectedFilter: undefined
        })
    }

    const columns: TableColumnsType<IFilter> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            ellipsis: true,
            width: 50,
            fixed: 'left',
            align: 'center',
            sorter: true,
        },

        {
            title: "Назва",
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            width: 260,
            sorter: true,
            fixed: 'left',
            ...getColumnSearchProps()
        },

        {
            title: "Значення",
            dataIndex: 'values',
            key: 'values',
            ellipsis: true,
            width: 'auto',
            render: (values: IFilterValue[]) =>
                <div className=" text-xs text-gray-500">
                    {values.map(x => x.value).join(' | ')}
                </div>
        },
        {
            key: 'actions',
            width: 100,
            render: (_, filter: IFilter) =>
                <div className='flex justify-around'>
                    <Tooltip title="Редагувати фільтр">
                        <IconButton onClick={() => { editFilter(filter) }} color="success" size="small">
                            <EditCalendar />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Видалити фільтр">
                        <Popconfirm
                            title="Відалення фільтра"
                            description={`Ви впевненні що бажаєте видалити фільтр "${filter.name}"?`}
                            onConfirm={() => deleteFilter(filter.id)}
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

    const onPaginationChange = (currentPage: number, pageSize: number) => {
        setSearchParams(getQueryString({ ...pageRequest, page: currentPage, size: pageSize }))
    }

    return (
        <div className="m-6 flex-grow  text-center overflow-hidden">
            {drawerData.isDrawerOpen &&
                <AdminFilterCreate
                    open={drawerData.isDrawerOpen}
                    onClose={onDrawerClose}
                    filter={drawerData.selectedFilter} />}

            <PageHeader
                title="Фільтри"
                icon={<FilterOutlined className="text-2xl" />}
                buttons={[
                    <PageHeaderButton
                        key='add'
                        onButtonClick={() => setDrawerData({ ...drawerData, isDrawerOpen: true })}
                        className="w-[35px] h-[35px] bg-green-700"
                        buttonIcon={<AddCircleOutline className="text-lg" />}
                        tooltipMessage="Додати фільтр"
                        tooltipColor="gray" />,
                    <PageHeaderButton
                        key='reload'
                        onButtonClick={refetch}
                        className="w-[35px] h-[35px] bg-sky-700"
                        buttonIcon={<CachedOutlined className="text-lg" />}
                        tooltipMessage="Перезавантажити"
                        tooltipColor="gray" />
                ]}
            />
            <Table<IFilter>
                size="small"
                rowKey="id"
                columns={columns}
                dataSource={data?.items}
                scroll={{ x: 'max-content' }}
                loading={isLoading}
                bordered
                pagination={false}
                showSorterTooltip={{ target: 'sorter-icon' }}
                onChange={onTableChange}
            />

            {((data?.total || 0) > paginatorConfig.pagination.defaultPageSize) &&
                <Pagination
                    align="center"
                    showSizeChanger
                    pageSizeOptions={paginatorConfig.pagination.pageSizeOptions}
                    locale={paginatorConfig.pagination.locale}
                    showTotal={paginatorConfig.pagination.showTotal}
                    current={pageRequest.page}
                    total={data?.total}
                    pageSize={pageRequest.size}
                    onChange={onPaginationChange}
                    className='mt-4' />
            }
        </div>
    )
};

export default AdminFilterTable;