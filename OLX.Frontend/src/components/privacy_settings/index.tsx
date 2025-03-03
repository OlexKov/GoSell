import { Form, Radio } from "antd"
import '../price_filter/style.scss' 
import PrimaryButton from "../buttons/primary_button"
import { useAppSelector } from "../../redux"
import { useEffect, useState } from "react"

const PrivacySettings = () => {
    const user = useAppSelector(state => state.user.user);
    const defaultSettings = {
        visibility: "public-profile",
        contactDetails: "all-users",
        advertise: "enabled"
    };
    const storageKey = `privacySettings_${user?.id}`;

    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem(storageKey);
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    });

    useEffect(() => {
        const savedSettings = localStorage.getItem(storageKey);
        setSettings(savedSettings ? JSON.parse(savedSettings) : defaultSettings);
    }, [user]);

    const handleSave = (values : any) => {
        localStorage.setItem(storageKey, JSON.stringify(values));
    };
    return (
        <div className="w-full">
            <Form
                layout="vertical"
                className="flex flex-col gap-[7vh] mb-[10vh]"
                initialValues={settings}
                onFinish={handleSave}
            >
                <Form.Item
                    name="visibility"
                    label={<span className="text-[#3a211c] text-[2vh] font-medium font-unbounded leading-tight mb-[4vh]">Видимість профілю</span>}
                >
                    <Radio.Group className="flex flex-col gap-[3.2vh]">
                        <div className="flex flex-col">
                            <Radio className="big-radio text-[2vh] font-medium font-montserrat leading-tight" key="public-profile" value="public-profile">Публічний профіль</Radio>
                            <span className="text-[1.7vh] font-normal font-montserrat ml-[35px]">Ваше ім'я та фото будуть видимі усім користувачам</span>
                        </div>
                        <div className="flex flex-col">
                            <Radio className="big-radio text-[2vh] font-medium font-montserrat leading-tight" key="private-profile" value="private-profile">Приватний профіль</Radio>
                            <span className="text-[1.7vh] font-normal font-montserrat ml-[35px]">Ваше ім'я та фото будуть доступні лише тим, з ким ви зв'язалися</span>
                        </div>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="contactDetails"
                    label={
                        <div className="flex flex-col">
                            <span className="text-[#3a211c] text-[2vh] font-medium font-unbounded leading-tight">Контактні дані</span>
                            <span className="text-[1.7vh] font-normal font-montserrat mb-[4vh]">Оберіть, хто може бачити ваші контактні дані</span>
                        </div>
                    }
                >
                    <Radio.Group className="flex flex-col gap-[3.2vh]">
                        <Radio className="big-radio text-[2vh] font-medium font-montserrat leading-tight" key="all-users" value="all-users">Усі користувачі</Radio>
                        <Radio className="big-radio text-[2vh] font-medium font-montserrat leading-tight" key="registered-users" value="registered-users">Лише зареєстровані користувачі</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="advertise"
                    label={<span className="text-[#3a211c] text-[2vh] font-medium font-unbounded leading-tight mb-[4vh]">Сповіщення та рекламні пропозиції</span>}
                >
                    <Radio.Group className="flex flex-col gap-[3.2vh]">
                        <Radio className="big-radio text-[2vh] font-medium font-montserrat leading-tight" key="enabled" value="enabled">Отримувати повідомлення про нові пропозиції та акції</Radio>
                        <Radio className="big-radio text-[2vh] font-medium font-montserrat leading-tight" key="disabled" value="disabled">Відключити рекламні розсилки</Radio>
                        <Radio className="big-radio text-[2vh] font-medium font-montserrat leading-tight" key="necessary" value="necessary">Отримувати лише важливі повідомлення щодо безпеки акаунту</Radio>
                    </Radio.Group>
                </Form.Item>

                <PrimaryButton
                    title={'Зберегти'}
                    isLoading={false}
                    htmlType="submit"
                    className="w-[15vw] ml-auto mt-[0.5vh] h-[4.6vh]"
                    fontColor="white"
                    fontSize="clamp(1.4vh, 1.9vh, 3.6vh)"
                    bgColor="#9B7A5B"
                    brColor="#9B7A5B"
                />
            </Form>
        </div>
    )
}

export default PrivacySettings
