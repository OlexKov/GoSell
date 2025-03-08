import { Tabs } from "antd";
import './style.scss'
import { BackButton } from "../../../components/buttons/back_button";
import UserEdit from "../../../components/user_settings/profile_edit";
import PrivacySettings from "../../../components/privacy_settings";
import PaymentHistory from "../../../components/payment_history";

const UserProfileEdit: React.FC = () => {

    const items = [
        {
            key: "1",
            label: "Основна інформація",
            children:<UserEdit/>
        },
        {
            key: "2",
            label: "Історія платежів",
            children:
                <PaymentHistory />
        },
        {
            key: "3",
            label: "Налаштування конфіденційності",
            children:
                <PrivacySettings />
        },
    ];
    return (
        <div className="w-[100%] gap-[5vh] mx-[8vw] flex flex-col">
            <BackButton className="text-adaptive-1_9_text my-[7.5vh] font-medium self-start" title="Назад" />
            <h1 className="font-unbounded text-adaptive-3_35-text mt-[1.8vh]">Мої налаштування</h1>
            <Tabs
                className="settings-tabs w-full font-montserrat"
                defaultActiveKey="1"
                tabPosition="left"
                tabBarStyle={{ width: '42%' }}
                animated={true}
                tabBarGutter={0}
                items={items}
            />
        </div>
    )
}

export default UserProfileEdit