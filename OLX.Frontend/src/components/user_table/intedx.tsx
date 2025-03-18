import { Button, Input, Pagination, Table, TableColumnsType, TableProps, Tooltip } from "antd";
import { IOlxUser, IOlxUserPageRequest } from "../../models/user";
import { paginatorConfig } from "../../utilities/pagintion_settings";
import { ColumnType, TableRowSelection } from "antd/es/table/interface";
import UserAvatar from "../user_avatar";
import { CheckOutlined, SearchOutlined } from "@mui/icons-material";
import { getDateTime, getQueryString } from "../../utilities/common_funct";
import { Key, useEffect, useState } from "react";
import { UserTableProps } from "./props";
import { ClearOutlined } from '@ant-design/icons';
import { useSearchParams } from "react-router-dom";
import { scrollTop } from "../../redux/slices/appSlice";

const UserTable: React.FC<UserTableProps> = ({ selected, isLoading, onRowSelection, selectedUsers, pageRequest, pageResponse, actions }) => {
    const [_, setSearchParams] = useSearchParams('');
    const [search, setSearch] = useState<IOlxUserPageRequest>(pageRequest as IOlxUserPageRequest)
    const actionsColumn: TableColumnsType<IOlxUser> = [
        {
            key: 'actions',
            ellipsis: true,
            width: selected ? 135 : 60,
            render: actions,
            fixed: 'right',
            align: 'center'
        }
    ]

    useEffect(() => {
        setSearch(pageRequest)
    }, [pageRequest])

    const onPaginationChange = (currentPage: number, pageSize: number) => {
        setSearchParams(getQueryString({ ...pageRequest, page: currentPage, size: pageSize }))
    }

    const tableChange: TableProps<IOlxUser>['onChange'] = (_pagination, _filters, sorter, extra) => {
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
            setSearchParams(getQueryString({ ...pageRequest, isDescending: descending, sortKey: key?.toString() || '' }))
        }
    }


    const rowSelection: TableRowSelection<IOlxUser> = {
        selectedRowKeys: selectedUsers.map(x => x as React.Key),
        onSelect: (record, selected, _selectedRows) => {
            let selectedRows: number[] = []
            if (selected) {
                selectedRows = [...selectedUsers, record.id]
            }
            else {
                selectedRows = selectedUsers.filter(x => x !== record.id);
            }
            onRowSelection(selectedRows)
        },
        onSelectAll: (selected, _selectedRows, changeRows) => {
            let selectedRows: number[] = []
            if (selected) {
                selectedRows = changeRows?.map(x => x.id) || []
                selectedRows = [...selectedUsers, ...selectedRows]
            } else {
                selectedRows = selectedUsers.filter(z => !changeRows.some(x => x.id === z))

            }
            onRowSelection(selectedRows)
        }
    }

    const getColumnSearchProps = (dataIndex: keyof IOlxUserPageRequest): ColumnType<IOlxUser> => ({
        filterDropdown: ({ close }) => (
            <div className="p-3 flex gap-2" style={{ width: 300, padding: 8 }}>
                <Input
                    placeholder={`Пошук`}
                    value={search[dataIndex] as string}
                    onChange={(e) => {
                        setSearch((prev) => ({ ...prev, [dataIndex]: e.target.value }))
                        setSearchParams(getQueryString({ ...search, [dataIndex]: e.target.value }))
                    }}
                    size="small"
                />
                <Tooltip title="Очистити" color="gray">
                    <Button
                        onClick={() => {
                            const newSearch = ({ ...search, [dataIndex]: '' })
                            setSearch(newSearch)
                            setSearchParams(getQueryString({ ...search, [dataIndex]: '' }))
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
            <SearchOutlined style={{ width: 20, color: search[dataIndex] !== '' ? '#1890ff' : undefined }} />
        ),
    });

    const notAdminColumns: TableColumnsType<IOlxUser> = [

        {
            title: "Вебсайт",
            dataIndex: 'webSite',
            key: 'webSite',
            ellipsis: true,
            width: 250,
            render: (value: string) => <span >{value ? value : "- - - - - - "}</span>,
            sorter: true,
            ...getColumnSearchProps('webSiteSearch')
        },
        {
            title: "Оголошеня",
            key: 'advertCount',
            render: (_, user: IOlxUser) => <span >{user.adverts.length}</span>,
            width: 110,
            align: 'center',
            sorter: true,
        },

    ]
    const userTableColumns: TableColumnsType<IOlxUser> = [
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
            title: 'Фото',
            dataIndex: 'photo',
            key: 'photo',
            ellipsis: true,
            render: (_, user: IOlxUser) => <UserAvatar user={user} size={40} />,
            width: 80,
            fixed: 'left',
            align: 'center'
        },
        {
            title: "Прізвище",
            dataIndex: 'lastName',
            key: 'lastName',
            ellipsis: true,
            width: 150,
            render: (value: string) => <span >{value ? value : "- - - - - - "}</span>,
            fixed: 'left',
            sorter: true,
            ...getColumnSearchProps('lastNameSearch')
        },
        {
            title: "Ім'я",
            dataIndex: 'firstName',
            key: 'firstName',
            ellipsis: true,
            width: 120,
            render: (value: string) => <span >{value ? value : "- - - - - - "}</span>,
            sorter: true,
            ...getColumnSearchProps('firstNameSearch')
        },
        {
            title: "Телефон",
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            ellipsis: true,
            width: 140,
            render: (value: string, user: IOlxUser) =>
                <div className="flex gap-5">
                    <span >{value ? value : "- - - - - - "}</span>
                    {user.phoneNumberConfirmed && <CheckOutlined className=" text-green-700" />}
                </div>,
            align: 'center',
            sorter: true,
            ...getColumnSearchProps('phoneNumberSearch')
        },
        {
            title: "Електронна пошта",
            dataIndex: 'email',
            key: 'email',
            ellipsis: true,
            width: 320,
            render: (value: string, user: IOlxUser) =>
                <div className="flex justify-between ">
                    <span >{value}</span>
                    {user.emailConfirmed && <CheckOutlined className=" text-green-700" />}
                </div>,
            sorter: true,
            ...getColumnSearchProps('emailSearch')
        },


        {
            title: "Місто",
            dataIndex: 'settlementDescrption',
            key: 'settlementDescrption',
            width: 150,
            render: (value: string) => <span >{value ? value : "- - - - - - "}</span>,
            sorter: true,
            ...getColumnSearchProps('settlementRefSearch')
        },

        {
            title: "Реєстрація",
            dataIndex: 'createdDate',
            key: 'createdDate',
            render: (value: string) => <span >{getDateTime(value)}</span>,
            width: 160,
            align: 'center',
            sorter: true,
        },
        {
            title: "Aктивність",
            dataIndex: 'lastActivity',
            key: 'lastActivity',
            render: (value: string) => <span >{getDateTime(value)}</span>,
            width: 160,
            align: 'center',
            sorter: true,

        },

    ];
    const columns = selected ? [...userTableColumns, ...notAdminColumns, ...actionsColumn] : [...userTableColumns, ...actionsColumn]
    return (
        <>
            <Table<IOlxUser>
                size="small"
                rowKey="id"
                columns={columns}
                dataSource={pageResponse?.items}
                scroll={{ x: 1000 }}
                loading={isLoading}
                bordered
                rowSelection={selected ? rowSelection : undefined}
                pagination={false}
                showSorterTooltip={{ target: 'sorter-icon' }}
                onChange={tableChange} />

            {((pageResponse?.total || 0) > paginatorConfig.pagination.defaultPageSize) &&
                <Pagination
                    align="center"
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={paginatorConfig.pagination.pageSizeOptions}
                    locale={paginatorConfig.pagination.locale}
                    showTotal={paginatorConfig.pagination.showTotal}
                    current={pageRequest.page}
                    total={pageResponse?.total}
                    pageSize={pageRequest.size}
                    onChange={onPaginationChange}
                    className='mt-4' />
            }
        </>
    )
}
export default UserTable;