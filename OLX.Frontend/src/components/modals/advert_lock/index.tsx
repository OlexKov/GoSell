import { Form, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { IAdvert } from "../../../models/advert";
import { useBlockAdvertMutation } from "../../../redux/api/advertAuthApi";
import { toast } from "react-toastify";

interface IAdvertLockModalProps {
    onCancel?: () => void
    advert?: IAdvert
}

const AdvertLockModal: React.FC<IAdvertLockModalProps> = ({ advert, onCancel }) => {
    const [lockAdvert] = useBlockAdvertMutation();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false)

    const handleOk = async () => {
        if (advert) {
            form.validateFields()
                .then(async (_values) => {
                    setLoading(true)
                    const result = await lockAdvert({ id: advert.id, status: true, lockReason: form.getFieldValue('lockReason') });
                    if (!result.error) {
                        toast(`Оголошення ${advert.title} успішно заблоковано`, { type: 'info' })
                        handleCancel()
                    }
                    ;
                })
                .catch((info) => {
                    console.log('Validate Failed:', info);
                })
                .finally(() => { setLoading(false) });
        }

    }

    const handleCancel = async () => {
        form.resetFields();
        onCancel && onCancel()
    }


    return (
        <Modal
            title={`Блокування оголошення "${advert?.title}"`}
            open={advert !== undefined}
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
export default AdvertLockModal;