import AdminEdit from "../../../../components/admin_edit";
import { PageHeader } from "../../../../components/page_header";
import { UserAddOutlined, UserSwitchOutlined } from '@ant-design/icons';
const AdminCreate: React.FC = () => {

    return (
        <div className="m-6 flex-grow ">
            <PageHeader
                title={location.pathname === '/admin/admins/new'
                    ? `Новий адміністратор`
                    : 'Налаштування профілю'}
                icon={location.pathname === '/admin/admins/new'
                    ? <UserAddOutlined className="text-2xl" />
                    : <UserSwitchOutlined className="text-2xl" />}
            />
            <div className="bg-white py-16 px-80">
                <AdminEdit />
            </div>
        </div>)
};

export default AdminCreate;