import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import AdvertCard from "../../../components/advert_card";
import { BackButton } from "../../../components/buttons/back_button"
import { useGetAdvertByIdQuery } from "../../../redux/api/advertApi";
import { Form, Input, Radio, Select } from "antd";
import LocationSelector from "../../../components/location_selector";
import { useAppSelector } from "../../../redux";
import PrimaryButton from "../../../components/buttons/primary_button";
import '../../../components/price_filter/style.scss'
import { useMemo, useState } from "react";
import { useGetAreasQuery, useGetRegionsByAreaQuery, useGetSettlementsByRegionQuery, useGetWirehousesQuery } from "../../../redux/api/newPostApi";
import { MinusOutlined } from "@ant-design/icons";
import { IArea, IRegion, ISettlement } from "../../../models/newPost";
import { getQueryString } from "../../../utilities/common_funct";
import './style.scss'
import MaskedInput from "../../../components/inputs/masked_input";

const BuyAdvertPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams('');
    const user = useAppSelector(state => state.user.user)
    const [form] = Form.useForm()
    const { id } = useParams();
    const { data: advert } = useGetAdvertByIdQuery(Number(id))
    const [delivery, setDelivery] = useState<string>(searchParams.get('delivery') || 'Укрпошта')
    const [newPostLocation, setNewPostLocation] = useState<string | undefined>(searchParams.get('settlementRef') || user?.settlement)
    const { data: wirehouses, isLoading: isWirehousesLoading } = useGetWirehousesQuery(newPostLocation || '', { skip: !newPostLocation })
    const { data: areas, isLoading: isAreasLoading } = useGetAreasQuery();
    const [locationData, setLocationData] = useState<{ area: string | undefined, region: string | undefined }>({ area: searchParams.get('area') || undefined, region: searchParams.get('region') || undefined })
    const { data: regions, isLoading: isRegionsLoading } = useGetRegionsByAreaQuery(locationData.area || '', { skip: !locationData.area })
    const { data: settlements, isLoading: isSettlementsLoading } = useGetSettlementsByRegionQuery(locationData.region || '', { skip: !locationData.region })
    const areasData = useMemo(() => areas?.length ? areas.map((x: IArea) => ({ value: x.ref, label: x.description })) : [], [areas]);
    const regionsData = useMemo(() => regions?.length ? regions.map((x: IRegion) => ({ value: x.ref, label: x.description })) : [], [regions]);
    const settlementsData = useMemo(() => settlements?.length ? settlements.map((x: ISettlement) => ({ value: x.ref, label: x.description })) : [], [settlements]);
    const navigate = useNavigate();
    const onFinish = (data: any) => {
        const queryString = getQueryString(data)
        setSearchParams(queryString)
        navigate(`/user/advert/payment/${id}${queryString}`);
    }

    const onNewPostLocationChange = (value: string) => {
        setNewPostLocation(value)
        form.setFieldValue("wirehouse", undefined)
    }

    const onUkrPoshtaAreaChange = (value: string) => {
        setLocationData({ ...locationData, area: value })
        form.setFieldsValue({
            region: undefined,
            settlement: undefined
        })
    }

    const onUkrPoshtaRegionChange = (value: string) => {
        setLocationData({ ...locationData, region: value })
        form.setFieldValue("settlement", undefined)
    }

    const wirehousesSelectData = useMemo(() =>
        wirehouses
            ? wirehouses?.map(x => ({ value: x.ref, label: x.description }))
            : [], [wirehouses])

    return (
        <div className="w-[100%] gap-[5vh] mx-[8vw] flex flex-col">
            <BackButton className="text-adaptive-1_9_text my-[7.5vh] ml-[1vw] font-medium self-start" title="Назад" />
            <div className="grid grid-cols-[20.5vw,47.5vw] gap-[8vw]">
                <AdvertCard advert={advert} />
                <div className="flex flex-col ">
                    <h1 className="font-unbounded text-adaptive-3_35-text mb-[7vh]">Купити з доставкою</h1>
                    <div className="flex flex-col gap-[.6vh]">
                        <span className="font-unbounded font-medium text-adaptive-1_7_text">Контактні дані</span>
                        <span className="font-montserrat text-adaptive-1_7_text">Заповніть контактні дані отримувача</span>
                    </div>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        scrollToFirstError={{
                            behavior: "smooth",
                            block: "center",
                            inline: "nearest"
                        }}
                        initialValues={{
                            lastName: searchParams.get('lastName') || user?.lastName,
                            firstName: searchParams.get('firstName') || user?.firstName,
                            phoneNumber: searchParams.get('phoneNumber') || user?.phone,
                            email: searchParams.get('email') || user?.email,
                            settlementRef: searchParams.get('settlementRef') || user?.settlement,
                            delivery: searchParams.get('delivery') || "Укрпошта",
                            area: searchParams.get('area'),
                            index: searchParams.get('index'),
                            region: searchParams.get('region'),
                            settlement: searchParams.get('settlement'),
                            street: searchParams.get('street'),
                            house: searchParams.get('house'),
                            room: searchParams.get('room'),
                            wirehouse: searchParams.get('wirehouse')
                        }}>
                        <div className='grid grid-cols-2 gap-y-[1.2vw]  gap-x-[2.1vw] mt-[2.8vh]'>
                            <Form.Item
                                name="lastName"
                                label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Прізвище</div>}
                                className="w-full custom-form-item"
                                rules={[
                                    {
                                        required: true,
                                        message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть прізвище</span>
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
                                className="w-full custom-form-item"
                                rules={[
                                    {
                                        required: true,
                                        message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть ім'я</span>
                                    },
                                ]}
                            >
                                <Input
                                    className="h-[5vh] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                    placeholder="Ім'я" />

                            </Form.Item>
                            <Form.Item
                                name="phoneNumber"
                                className="w-full custom-form-item"
                                label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Номер телефону</div>}
                                rules={[
                                    {
                                        required: true,
                                        message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть номер телефону</span>
                                    },
                                    {
                                        min: 19,
                                        message: <span className="font-montserrat text-adaptive-input-form-error-text">Невірно введений телефон! (+38 (XXX) XXX-XX-XX)</span>
                                    },
                                ]}
                            >
                                <MaskedInput
                                    name="phoneNumber"
                                    mask="+38 (999) 999-99-99"
                                    maskChar=""
                                    placeholder="Номер телефону"
                                    className="h-[5vh] border-[1px]  border-[#9B7A5B] w-full rounded-md pl-3 focus:outline-none focus:border-[#9B7A5B] focus:border-[1px] font-montserrat text-adaptive-1_6-text " />



                            </Form.Item>
                            <Form.Item
                                name="email"
                                label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Електронна пошта</div>}
                                className="w-full custom-form-item"
                                rules={[
                                    {
                                        required: true,
                                        message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть електронну пошту</span>
                                    },
                                    {
                                        type: 'email',
                                        message: <span className="font-montserrat text-adaptive-input-form-error-text">Неправильний формат електронної пошти</span>
                                    },

                                ]}
                            >
                                <Input
                                    className="h-[5vh] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                    placeholder="Електронна пошта" />

                            </Form.Item>
                        </div>
                        <div className="flex flex-col mt-[1.2vw] gap-[.6vh]">
                            <span className="font-unbounded font-medium text-adaptive-1_7_text">Служба доставки</span>
                            <span className="font-montserrat text-adaptive-1_7_text">Оберіть спосіб отримання замовлення</span>
                        </div>

                        <Form.Item
                            name='delivery'
                            noStyle>
                            <Radio.Group onChange={(e) => setDelivery(e.target.value)} className="flex gap-[3.3vw] mt-[4vh] mb-[2.8vh] ">
                                <div className="flex flex-col gap-[.5vh] ">
                                    <Radio className="big-radio" style={{ fontSize: 'clamp(14px, 1.9vh, 36px)', fontWeight: 500 }} key={"Укрпошта"} value={"Укрпошта"}>Укрпошта</Radio>
                                    <div className="font-montserrat text-adaptive-1_7_text ml-[1.7vw]">Безкоштовна доставка</div>
                                </div>
                                <div className="flex flex-col gap-[.5vh]">
                                    <Radio className="big-radio" style={{ fontSize: 'clamp(14px, 1.9vh, 36px)', fontWeight: 500 }} key={"Нова Пошта"} value={"Нова Пошта"}>Нова Пошта</Radio>
                                    <div className="font-montserrat text-adaptive-1_7_text ml-[1.7vw]">Доставка від 60 грн</div>
                                </div>
                                <div>
                                    <Radio className="big-radio" style={{ fontSize: 'clamp(14px, 1.9vh, 36px)', fontWeight: 500 }} key={"Самовивіз"} value={"Самовивіз"}>Самовивіз</Radio>
                                </div>
                            </Radio.Group>
                        </Form.Item>
                        {delivery !== "Самовивіз" &&
                            <div>
                                <hr className="mb-[3vh]" />
                                {delivery === "Укрпошта"
                                    ? <div className='grid grid-cols-2 gap-y-[1.2vw]  gap-x-[2.1vw] mt-[2.8vh]'>
                                        <Form.Item
                                            name="index"
                                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Індекс</div>}
                                            className="w-full custom-form-item"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть індекс</span>
                                                },
                                            ]}
                                        >
                                            <Input.OTP
                                                formatter={(str) => isNaN(Number(str[str.length - 1])) ? str.slice(0, -1) : str}
                                                separator={<MinusOutlined className="text-[#9B7A5B] text-[clamp(12px,2vh,20px)]" />}
                                                length={5} />

                                        </Form.Item>
                                        <Form.Item
                                            name="area"
                                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Область</div>}
                                            className="w-full custom-form-item"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Оберіть область</span>
                                                },
                                            ]}
                                        >
                                            <Select
                                                allowClear
                                                onChange={onUkrPoshtaAreaChange}
                                                loading={isAreasLoading}
                                                options={areasData}
                                                popupClassName="create-advert-select-popup"
                                                className="create-advert-select h-[5vh]"
                                                placeholder="Область" />

                                        </Form.Item>
                                        <Form.Item
                                            name="region"
                                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Район</div>}
                                            className="w-full custom-form-item"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Оберіть район</span>
                                                },
                                            ]}
                                        >
                                            <Select
                                                allowClear
                                                onChange={onUkrPoshtaRegionChange}
                                                loading={isRegionsLoading}
                                                options={regionsData}
                                                popupClassName="create-advert-select-popup"
                                                className="create-advert-select h-[5vh]"
                                                placeholder="Район" />

                                        </Form.Item>
                                        <Form.Item
                                            name="settlement"
                                            className="w-full custom-form-item"
                                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Населений пункт</div>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Оберіть населений пункт</span>
                                                },
                                            ]}
                                        >
                                            <Select
                                                allowClear
                                                loading={isSettlementsLoading}
                                                options={settlementsData}
                                                popupClassName="create-advert-select-popup"
                                                className="create-advert-select h-[5vh]"
                                                placeholder="Населений пункт" />

                                        </Form.Item>
                                        <Form.Item
                                            name="street"
                                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Вулиця</div>}
                                            className="w-full custom-form-item"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть назву вулиці</span>
                                                },
                                            ]}
                                        >
                                            <Input
                                                className="h-[5vh] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                                placeholder="Вулиця" />

                                        </Form.Item>
                                        <div className="flex gap-[2.1vw]">

                                            <Form.Item
                                                name="house"
                                                label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Будинок</div>}
                                                className="w-full custom-form-item"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть номер будинку</span>
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    className="h-[5vh] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                                    placeholder="Номер будинку" />

                                            </Form.Item>
                                            <Form.Item
                                                name="room"
                                                label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Квартира</div>}
                                                className="w-full custom-form-item"
                                            >
                                                <Input
                                                    className="h-[5vh] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                                    placeholder="Номер квартири" />

                                            </Form.Item>
                                        </div>
                                    </div>


                                    : <div className="flex flex-col gap-[1.2vw]">
                                        <Form.Item
                                            name="settlementRef"
                                            className="w-full  custom-form-item"
                                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Місто/Населений пункт</div>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Оберіть населений пункт</span>
                                                }
                                            ]}
                                        >
                                            <LocationSelector
                                                newPost={true}
                                                onChange={onNewPostLocationChange}
                                                height="5vh"
                                                width="100%"
                                                placeholder="Місто/Населений пункт" />

                                        </Form.Item>
                                        <Form.Item
                                            name="wirehouse"
                                            className="w-full custom-form-item"
                                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Відділення</div>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Оберіть відділення</span>
                                                }
                                            ]}
                                        >
                                            <Select
                                                allowClear
                                                loading={isWirehousesLoading}
                                                options={wirehousesSelectData}
                                                popupClassName="create-advert-select-popup"
                                                className="create-advert-select h-[5vh]"
                                                placeholder="Відділення" />

                                        </Form.Item>
                                    </div>}

                            </div>
                        }

                        <div className="font-montserrat text-adaptive-1_7_text">*Поля обов’язкові для заповнення</div>

                        <PrimaryButton
                            title='Перейти до оплати'
                            htmlType="submit"
                            isLoading={false}
                            className="w-[22.6vw]  h-[4.6vh] my-[15vh]"
                            fontColor="white"
                            fontSize="clamp(14px,1.9vh,36px)"
                            bgColor="#9B7A5B"
                            brColor="#9B7A5B" />
                    </Form>

                </div>
            </div>
        </div>
    )
}

export default BuyAdvertPage