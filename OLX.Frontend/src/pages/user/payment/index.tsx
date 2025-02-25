import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useGetAdvertByIdQuery } from "../../../redux/api/advertApi";
import { BackButton } from "../../../components/buttons/back_button";
import AdvertCard from "../../../components/advert_card";
import { APP_ENV } from "../../../constants/env";
import { DatePicker, Form, Input, Radio } from "antd";
import PrimaryButton from "../../../components/buttons/primary_button";
import '../../../components/price_filter/style.scss'
import './styles.scss'

const PaymentPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams('');
    const { data: advert } = useGetAdvertByIdQuery(Number(id));
    const [paymentMethod, setPaymentMethod] = useState("bank-card");
    const navigate = useNavigate();
    
    const onFinish = (data: any) => {
        console.log({...data,...Object.fromEntries(searchParams.entries())});
         navigate(`/user/advert/paymentsuccess`);
    };

    return (
        <div className="w-[100%] mx-[8vw] flex flex-col">
            <BackButton className="text-adaptive-1_9_text my-[7.5vh] ml-[1vw] font-medium self-start" title="Назад" />
            <div className="grid grid-cols-[20.5vw,34.4vw] gap-[8vw] mt-[5vh] mb-[15vh]">
                <AdvertCard
                    id={Number(id)}
                    image={APP_ENV.IMAGES_400_URL + advert?.images.find(x => x.priority === 0)?.name}
                    title={advert?.title || ''}
                    price={advert?.price || 0}
                    settlement={advert?.settlementName || ''}
                    isFavorite={false}
                />
                <div className="flex flex-col">
                    <h1 className="font-unbounded text-adaptive-3_35-text mb-[1.4vh]">Оплата</h1>
                    <span className="font-montserrat text-adaptive-1_7_text">Оберіть зручний спосіб оплати</span>
                    <Form
                        layout="vertical"
                        className="payment-form flex flex-col h-full "
                        onFinish={onFinish}
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
                                    message: <span className="font-montserrat text-adaptive-input-form-error-text">Заповніть поле</span>
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
                                        message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть номер карти</span>
                                    },
                                    {
                                        min: 16,
                                        message: <span className="font-montserrat text-adaptive-input-form-error-text">Мінімум 16 символів</span>,
                                    },
                                ]}
                            >
                                <Input
                                    disabled={paymentMethod === "postpaid"}
                                    maxLength={19}
                                    className="w-[15.6vw] h-[5vh] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                    placeholder="Номер карти"
                                />
                            </Form.Item>
                            <Form.Item
                                name="expiry-date"
                                rules={[
                                    {
                                        required: paymentMethod === "bank-card",
                                        message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть дату</span>
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
                                        message: <span className="font-montserrat text-adaptive-input-form-error-text">Введіть CVV</span>
                                    },
                                    {
                                        len: 3,
                                        message: <span className="font-montserrat text-adaptive-input-form-error-text">3 символи</span>,
                                    },
                                ]}
                            >
                                <Input
                                    disabled={paymentMethod === "postpaid"}
                                    maxLength={3}
                                    className="w-[6.4vw] h-[5vh] font-montserrat text-adaptive-1_6-text border-[#9B7A5B]"
                                    placeholder="CVV"
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
