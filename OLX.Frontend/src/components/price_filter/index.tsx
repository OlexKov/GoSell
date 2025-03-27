import { Button, Form, InputNumber, Radio } from "antd"
import './style.scss'
import '../../pages/user/create_advert/style.scss'
import { PriceFilterProps } from "./props"

const PriceFilter: React.FC<PriceFilterProps> = ({ className, onChange, onReset: onClear }) => {
     
    return (
        <div className={` ${className}`}>
            <h5 className="font-unbounded text-adaptive-1_6-text  mb-[1.5vh] "> Ціна</h5>

            <Form.Item
                noStyle
                name="isContractPrice"
            >
                <Radio.Group
                    onChange={onChange}
                    className="mb-[1vh] font-unbounded filter-radio flex flex-col gap-[.3vh]">
                    <Radio value={undefined}>Всі</Radio>
                    <Radio value={true}>Договірна</Radio>
                    <Radio value={false}>Не договірна</Radio>
                </Radio.Group>
            </Form.Item>

            <div className="flex justify-start gap-[0.5vw]">
                <Form.Item
                    noStyle
                    name="priceFrom"
                >
                    <InputNumber
                        min={0}
                        placeholder="від"
                        onPressEnter={onChange}
                        className="h-[3vh] font-montserrat create-advert-number-input"
                    />
                </Form.Item>
                <Form.Item
                    noStyle
                    name="priceTo"
                >
                    <InputNumber
                        min={0}
                        placeholder="до"
                        onPressEnter={onChange}
                        className="h-[3vh] font-montserrat create-advert-number-input"
                    />

                </Form.Item>
            </div>
            <Button
                size="small"
                className=" self-start p-0  text-[red] mt-[1vh]"
                type='link'
                onClick={() => onClear && onClear(-1)}>
                Очистити
            </Button>
        </div>
    )
}

export default PriceFilter