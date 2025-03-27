import { Button, Drawer, Form, Input, Modal, Select, Space, TreeSelect, Upload } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { CategoryCreateProps } from "./props";
import { useCreateCategoryMutation, useEditCategoryMutation } from "../../../redux/api/categoryAuthApi";
import { useGetAllCategoriesQuery } from "../../../redux/api/categoryApi";
import { buildTree, getAllParentFilterIds } from "../../../utilities/common_funct";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import { useGetAllFilterQuery } from "../../../redux/api/filterApi";
import { ICategoryCreationModel } from "../../../models/category";
import { APP_ENV } from "../../../constants/env";
import { CategoryFilterDataModel, CategoryPreviewModel } from "./models";



const AdminCategoryCreate: React.FC<CategoryCreateProps> = ({ open, onClose, category }) => {
    const [form] = Form.useForm();
    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useEditCategoryMutation();
    const { data: categories, isLoading } = useGetAllCategoriesQuery();
    const { data: allFilters } = useGetAllFilterQuery();
    const [categoryFilterData, setCategoryFilterData] = useState<CategoryFilterDataModel>({
        excludedFilters: [],
        categoryTree: []
    })
    const [preview, setPreview] = useState<CategoryPreviewModel>({
        previewOpen: false,
        previewImage: '',
        previewTitle: ''
    })
    const [file, setFile] = useState<UploadFile>();

    const onFinish = async (data: any) => {
        const requestData: ICategoryCreationModel = {
            name: data.name,
            id: category?.id || 0,
            currentImage: file ? category?.image : '',
            imageFile: file?.originFileObj,
            parentId: data.parentId || '',
            filterIds: data.filterIds || []
        }
        const result = category
            ? await updateCategory(requestData)
            : await createCategory(requestData);
        if (!result.error) {
            toast(`Категорія успішно ${category ? "оновлена" : "створена"}`, {
                type: 'info'
            })
            onDrawerClose();
        }
    };

    useEffect(() => {
        setCategoryFilterData({
            categoryTree: buildTree(categories || [], undefined, category ? [category.id] : []),
            excludedFilters: getAllParentFilterIds(categories || [], category?.parentId)
        })
    }, [categories])

    useEffect(() => {
        if (open) {
            if (category) {
                if (category.image) {
                    setFile({
                        uid: '-1',
                        name: category.name,
                        status: 'done',
                        url: APP_ENV.IMAGES_800_URL + category.image,
                    })
                }
                form.setFields([
                    { name: 'filterIds', value: category.filters, },
                    { name: 'name', value: category.name },
                    { name: 'parentId', value: category.parentId }
                ])
            }
        }
        else {
            form.resetFields()
            setFile(undefined)
            setCategoryFilterData({ ...categoryFilterData, excludedFilters: [] })
        }
    }, [open])

    const onDrawerClose = () => {
        form.resetFields()
        onClose()
    }

    const handleSubmit = () => {
        form.submit();
    };

    const handlePreview = (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = URL.createObjectURL(file.originFileObj as RcFile);
        }
        setPreview(({
            previewImage: file.url || (file.preview as string),
            previewTitle: file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
            previewOpen: true
        }))
    }

    const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        setFile(newFileList[0]);
    };

    const onParentCategoryChange = (parentId: any) => {
        setCategoryFilterData({ ...categoryFilterData, excludedFilters: getAllParentFilterIds(categories || [], parentId) })
    }

    return (
        <Drawer
            open={open}
            title={category ? "Редагувати" : "Створити"}
            onClose={onDrawerClose}
            styles={{
                body: {
                    paddingBottom: 80,
                    width: '100%'
                },
                header: {
                    width: '100%',
                    backgroundColor: 'ButtonShadow',
                    height: 50
                }
            }}
            extra={
                <Space>
                    <Button size="small" onClick={onDrawerClose}>Відмінити</Button>
                    <Button size="small" onClick={handleSubmit} type="primary">
                        Зберегти
                    </Button>
                </Space>
            }
        >
            <Form
                form={form}
                name="categoryForm"
                onFinish={onFinish}
                layout="vertical"
                className="w-[96%] flex flex-col mx-auto">

                <div className=" flex flex-col h-[120px] w-full mb-6  items-center">
                    <span className="self-start">Зображення</span>
                    <Upload
                        listType="picture-card"
                        accept="image/png, image/jpeg, image/webp"
                        fileList={file ? [file] : []}
                        maxCount={1}
                        beforeUpload={() => false}
                        onPreview={handlePreview}
                        onChange={handleChange}

                    >
                        {(!file || (file.status && file.status !== 'done')) && <>
                            <button style={{ border: 0, padding: 0, background: 'transparent' }} type="button" />
                            <div className='d-flex flex-column align-items-center'>
                                <PlusOutlined className="mr-2" />
                                <span>Відкрити</span>
                            </div>
                        </>}
                    </Upload>
                </div>

                <Form.Item
                    label="Назва категорії"
                    validateTrigger={['onChange', 'onBlur']}
                    name='name'
                    rules={[
                        {
                            required: true,
                            message: "Будьласка введіть назву категорії",
                        },
                    ]}
                >
                    <Input
                        allowClear
                        className="flex-1"
                        size="small"
                        placeholder="Назва категорії" />
                </Form.Item>

                <Form.Item
                    label="Батьківська категорія"
                    name='parentId'
                >
                    <TreeSelect
                        allowClear
                        showSearch
                        loading={isLoading}
                        size="small"
                        className="flex-1"
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={categoryFilterData.categoryTree}
                        placeholder="Батьківська категорія"
                        onChange={onParentCategoryChange}
                    />
                </Form.Item>

                <Form.Item
                    label="Фільтри"
                    name='filterIds'
                >
                    <Select
                        allowClear
                        maxCount={20}
                        maxTagCount='responsive'
                        mode="multiple"
                        className="flex-1"
                        placeholder="Фільтри"
                        showSearch
                        size="small"
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={allFilters?.map(x => ({
                             value: x.id, 
                             label: x.name, 
                             disabled: categoryFilterData.excludedFilters.includes(x.id) }))}
                    />
                </Form.Item>
            </Form>
            <Modal
                open={preview?.previewOpen}
                title={preview?.previewTitle}
                footer={null}
                onCancel={() => setPreview({ ...preview, previewOpen: false })}>
                <img alt="example" style={{ width: '100%' }} src={preview?.previewImage} />
            </Modal>
        </Drawer>)
};

export default AdminCategoryCreate;