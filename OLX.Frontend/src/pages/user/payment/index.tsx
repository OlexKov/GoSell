import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useGetAdvertByIdQuery } from "../../../redux/api/advertApi";
import { BackButton } from "../../../components/buttons/back_button";
import AdvertCard from "../../../components/advert_card";
import { DatePicker, Form, Input, Radio } from "antd";
import PrimaryButton from "../../../components/buttons/primary_button";
import '../../../components/price_filter/style.scss'
import './styles.scss'
import MaskedInput from "../../../components/inputs/masked_input";

const PaymentPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams('');
    const { data: advert } = useGetAdvertByIdQuery(Number(id), { skip: !id });
    const [paymentMethod, setPaymentMethod] = useState("bank-card");
    const navigate = useNavigate();

    const onFinish = (data: any) => {
        console.log({ ...data, ...Object.fromEntries(searchParams.entries()) });
        navigate(`/user/advert/paymentsuccess`);
    };

    return (
        <div className="w-[100%] mx-[8vw] flex flex-col">
            <BackButton className="text-adaptive-1_9_text my-[7.5vh] ml-[1vw] font-medium self-start" title="Назад" />
            <div className="grid grid-cols-[20.5vw,34.4vw] gap-[8vw] mt-[5vh] mb-[15vh]">
                <AdvertCard
                    advert={advert}
                    isFavorite={false}
                />
                <div className="flex flex-col">
                    <h1 className="font-unbounded text-adaptive-3_35-text mb-[1.4vh]">Оплата</h1>
                    <span className="font-montserrat text-adaptive-1_7_text">Оберіть зручний спосіб оплати</span>
                    <Form
                        layout="vertical"
                        className="payment-form flex flex-col h-full custom-form-item-error"
                        onFinish={onFinish}
                        scrollToFirstError={true}
                        initialValues={{
                            payment: "bank-card"
                        }}
                    >
                        <Form.Item name="payment" className="my-[4.6vh]">
                            <Radio.Group
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <Radio className="big-radio" key="bank-card" value="bank-card" style={{ fontSize: 'clamp(14px, 1.9vh, 36px)', fontWeight: 500 }}>
                                    Банківська карта
                                </Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name="cardholder-name"
                            className="mb-[3vh]"
                            rules={[
                                {
                                    required: paymentMethod === "bank-card",
                                    message: 'Заповніть поле'
                                },
                            ]}
                        >
                            <Input
                                disabled={paymentMethod === "postpaid"}
                                className="h-[5vh] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                placeholder="Внесіть ім'я власника карти"
                            />
                        </Form.Item>

                        <div className="flex justify-between">
                            <Form.Item
                                name="card-number"
                                rules={[
                                    {
                                        required: paymentMethod === "bank-card",
                                        message: 'Введіть номер карти'
                                    },
                                    {
                                        min: 19,
                                        message: 'Не вірний номер картки'
                                    },
                                ]}
                            >
                                <MaskedInput
                                    mask="9999 9999 9999 9999"
                                    maskChar=""
                                    disabled={paymentMethod === "postpaid"}
                                    placeholder="Номер карти"
                                    className="w-[15.6vw] h-[5vh] border-[1px]  border-[#9B7A5B]  rounded-md pl-3 focus:outline-none focus:border-[#9B7A5B] focus:border-[1px] font-montserrat text-adaptive-1_6-text "
                                />


                            </Form.Item>
                            <Form.Item
                                name="expiry-date"
                                rules={[
                                    {
                                        required: paymentMethod === "bank-card",
                                        message: 'Введіть дату'
                                    },
                                ]}
                            >
                                <DatePicker
                                    disabled={paymentMethod === "postpaid"}
                                    suffixIcon={null}
                                    className="h-[5vh] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                    placeholder="MM/YY"
                                    format={'MM/YY'}
                                    picker="month"
                                />
                            </Form.Item>
                            <Form.Item
                                name="verification-code"
                                rules={[
                                    {
                                        required: paymentMethod === "bank-card",
                                        message: 'Введіть CVV'
                                    },
                                    {
                                        min: 3,
                                        message: '3 символи'
                                    },
                                ]}
                            >
                                <MaskedInput
                                    mask="999"
                                    maskChar=""
                                    disabled={paymentMethod === "postpaid"}
                                    placeholder="CVV"
                                    className="w-[6.4vw] h-[5vh] border-[1px]  border-[#9B7A5B]  rounded-md pl-3 focus:outline-none focus:border-[#9B7A5B] focus:border-[1px] font-montserrat text-adaptive-1_6-text "
                                />


                            </Form.Item>
                        </div>

                        <Form.Item name="payment" className="mt-[7vh]">
                            <Radio.Group
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <Radio className="big-radio" key="postpaid" value="postpaid" style={{ fontSize: 'clamp(14px, 1.9vh, 36px)', fontWeight: 500 }}>
                                    Післяплата
                                </Radio>
                            </Radio.Group>
                        </Form.Item>

                        <PrimaryButton
                            title="Продовжити"
                            htmlType="submit"
                            isLoading={false}
                            className="w-full h-[4.6vh] mt-auto"
                            fontColor="white"
                            fontSize="clamp(14px,1.9vh,36px)"
                            bgColor="#9B7A5B"
                            brColor="#9B7A5B"
                        />
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
