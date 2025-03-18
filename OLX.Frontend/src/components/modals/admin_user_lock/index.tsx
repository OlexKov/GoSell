import { DatePicker, Form, Modal, TimePicker } from "antd";
import { AdminModalProps } from "../props";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";


const AdminLock: React.FC<AdminModalProps> = ({ isOpen, onConfirm, onCancel, title }) => {

    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false)

    const handleOk = async () => {
        form
            .validateFields()
            .then(async (_values) => {
                setLoading(true)
                const lockEndTime = form.getFieldValue('lockEndTime');
                const lockEndDate = form.getFieldValue('lockEndDate');
                let lockDate: any
                if (lockEndDate && lockEndTime) {
                    lockDate = dayjs(`${lockEndDate.format('YYYY-MM-DD')} ${lockEndTime.format('HH:mm')}`).toISOString();
                }
                else if (!lockEndDate && !lockEndTime) {
                    lockDate = null
                }
                else {
                    lockDate = dayjs(lockEndDate || lockEndTime).toISOString() || null

                }

                await onConfirm({
                    lockReason: form.getFieldValue('lockReason'),
                    lockEndDate: lockDate
                })
                form.resetFields();

            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            })
            .finally(() => { setLoading(false) });
    }

    const handleCancel = async () => {
        form.resetFields();
        await onCancel();
    }



    return (
        <Modal
            title={title}
            open={isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okButtonProps={{
                loading: loading
            }}
            okText="Блокувати"
            cancelText='Відмінити'
        >
            <Form
                form={form}
                layout="vertical"
                name="lockmodalForm"
                initialValues={{
                    lockReason: ''

                }}
            >
                <span className="text-sm">Заблокувати до:</span>
                <div className=" h-fit border border-1 p-2 rounded-md mt-2">

                    <div className="flex gap-2 justify-between ">
                        <Form.Item
                            name='lockEndDate'
                            label="Дата"
                            className="flex-1">
                            <DatePicker
                                minDate={dayjs(Date.now())}
                                size="large"
                                style={{ width: '100%' }}
                                placeholder="дата"
                            />
                        </Form.Item>
                        <Form.Item
                            name='lockEndTime'
                            label="Час"
                            className="flex-1"
                            dependencies={['lockEndDate']}
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const selectedDate = getFieldValue('lockEndDate');
                                        const currentDate = dayjs();
                                        if (!selectedDate || selectedDate.isSame(currentDate, 'day')) {
                                            const currentTime = currentDate.add(10, 'minute').startOf('minute');
                                            if (value && value.isBefore(currentTime)) {
                                                return Promise.reject(new Error('Час не може бути менше ніж поточний.Мінімальний період блокуваня - 10 хв'));
                                            }
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}>
                            <TimePicker
                                format="HH:mm:ss"
                                size="large"
                                style={{ width: '100%' }}
                                placeholder="час" />
                        </Form.Item>
                    </div>
                </div>

                <Form.Item
                    name='lockReason'
                    label="Причина блокування"
                    rules={[
                        {
                            required: true,
                            message: 'Ви маєте вказати причину блокування'
                        },
                        {
                            min: 10,
                            message: "Мінімальна довжинв  10 символи"
                        },
                        {
                            max: 300,
                            message: "Максимальна довжинв  300 символів"
                        },
                    ]}>
                    <TextArea
                        className="mb-4"
                        showCount
                        maxLength={300}
                        minLength={10}
                        placeholder="Причина блокування"
                        style={{ height: 200, resize: 'none' }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
export default AdminLock;