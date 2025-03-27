import { Button, Drawer, Form, Input, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { toast } from "react-toastify";
import { useCreateFilterMutation, useUpdateFilterMutation } from "../../../redux/api/filterAuthApi";
import { FilterCreateProps } from "./props";
import { IFilterValue } from "../../../models/filter";
import { useEffect } from "react";

const AdminFilterCreate: React.FC<FilterCreateProps> = ({ open, onClose, filter }) => {
    const [form] = Form.useForm();
    const [createFilter, { isLoading: isFilterCreating }] = useCreateFilterMutation();
    const [updateFilter, { isLoading: isFilterUpdating }] = useUpdateFilterMutation();

    const onFinish = async (data: any) => {
        const newValues = data.values.filter((x: any) => !x.id).map((x: any) => x.value)
        const changetValues = data.values.filter((x: any) => x.id).map((x: IFilterValue) => ({ id: x.id, value: x.value }))
        const result = filter
            ? await updateFilter({ name: data.name, id: filter.id, oldValues: changetValues, newValues: newValues })
            : await createFilter({ name: data.name, values: newValues });
        if (!result.error) {
            toast(`Фільтер успішно ${filter ? "оновлений" : "створений"}`, {
                type: 'info'
            })
            onDrawerClose();
        }
    };

    useEffect(() => {
        if (open) {
            if (filter) {
                form.setFields([
                    { name: 'values', value: filter.values, },
                    { name: 'name', value: filter.name }

                ])
            }
        }
        else {
            form.resetFields()
        }
    }, [open])

    const onDrawerClose = () => {
        form.resetFields()
        onClose()
    }

    const handleSubmit = () => {
        form.submit();
    };

    return (
        <Drawer
            open={open}
            title={filter ? "Редагувати" : "Створити"}
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
                    <Button size="small" loading={isFilterCreating || isFilterUpdating} onClick={handleSubmit} type="primary">
                        Зберегти
                    </Button>
                </Space>
            }
        >
            <Form
                form={form}
                name="filterForm"
                onFinish={onFinish}
                layout="vertical"
                style={{ width: '100%' }}
                className="mx-auto ">

                <Form.Item
                    label="Назва фільтру"
                    validateTrigger={['onChange', 'onBlur']}
                    name='name'
                    className="mb-5"
                    rules={[
                        {
                            required: true,
                            message: "Будьласка введіть назву фільтру",
                        },
                    ]}
                >
                    <Input
                        className="flex-1"
                        size="small"
                        placeholder="Назва фільтру" />
                </Form.Item>
                <Form.List
                    name="values"
                    rules={[
                        {
                            validator: async (_, values) => {
                                if (!values || values.length < 1) {
                                    return Promise.reject(new Error('Додайте хоча б одне значення'));
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            <span>Значення фільтру:</span>
                            <Form.Item>
                                <Button
                                    className="w-full"
                                    size="small"
                                    type="dashed"
                                    onClick={() => {
                                        add('', 0);
                                    }}
                                    icon={<PlusOutlined />}
                                >
                                    Нове значення
                                </Button>
                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                            {fields.map((field) => (

                                <Form.Item
                                    required={false}
                                    key={field.name}
                                    className="flex-1"

                                >
                                    <div className="flex gap-2">
                                        <Form.Item
                                            {...field}
                                            name={[field.name, 'value']}
                                            key={field.key}
                                            validateTrigger={['onChange', 'onBlur']}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Будьласка введіть значення фільтру або видаліть",
                                                },
                                                ({ getFieldValue }) => ({
                                                    async validator(_, value) {
                                                        const values = (getFieldValue('values') as IFilterValue[]).map(x => x.value)
                                                        const duplExist = values.lastIndexOf(value) !== values.indexOf(value)
                                                        if (duplExist) {
                                                            return Promise.reject(new Error('Таке значення вже існує'));
                                                        }
                                                        return Promise.resolve();
                                                    },
                                                }),
                                            ]}
                                            noStyle
                                        >
                                            <Input
                                                className="flex-1"
                                                size="small"
                                                placeholder="Значення фільтру"
                                                onChange={() => form?.validateFields()}
                                            />
                                        </Form.Item>
                                        {fields.length > 1 ? (
                                            <MinusCircleOutlined
                                                className="text-lg text-red-700 "
                                                onClick={() => {
                                                    remove(field.name);
                                                }}
                                            />
                                        ) : null}
                                    </div>
                                </Form.Item>
                            ))}
                        </>
                    )}
                </Form.List>
            </Form>
        </Drawer>)
};

export default AdminFilterCreate;