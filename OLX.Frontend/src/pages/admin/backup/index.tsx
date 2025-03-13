
import { CloudServerOutlined, DeleteOutlined, DeliveredProcedureOutlined, DownloadOutlined, HddOutlined, UploadOutlined } from '@ant-design/icons';
import { PageHeader } from '../../../components/page_header';
import { Popconfirm, Table, TableProps, Tooltip } from 'antd';
import { IBackupFileInfo } from '../../../models/backup';
import { formatBytes, getDateTime } from '../../../utilities/common_funct';
import { useAddBackupFileMutation, useCreateBackupFileMutation, useDeleteBackupFileMutation, useGetBackupInfoQuery, useLazyGetBackupFileQuery } from '../../../redux/api/backupAuthApi';
import { IconButton } from '@mui/material';
import PageHeaderButton from '../../../components/buttons/page_header_button';
import { CachedOutlined } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { confirm } from "../../../utilities/confirm_modal";
import { useRef } from 'react';
import JSZip from "jszip";


const checkBackupFile = async (file?: File): Promise<boolean> => {
    if (!file || !file.name.includes('.back')) {
        return false
    }
    let hasImagesFolder = false;
    let hasDumpFile = false;
    const data = await JSZip.loadAsync(file);
    if (data) {
        for (const relativePath of Object.keys(data.files)) {
            if (relativePath.includes("images/")) {
                hasImagesFolder = true;
            }
            if (relativePath.endsWith(".dump")) {
                hasDumpFile = true;
            }
            if (hasImagesFolder && hasDumpFile) break;
        }
    }
    return hasImagesFolder && hasDumpFile;
}

const BackupDataPage: React.FC = () => {
    const upload = useRef<HTMLInputElement>(null);
    const { data: backupInfo, refetch } = useGetBackupInfoQuery();
    const [getBackupFile] = useLazyGetBackupFileQuery();
    const [deleteBackupFile] = useDeleteBackupFileMutation();
    const [createBackupFile] = useCreateBackupFileMutation();
    const [addBackupFile] = useAddBackupFileMutation()

    const columns: TableProps<IBackupFileInfo>['columns'] = [
        {
            title: <span className='text-lg '>Назва резервної копії</span>,
            dataIndex: 'name',
            key: 'name',
            render: (value) => <span className='text-base font-normal'>{value}</span>
        },
        {
            title: <span className='text-lg'>Дата створення</span>,
            dataIndex: 'dateCreationDate',
            key: 'dateCreationDate',
            render: (value) => <span className='text-base'>{getDateTime(value)}</span>
        },
        {
            title: <span className='text-lg'>Розмір</span>,
            dataIndex: 'size',
            key: 'size',
            render: (value) => <span className='text-base'>{formatBytes(value)}</span>
        },
        {

            key: 'action',
            render: (_, fileInfo: IBackupFileInfo) =>
                <div className='flex justify-around'>
                    <Tooltip title="Відновити базу з резервної копії">
                        <Popconfirm
                            title="Відновлення бази даних з резервної копії"
                            description={`Ви впевненні що бажаєте відновити базу даних з резервної копії "${fileInfo.name}"?`}
                            onConfirm={() => onBackupRestore(fileInfo.name)}
                            okText="Підтвердити"
                            cancelText="Відмінити"
                        >
                            <IconButton color="success" >
                                <CloudServerOutlined />
                            </IconButton>
                        </Popconfirm>
                    </Tooltip>

                    <Tooltip title="Зберегти резервну копію">
                        <Popconfirm
                            title="Збереження резервної копії"
                            description={`Ви впевненні що бажаєте зберегти резервну копію "${fileInfo.name}"?`}
                            onConfirm={() => onBackupDownload(fileInfo.name)}
                            okText="Завантажити"
                            cancelText="Відмінити"
                        >
                            <IconButton color="success" >
                                <DownloadOutlined />
                            </IconButton>
                        </Popconfirm>
                    </Tooltip>

                    <Tooltip title="Видалити резервну копію">
                        <Popconfirm
                            title="Видалення резервної копії"
                            description={`Ви впевненні що бажаєте видалити резервну копію "${fileInfo.name}"?`}
                            onConfirm={() => onBackupDelete(fileInfo.name)}
                            okText="Видалити"
                            cancelText="Відмінити"
                        >
                            <IconButton color="error" >
                                <DeleteOutlined />
                            </IconButton>
                        </Popconfirm>
                    </Tooltip>
                </div>,
            fixed: 'right',
            align: 'center',
            width: 250
        }
    ];

    const onBackupDelete = async (backupName: string) => {
        const result = await deleteBackupFile(backupName);
        if (!result.error) {
            toast(`Резервна копія "${backupName}" успішно видалена`, { type: 'info' })
        }
    }

    const onBackupDownload = async (backupName: string) => {
        const result = await getBackupFile(backupName)
        if (!result.error && result.data) {
            const url = window.URL.createObjectURL(result.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${backupName}.back`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
    }

    const onBackupUpload = () => {
        if (upload.current) {
            upload.current.click();
        }
    }

    const onBackupCreate = async () => {
        confirm({
            title: <span className="font-unbounded font-medium text-adaptive-1_7_text text-[red]">Створення резервної копії</span>,
            content: <div className="font-montserrat text-adaptive-1_7_text my-[2vh] mr-[1.5vw]">Ви впевненні що хочете створити нову резервну копію?</div>,
            onOk: async () => {
                const result = await createBackupFile();
                if (!result.error) {
                    toast(`Резервна копія успішно створена`, { type: 'info' })
                }
            },
            okText: 'Створити'
        })
    }

    const onBackupRestore = (backupName: string) => {

    }

    const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !await checkBackupFile(file)) {
            toast(`Не вірний формат файлу або файл пошкоджено`, { type: 'warning' })
        }
        else {
            const result = await addBackupFile({ backupFile: file })
            if (!result.error) {
                toast(`Резервна копія успішно додана`, { type: 'info' })
            }
        };
    }

    return (
        <div className="m-6 flex-grow ">
            <input
                hidden
                type='file'
                onChange={onFileChange}
                ref={upload}
                accept=".back" />
            <PageHeader
                title='Резервне копіювання/віднолення'
                icon={<HddOutlined className="text-2xl" />}
                buttons={[
                    <PageHeaderButton
                        key='backup'
                        onButtonClick={() => onBackupCreate()}
                        className="w-[35px] h-[35px] bg-amber-500"
                        buttonIcon={<DeliveredProcedureOutlined className="text-lg" />}
                        tooltipMessage="Створити резрвну копію"
                        tooltipColor="gray" />
                    ,
                    <PageHeaderButton
                        key='clear_filter'
                        onButtonClick={() => onBackupUpload()}
                        className="w-[35px] h-[35px] bg-green-500"
                        buttonIcon={<UploadOutlined className="text-lg" />}
                        tooltipMessage="Завантажити резервну копію"
                        tooltipColor="gray" />,
                    <PageHeaderButton
                        key='reload'
                        onButtonClick={() => { refetch() }}
                        className="w-[35px] h-[35px] bg-sky-700"
                        buttonIcon={<CachedOutlined className="text-lg" />}
                        tooltipMessage="Перезавантажити"
                        tooltipColor="gray" />
                ]}
            />
            <div className="bg-white py-10">
                <Table<IBackupFileInfo>
                    columns={columns}
                    pagination={false}
                    rowKey={(value) => value.name}
                    dataSource={backupInfo} />
            </div>
        </div>)
};

export default BackupDataPage;


