import { Form, Input, UploadFile } from "antd";
import { APP_ENV } from "../../../constants/env";
import { useAppDispatch, useAppSelector } from "../../../redux";
import UserImageSelector from "../../user_image_selector";
import PrimaryButton from "../../buttons/primary_button";
import LocationSelector from "../../location_selector";
import '../../../pages/user/create_advert/style.scss';
import { IUserEditModel } from "../../../models/account";
import { useDeleteAccountMutation, useUserEditMutation } from "../../../redux/api/accountAuthApi";
import { toast } from "react-toastify";
import { logOut } from "../../../redux/slices/userSlice";
import { confirm } from "../../../utilities/confirm_modal";
import InputMask from 'react-input-mask';

const UserEdit: React.FC = () => {
    const user = useAppSelector(state => state.user.user)
    const dispatcher = useAppDispatch();
    const [editUser, { isLoading: isUserEditing }] = useUserEditMutation()
    const [deleteUser, { isLoading: isUserEDeleting }] = useDeleteAccountMutation()
    const onFinish = async (data: any) => {
        const editModel: IUserEditModel = {
            id: user?.id || 0,
            email: data.email,
            firstName: data.firstName,
            imageFile: data.imageFile?.originFileObj,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            settlementRef: data.settlementRef,
            website: data.website,
        }
        const result = await editUser(editModel);
        if (!result.error) {
            toast(`Інформація успішно оновлена`, {
                type: "success"
            })
        }
    }

    const deleteAccount = () => {
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
            okText: 'Видалити всі'
        })
    }

    return (
        <>
            <Form
                layout="vertical"
                className="flex flex-col w-full mb-[23vh]"
                onFinish={onFinish}
                initialValues={{
                    imageFile: user?.photo ? ({
                        thumbUrl: APP_ENV.IMAGES_200_URL + user?.photo, url: APP_ENV.IMAGES_1200_URL + user?.photo, originFileObj: new File([new Blob([''])], user?.photo || '', { type: 'image/existing' })
                    }) as UploadFile : undefined,
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    email: user?.email,
                    website: user?.website,
                    phoneNumber: user?.phone,
                    settlementRef: user?.settlement
                }}>
                <Form.Item
                    noStyle
                    name='imageFile'
                >
                    <UserImageSelector className="h-[15.5vh]" />
                </Form.Item>
                <hr className="mt-[9vh]" />
                <div className="flex flex-col gap-[3vh] my-[6vh]">
                    <div className="flex gap-[2vw] ml-[1vw]">
                        <Form.Item
                            name="lastName"
                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Прізвище</div>}
                            className="w-full"
                        >
                            <Input
                                className="h-[5vh]   font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                placeholder="Прізвище" />

                        </Form.Item>
                        <Form.Item
                            name="firstName"
                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Ім'я</div>}
                            className="w-full"
                        >
                            <Input
                                className="h-[5vh] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                placeholder="Ім'я" />

                        </Form.Item>
                    </div>
                    <Form.Item
                        name="email"
                        label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Електронна пошта</div>}
                        className="w-full ml-[1vw]"
                    >
                        <Input
                            disabled
                            className="h-[5vh] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                            placeholder="Електронна пошта" />

                    </Form.Item>
                    <div className="flex gap-[3vw] items-center ml-[1vw]">
                        <Form.Item
                            name="phoneNumber"
                            className="w-[75%]"
                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Номер телефону</div>}
                            rules={[
                                {
                                    min: 19,
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Невірно введений телефон! (+38 (XXX) XXX-XX-XX)</span>
                                },
                            ]}
                        >
                            <InputMask
                                mask="+38 (999) 999-99-99"
                                maskChar=""
                            >
                                {({ props }) =>
                                    <input {...props}
                                        placeholder="Номер телефону"
                                        className="h-[5vh] border-[1px]  border-[#9B7A5B] w-full rounded-md pl-3 focus:outline-none focus:border-[#9B7A5B] focus:border-[1px] font-montserrat text-adaptive-1_6-text " />}
                            </InputMask>



                        </Form.Item>
                        <PrimaryButton
                            title={'Підтвердити номер'}
                            isLoading={false}
                            className="w-[25%] h-[5vh] mt-[1vh]"
                            fontColor="white"
                            fontSize="clamp(14px,1.9vh,36px)"
                            bgColor="#9B7A5B"
                            brColor="#9B7A5B" />
                    </div>
                    <Form.Item
                        name="settlementRef"
                        className="ml-[1vw]"
                        label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Місто/Населений пункт</div>}
                    >
                        <LocationSelector
                            height="5vh"
                            width="100%"
                            placeholder="Місто/Населений пункт" />

                    </Form.Item>

                    <Form.Item
                        name="website"
                        label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Додати посилання на вебсайт</div>}
                        className="w-full ml-[1vw]"
                    >
                        <Input
                            className="h-[5vh] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                            placeholder="Вебсайт" />

                    </Form.Item>
                    <hr className="my-[1vh]" />
                    <div className="flex flex-col ml-[1vw] gap-[2.5vh]">
                        <div className="flex flex-col gap-[.6vh]">
                            <span className="font-unbounded font-medium text-adaptive-1_7_text">Видалити обліковий запис</span>
                            <span className="font-montserrat text-adaptive-1_7_text">Ваш профіль на GoSell буде видалено. Це може зайняти деякий час.</span>
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
                    <hr className="mt-[2vh]" />
                </div>
                <PrimaryButton
                    title={'Зберегти зміни'}
                    htmlType="submit"
                    isLoading={isUserEditing}
                    className="w-[15vw] ml-auto mt-[.5vh] h-[4.6vh]"
                    fontColor="white"
                    fontSize="clamp(14px,1.9vh,36px)"
                    bgColor="#9B7A5B"
                    brColor="#9B7A5B" />
            </Form>

        </>)
}

export default UserEdit