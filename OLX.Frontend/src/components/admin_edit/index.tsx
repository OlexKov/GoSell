import { Form, Input, UploadFile } from "antd";
import '../../pages/user/create_advert/style.scss';
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux";
import { useAdminEditMutation, useCreateAdminMutation, useDeleteAccountMutation } from "../../redux/api/accountAuthApi";
import { IUserEditModel } from "../../models/account";
import { confirm } from "../../utilities/confirm_modal";
import { logOut } from "../../redux/slices/userSlice";
import { APP_ENV } from "../../constants/env";
import MaskedInput from "../inputs/masked_input";
import LocationSelector from "../location_selector";
import PrimaryButton from "../buttons/primary_button";
import UserImageSelector from "../user_image_selector";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import useAdminPasswordCheck from "../../hooks/checkAdminPassword";

const AdminEdit: React.FC = () => {
    const user = useAppSelector(state => state.user.user)
    const navigate = useNavigate()
    const isNewAdmin = useRef<boolean>(location.pathname === '/admin/admins/new')
    const dispatcher = useAppDispatch();
    const [createAdmin, { isLoading: isAdminCreating }] = useCreateAdminMutation()
    const [editAdmin, { isLoading: isAdminEditing }] = useAdminEditMutation()
    const [deleteUser, { isLoading: isUserEDeleting }] = useDeleteAccountMutation()
    const {passwordCheck} = useAdminPasswordCheck()
    const { executeRecaptcha } = useGoogleReCaptcha();

    const onFinish = async (data: any) => {
        if (await passwordCheck()) {
            const editModel: IUserEditModel = {
                id: !isNewAdmin.current ? user?.id || 0 : 0,
                email: data.email,
                firstName: data.firstName,
                imageFile: data.imageFile?.originFileObj,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                settlementRef: data.settlementRef,
                password: data.password || '',
                oldPassword: data.oldPassword || '',
                passwordConfirmation: data.passwordConfirmation || '',
                recapthcaToken: executeRecaptcha ? await executeRecaptcha(`${isNewAdmin ? 'createAdmin' : 'editAdmin'}`) : '',
                action: isNewAdmin ? 'createAdmin' : 'editAdmin'
            }
            const result = !isNewAdmin.current ? await editAdmin(editModel) : await createAdmin(editModel);
            if (!result.error) {
                toast(`${isNewAdmin.current
                    ? `Адміністратора "${data.firstName} ${data.lastName}" успішно додано`
                    : 'Інформація успішно оновлена'}`, {
                    type: "success"
                })
                navigate('/admin/admins')
            }
        }

    }

    const deleteAccount = async () => {
        if (await passwordCheck()) {
            confirm({
                title: <span className="font-unbounded font-medium text-adaptive-1_7_text text-[red]">Видалення облікового запису</span>,
                content: <div className="font-montserrat text-adaptive-1_7_text my-[2vh] mr-[1.5vw]">Ви впевненні що хочете видалити свій акаунт?</div>,
                onOk: async () => {
                    var result = await deleteUser(user?.id || 0);
                    if (!result.error) {
                        dispatcher(logOut());
                        toast(`Ваш акаунт успішно видало`, {
                            type: "success"
                        })
                    }
                },
                okText: 'Видалити'
            })
        }
    }

    return (
        <>
            <Form
                layout="vertical"
                className="flex flex-col w-full mb-[23vh] custom-form-item-error"
                onFinish={onFinish}
                scrollToFirstError={{
                    behavior: "smooth",
                    block: "center",
                    inline: "nearest"
                }}
                initialValues={!isNewAdmin.current
                    ? {
                        imageFile: user?.photo ? ({
                            thumbUrl: APP_ENV.IMAGES_200_URL + user?.photo, url: APP_ENV.IMAGES_1200_URL + user?.photo, originFileObj: new File([new Blob([''])], user?.photo || '', { type: 'image/existing' })
                        }) as UploadFile : undefined,
                        firstName: user?.firstName,
                        lastName: user?.lastName,
                        email: user?.email,
                        phoneNumber: user?.phone,
                        settlementRef: user?.settlement
                    }
                    : undefined}>
                <Form.Item
                    noStyle
                    name='imageFile'
                >
                    <UserImageSelector className="h-[15.5vh]" />
                </Form.Item>
                <hr className="my-[6vh]" />
                <div className="grid grid-cols-2 gap-x-[3vh]">
                    <Form.Item
                        name="lastName"
                        label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Прізвище</div>}
                        className="w-full"
                        rules={[
                            {
                                required: true,
                                message: 'Введіть прізвище'
                            },
                            {

                                min: 3,
                                message: 'Мінімум 3 символи'
                            },
                            {

                                max: 100,
                                message: 'Мінімум 3 символи'
                            },
                        ]}
                    >
                        <Input
                            className="h-[5vh]   font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                            placeholder="Прізвище" />

                    </Form.Item>
                    <Form.Item
                        name="firstName"
                        label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Ім'я</div>}
                        className="w-full"
                        rules={[
                            {
                                required: true,
                                message: "Введіть ім'я"
                            },
                            {

                                min: 3,
                                message: 'Мінімум 3 символи'
                            },
                            {

                                max: 100,
                                message: 'Мінімум 3 символи'
                            },
                        ]}
                    >
                        <Input
                            className="h-[5vh] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                            placeholder="Ім'я" />

                    </Form.Item>
                    <Form.Item
                        name="phoneNumber"
                        className="w-full"
                        label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Номер телефону</div>}
                        rules={[
                            {
                                required: true,
                                message: 'Введіть номер телефону'
                            },
                            {

                                min: 19,
                                message: 'Невірно введений телефон! (+38 (XXX) XXX-XX-XX)'
                            },
                        ]}
                    >
                        <MaskedInput
                            mask="+38 (999) 999-99-99"
                            maskChar=""
                            disabled={false}
                            placeholder="Номер телефону"
                            className="h-[5vh] border-[1px]  border-[#9B7A5B] w-full rounded-md pl-3 focus:outline-none focus:border-[#9B7A5B] focus:border-[1px] font-montserrat text-adaptive-1_6-text "
                        />

                    </Form.Item>
                    <Form.Item
                        name="email"
                        label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Електронна пошта</div>}
                        className="w-full "
                        rules={[
                            {
                                required: true,
                                message: 'Введіть електронну пошту'
                            },
                            {

                                type: 'email',
                                message: 'Неправильний формат електронної пошти'
                            },
                            
                        ]}
                    >
                        <Input
                            disabled={!isNewAdmin.current}
                            className="h-[5vh] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                            placeholder="Електронна пошта" />

                    </Form.Item>
                    <Form.Item
                        name="password"
                        className="w-full"
                        label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Новий пароль</div>}
                        rules={[
                            () => ({
                                validator(_, value) {
                                    if (!value && isNewAdmin.current) {
                                        return Promise.reject(new Error('Введіь будьласка пароль...'));
                                    }
                                    return Promise.resolve();
                                }
                            }),
                            {
                                pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\\w\\s]|[_])).{6,}$/,
                                message: 'Мінімум 6 символів,велика та мала літера,цифра,знак!'
                            },
                        ]} 
                    >
                        <Input.Password
                            className="h-[5vh] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                            placeholder="пароль"

                        />

                    </Form.Item>
                    <Form.Item
                        name="passwordConfirmation"
                        className="w-full"
                        label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Підтвердіть пароль</div>}
                        dependencies={['password']}
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Паролі не співпадають !'));
                                }
                            })
                        ]} 
                    >
                        <Input.Password
                            className="h-[5vh] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                            placeholder="підтвердіть пароль"

                        />

                    </Form.Item>
                    {!isNewAdmin.current &&
                        <Form.Item
                            name="oldPassword"
                            dependencies={['password']}
                            className="w-full"
                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Старий пароль</div>}
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (getFieldValue('password') && !value ) {
                                            return Promise.reject(new Error('Ведіть будьласка старий пароль !'));
                                        }
                                        return Promise.resolve();
                                    }
                                }),
                            ]} 
                        >
                            <Input.Password
                                className="h-[5vh] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                placeholder="старий пароль"

                            />

                        </Form.Item>
                    }

                    <Form.Item
                        name="settlementRef"
                        className="w-full"
                        label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Місто/Населений пункт</div>}
                        rules={[
                            {
                                required: true,
                                message: 'Оберіть місто/Населений пункт'
                            },
                        ]}
                    >
                        <LocationSelector
                            height="5vh"
                            width="100%"
                            placeholder="Місто/Населений пункт" />

                    </Form.Item>

                </div>
                <div className="flex flex-col gap-[3vh] my-[6vh]">
                    {!isNewAdmin.current &&
                        <>
                            <hr className="my-[1vh]" />
                            <div className="flex flex-col ml-[1vw] gap-[2.5vh]">
                                <div className="flex flex-col gap-[.6vh]">
                                    <span className="font-unbounded font-medium text-adaptive-1_7_text">Видалити обліковий запис</span>
                                    <span className="font-montserrat text-adaptive-1_7_text">Ваш профіль адміністратора буде видалено. Це може зайняти деякий час.</span>
                                </div>
                                <PrimaryButton
                                    title={"Видалити"}
                                    isLoading={isUserEDeleting}
                                    onButtonClick={deleteAccount}
                                    bgColor="white"
                                    brColor="black"
                                    className="h-[4.2vh] w-[11.3vw]"
                                    fontSize="clamp(14px,1.9vh,30px)"
                                />
                            </div>
                        </>
                    }
                    <hr className="mt-[2vh]" />
                </div>
                <PrimaryButton
                    title={`${!isNewAdmin.current ? 'Зберегти зміни' : 'Додати адміністратора'}`}
                    htmlType="submit"
                    isLoading={isAdminEditing || isAdminCreating}
                    className="w-[15vw] ml-auto mt-[.5vh] h-[4.6vh]"
                    fontColor="white"
                    fontSize="clamp(14px,1.9vh,36px)"
                    bgColor="#9B7A5B"
                    brColor="#9B7A5B" />
            </Form>

        </>)
}

export default AdminEdit