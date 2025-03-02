import { Checkbox, Form, Input, InputNumber, Select, TreeSelect, UploadFile } from "antd"
import { BackButton } from "../../../components/buttons/back_button"
import UploadWithDnd from "../../../components/image_upload"
import TextArea from "antd/es/input/TextArea"
import './style.scss'
import { useGetAllCategoriesQuery } from "../../../redux/api/categoryApi"
import { useEffect, useMemo, useState } from "react"
import { buildTree, getAllParentFilterIds, getUserDescr } from "../../../utilities/common_funct"
import { useGetAllFilterQuery } from "../../../redux/api/filterApi"
import { IAdvertCreationModel, IAdvertImage } from "../../../models/advert"
import { useAppSelector } from "../../../redux"
import PrimaryButton from "../../../components/buttons/primary_button"
import { useCreateAdvertMutation, useUpdateAdvertMutation } from "../../../redux/api/advertAuthApi"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { useGetAdvertByIdQuery } from "../../../redux/api/advertApi"
import { APP_ENV } from "../../../constants/env"
import LocationSelector from "../../../components/location_selector"
import InputMask from 'react-input-mask';



const CreateAdvert: React.FC = () => {
    const { id } = useParams();
    const user = useAppSelector(state => state.user.user);
    const { data: advert } = useGetAdvertByIdQuery(Number(id), { skip: isNaN(Number(id)) || Number(id) === 0 })
    const { data: categories, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery()
    const { data: filters } = useGetAllFilterQuery();
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>()
    const [createAdvert, { isLoading: isAdvertCreation }] = useCreateAdvertMutation();
    const [updateAdvert, { isLoading: isAdvertEdition }] = useUpdateAdvertMutation();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const getCategoryTree = useMemo(() => buildTree(categories || [], undefined, undefined, true), [categories])

    const onFinish = async (data: any) => {
        const filterValues = Object.entries(data).filter(x => !isNaN(Number(x[0])) && x[1]).map(x => x[1])
        const imageFiles = data.files.map((x: UploadFile) => x?.originFileObj as Blob)
        const advertCreationModel: IAdvertCreationModel = {
            id: Number(id) || 0,
            userId: user?.id || 0,
            phoneNumber: data.phoneNumber,
            contactEmail: data.contactEmail,
            title: data.title,
            description: data.description,
            isContractPrice: data.isContractPrice,
            settlementRef: data.settlementRef,
            price: data.price,
            categoryId: data.categoryId,
            filterValueIds: filterValues as [],
            imageFiles: imageFiles,
            contactPersone: data.contactPersone
        }
        const result = id ? await updateAdvert(advertCreationModel) : await createAdvert(advertCreationModel);
        if (!result.error) {
            toast(`Оголошення успішно ${id ? 'оновлено' : 'опубліковане'}`, {
                type: "success"
            })
            navigate('/user')
        }
    }

    const categoryFilters = useMemo(() => {
        const categoryFilters = getAllParentFilterIds(categories || [], selectedCategoryId);
        return <div className="ml-[8vw] flex flex-col gap-[2.5vh]">
            {filters?.length && filters?.filter(x => categoryFilters?.includes(x.id)).map(filter =>
                <Form.Item
                    label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">{filter.name}</div>}
                    key={filter.id}
                    name={filter.id} >
                    <Select
                        popupClassName="create-advert-select-popup"
                        allowClear
                        options={filter.values.map(value => ({ value: value.id, label: value.value }))}
                        placeholder={filter.name}
                        style={{ height: '5vh', width: '23vw' }}
                        className="create-advert-select"
                    />
                </Form.Item>)}
        </div>

    }, [filters, selectedCategoryId])

    useEffect(() => {
        if (advert) {
            setSelectedCategoryId(advert.categoryId)
            const formInitData = {
                isContractPrice: advert?.isContractPrice || false,
                files: advertFiles,
                title: advert?.title || '',
                description: advert?.description || '',
                categoryId: advert?.categoryId,
                phoneNumber: advert?.phoneNumber || '',
                contactEmail: advert?.contactEmail || '',
                settlementRef: advert?.settlementRef || '',
                price: advert?.price,
                contactPersone: advert?.contactPersone || '',
                ...filterFommValues
            }
            form.setFieldsValue(formInitData)
        }
    }, [advert])

    const advertFiles = useMemo(() =>
        advert
            ? advert?.images.slice()
                .sort((a: IAdvertImage, b: IAdvertImage) => a.priority - b.priority)
                .map(x => ({
                    thumbUrl: APP_ENV.IMAGES_200_URL + x.name,
                    url: APP_ENV.IMAGES_1200_URL + x.name,
                    originFileObj: new File([new Blob([''])], x.name, { type: 'image/existing' })
                }) as UploadFile)
            : []
        , [advert])

    const filterFommValues = useMemo(() => {
        return advert?.filterValues.reduce((acc, key) => {
            acc[key.filterId] = key.id
            return acc;
        }, {} as Record<string, any>)
    }, [advert, filters])

    return (
        <>
            <div className="flex w-[100%] items-start flex-col  gap-[5vh]  mb-[18vh]">
                <BackButton className="text-adaptive-1_9_text ml-[9vw] font-medium my-[7.5vh] " title="Назад" />
                <h1 className=" ml-[8vw] font-unbounded text-adaptive-3_35-text">{id ? "Змінити" : "Створити"} оголошення</h1>

                <Form
                    form={form}
                    name="advertForm"
                    onFinish={onFinish}
                    layout="vertical"
                    className=" w-full flex flex-col gap-[4.2vh]"
                    initialValues={{
                        isContractPrice: false,
                        phoneNumber: !id ? user?.phone : undefined,
                        contactEmail: !id ? user?.email : undefined,
                        contactPersone: !id ? getUserDescr(user) : undefined,
                        settlementRef: !id ? user?.settlement : undefined

                    }}>

                    <div className="flex flex-col mx-[8vw] gap-[5.3vh] ">
                        <div className="flex flex-col gap-[0.7vh]">
                            <span className="font-unbounded font-medium text-adaptive-1_7_text">Додати фото</span>
                            <span className="font-montserrat  text-adaptive-1_7_text">Перше фото буде на обкладинці оголошення. Перетягніть, щоб змінити порядок фото.</span>
                        </div>
                        <Form.Item
                            name="files"
                            valuePropName="images"
                            className="custom-form-item"
                            rules={[
                                {
                                    required: true,
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Оберіть як мінімум одине фото</span>
                                },
                            ]}
                        >
                            <UploadWithDnd
                                maxCount={15}
                                columns={5}
                                rowHeight={21}
                                className="gap-[2.5vh]"
                                defaultCount={4} />

                        </Form.Item>
                    </div>
                    <hr className="mb-[2vh]" />

                    <div className="flex flex-col gap-[2.7vh]">
                        <Form.Item
                            name="title"
                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Назва</div>}
                            className="ml-[8vw] custom-form-item"
                            rules={[
                                {
                                    required: true,
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть назву оголошення</span>
                                },
                            ]}
                        >
                            <Input
                                className="h-[5vh] w-[47.3vw] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                placeholder="Назва" />

                        </Form.Item>
                        <Form.Item
                            name="description"
                            label={
                                <div className="mb-[0.5vh] flex flex-col gap-[.8vh]">
                                    <span className="font-unbounded font-medium text-adaptive-1_7_text">Опис</span>
                                    <span className="font-montserrat text-adaptive-1_7_text">Введіть щонайменше 40 символів</span>
                                </div>}
                            className="ml-[8vw] custom-form-item"
                            rules={[
                                {
                                    required: true,
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть опис</span>
                                },
                                {
                                    min: 40,
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть щонайменше 40 символів</span>
                                },
                                {
                                    max: 600,
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Максимум 600 символів</span>
                                },
                            ]}
                        >
                            <TextArea
                                showCount
                                maxLength={600}
                                placeholder="Опис"
                                className="h-[21vh] w-[47.3vw] font-montserrat text-adaptive-1_7_text resize-none border-[#9B7A5B]" />


                        </Form.Item>

                        <Form.Item
                            name="categoryId"
                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Оберіть категорію</div>}
                            className="ml-[8vw] custom-form-item"
                            rules={[
                                {
                                    required: true,
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Оберіть категорію</span>
                                },
                            ]}
                        >
                            <TreeSelect
                                popupClassName="create-advert-select-popup"
                                allowClear
                                showSearch
                                loading={isCategoriesLoading}
                                style={{ height: '5vh', width: '47.3vw' }}
                                className="create-advert-select"
                                treeData={getCategoryTree}
                                placeholder="Оберіть категорію"
                                onChange={(categoryId: number) => setSelectedCategoryId(categoryId)}
                            />
                        </Form.Item>

                    </div>
                    <hr className="mb-[2vh]" />

                    <div className="flex flex-col ml-[8vw]">
                        <Form.Item
                            name="price"
                            className="custom-form-item"
                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text">Ціна</div>}
                            rules={[
                                {
                                    required: true,
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть ціну</span>
                                },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                className="h-[5vh] w-[23vw] font-montserrat create-advert-number-input"
                                placeholder="Ціна" />

                        </Form.Item>

                        <Form.Item
                            noStyle
                            name="isContractPrice"
                            valuePropName="checked">
                            <Checkbox
                                className="filter-checkbox "
                                style={{ fontSize: 'clamp(14px, 1.7vh, 36px)' }}>
                                Договірна ціна
                            </Checkbox>

                        </Form.Item>
                    </div>

                    {categoryFilters}
                    <hr className="mb-[2vh]" />
                    <div className='grid grid-cols-2 gap-y-[1.2vw] ml-[8vw] w-[47.3vw]  gap-x-[2.1vw]'>
                        <Form.Item
                            name="contactPersone"
                            className="w-full custom-form-item"
                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Контактна персона</div>}
                            rules={[
                                {
                                    required: true,
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть контактну персону</span>
                                },
                            ]}
                        >
                            <Input
                                className="h-[5vh]  font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                placeholder="Контактна персона" />

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
                            <InputMask
                                mask="+38 (999) 999-99-99"
                                maskChar=""
                                disabled={false}
                                
                            >
                                {( inputProps:any ) =>
                                  <input {...inputProps}
                                        placeholder="Номер телефону"
                                        className="h-[5vh] border-[1px]  border-[#9B7A5B] w-full rounded-md pl-3 focus:outline-none focus:border-[#9B7A5B] focus:border-[1px] font-montserrat text-adaptive-1_6-text " />}
                            </InputMask>
                        </Form.Item>

                        <Form.Item
                            name="contactEmail"
                            className="w-full custom-form-item"
                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Електронна пошта</div>}
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

                        <Form.Item
                            name="settlementRef"
                            className="w-full custom-form-item"
                            label={<div className="font-unbounded font-medium text-adaptive-1_7_text mb-[0.5vh]">Місцезнаходження</div>}
                            rules={[
                                {
                                    required: true,
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Оберіть місцезнаходження</span>
                                },
                            ]}
                        >
                            <LocationSelector
                                placeholder="Місцезнаходження"
                                height="5vh"
                                width="100%" />
                        </Form.Item>
                    </div>

                    <PrimaryButton
                        title={id ? advert?.completed ? 'Завантажити повторно' : 'Зберегти' : 'Завантажити'}
                        htmlType="submit"
                        isLoading={isAdvertCreation || isAdvertEdition}
                        className="w-[15vw]  ml-[8vw] h-[4.6vh] mt-[3vh]"
                        fontColor="white"
                        fontSize="clamp(14px,1.9vh,36px)"
                        bgColor="#9B7A5B"
                        brColor="#9B7A5B" />

                </Form>
            </div>
        </>)
}

export default CreateAdvert