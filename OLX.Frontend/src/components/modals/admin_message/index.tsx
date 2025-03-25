import { Form, Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { closeMessageSendModal } from "../../../redux/slices/modalSlice";
import { useCreateMessageForAdminMutation, useCreateMessageForUserMutation } from "../../../redux/api/adminMessageApi";
import { toast } from "react-toastify";


const AdminMessageModal: React.FC = () => {
    const dispatch = useAppDispatch();
    const [sendMesssageToUser] = useCreateMessageForUserMutation();
    const [sendMesssageToAdmin] = useCreateMessageForAdminMutation();
    const { isMessageSendModalOpen, title, userId, usersIds,toAdmin } = useAppSelector(state => state.modalSlice);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false)

    const handleOk = async () => {
        form
            .validateFields()
            .then(async (_values) => {
                setLoading(true)
                let result :any; 
                if(!toAdmin){
                    result = await sendMesssageToUser({
                        userIds: userId ? [userId] : usersIds,
                        content: form.getFieldValue('message'),
                        subject: form.getFieldValue('subject')
                    })
                }
                else{
                    result = await sendMesssageToAdmin({
                        content: form.getFieldValue('message'),
                        subject: form.getFieldValue('subject')
                    })
                }
                
                if (!result.error) {
                    toast(`Повідомлення успішно відправлен${usersIds?.length && usersIds?.length > 1 ? 'і' : 'о'}`, {
                        type: 'info',
                        style: { width: 'fit-content' }
                    })
                    handleCancel();
                }
                form.resetFields();
                setLoading(false)
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    }

    const handleCancel = async () => {
        form.resetFields();
        dispatch(closeMessageSendModal())
    }

    return (
        <Modal
            title={title}
            open={isMessageSendModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okButtonProps={{
                loading: loading
            }}
            okText="Надіслати"
            cancelText='Відмінити'

        >
            <Form
                form={form}
                layout="vertical"
                name="messageModalForm"
                initialValues={{
                    message: ''
                }}
            >
                <Form.Item
                    name='subject'
                    label="Тема"
                    rules={[
                        {
                            required: true,
                            message: 'Введіть тему'
                        },
                        {
                            min: 10,
                            message: "Мінімальна довжинв теми 10 символи"
                        },
                        {
                            max: 300,
                            message: "Максимальна довжинв теми 100 символів"
                        },
                    ]}>
                    <Input
                        showCount
                        maxLength={100}
                        min={10}
                        placeholder="Тема"
                    />
                </Form.Item>
                <Form.Item
                    name='message'
                    label="Повідомлення"
                    rules={[
                        {
                            required: true,
                            message: 'Введіть повідомлення'
                        },
                        {
                            min: 10,
                            message: "Мінімальна довжинв повідомлення 10 символи"
                        },
                        {
                            max: 300,
                            message: "Максимальна довжинв повідомлення 300 символів"
                        },
                    ]}>
                    <TextArea
                        className="mb-4"
                        showCount
                        maxLength={300}
                        minLength={10}
                        placeholder="Повідомлення"
                        style={{ height: 300, resize: 'none' }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
export default AdminMessageModal;