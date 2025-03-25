import { Menu } from "antd";
import {
    ContainerOutlined,
    FileDoneOutlined,
    FilterOutlined,
    HddOutlined,
    LockOutlined,
    MailOutlined,
    ProfileOutlined,
    RobotOutlined,
    SnippetsOutlined,
    SolutionOutlined,
    TeamOutlined,
    TwitchOutlined,
    UserAddOutlined,
    UserOutlined
} from '@ant-design/icons';
import './style.scss'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MenuData, MenuItem } from "./models";
import { MenuProps } from "./props";



const getOpenMenuItem = (location: string, items: MenuItem[]): string[] => {
    const key = items.filter(x => x.children?.some(z => z.key === location))[0]?.key || undefined
    return key ? [key] : []
}

const items: MenuItem[] = [
    {
        key: "admin_main",
        icon: <TeamOutlined style={{ fontSize: 20 }} />,
        label: <span className='text-base font-medium'>Користувачі</span>,
        children: [
            {
                key: "/admin",
                icon: <UserOutlined style={{ fontSize: 16 }} />,
                label: <span className='text-sm font-medium'>Всі</span>,
            },
            {
                key: "/admin/adverts/blocked",
                icon: <LockOutlined style={{ fontSize: 16 }} />,
                label: <span className='text-sm font-medium'>Заблковані</span>,
            }
        ]

    },
    {
        key: "adverts_main",
        icon: <SolutionOutlined style={{ fontSize: 20 }} />,
        label: <span className='text-base font-medium'>Оголошення</span>,
        children: [
            {
                key: "/admin/adverts",
                icon: <SnippetsOutlined style={{ fontSize: 16 }} />,
                label: <span className='text-sm font-medium'>Діючі</span>,
            },
            {
                key: "/admin/adverts/approve",
                icon: <FileDoneOutlined style={{ fontSize: 16 }} />,
                label: <span className='text-sm font-medium'>Не підтверджені</span>,
            },
        ]

    },
    {
        key: "categories_main",
        icon: <ProfileOutlined style={{ fontSize: 20 }} />,
        label: <span className='text-base font-medium'>Категорії</span>,
        children: [
            {
                key: "/admin/categories",
                icon: <ProfileOutlined style={{ fontSize: 16 }} />,
                label: <span className='text-sm font-medium'>Всі</span>,
            }
        ]
    },

    {
        key: "filters_main",
        icon: <FilterOutlined style={{ fontSize: 20 }} />,
        label: <span className='text-base font-medium'>Фільтри</span>,
        children: [
            {
                key: "/admin/filters",
                icon: <FilterOutlined style={{ fontSize: 16 }} />,
                label: <span className='text-sm font-medium'>Всі</span>,
            }
        ]
    },
    {
        key: "admins_main",
        icon: <RobotOutlined style={{ fontSize: 20 }} />,
        label: <span className='text-base font-medium'>Адміністратор</span>,
        children: [
            {
                key: "/admin/admins",
                icon: <RobotOutlined style={{ fontSize: 16 }} />,
                label: <span className='text-sm font-medium'>Адміністратори</span>,
            },
            {
                key: "/admin/admins/new",
                icon: <UserAddOutlined style={{ fontSize: 16 }} />,
                label: <span className='text-sm font-medium'>Додати</span>,
            }
        ]
    }
    ,
    {
        key: "backup_main",
        icon: <HddOutlined style={{ fontSize: 20 }} />,
        label: <span className='text-base font-medium'>База даних</span>,
        children: [
            {
                key: "/admin/backup",
                icon: <ContainerOutlined  style={{ fontSize: 16 }} />,
                label: <span className='text-sm font-medium'>Копії та відновлення</span>,
            }
        ]
    }
    ,
    {
        key: "messages_main",
        icon: <MailOutlined style={{ fontSize: 20 }} />,
        label: <span className='text-base font-medium'>Повідмлення</span>,
        children: [
            {
                key: "/admin/messages",
                icon: <TwitchOutlined  style={{ fontSize: 16 }} />,
                label: <span className='text-sm font-medium'>Всі</span>,
            }
        ]
    }
]

export const AdminSideBarMenu: React.FC<MenuProps> = ({ collapsed }) => {
    const navigate = useNavigate();
    const [menuData, setMenuData] = useState<MenuData>(({
        selected: location.pathname,
        openKeys: getOpenMenuItem(location.pathname, items)
    }))

    const handleSelect = ({ key, keyPath }: { key: string, keyPath: string[] }) => {
        setMenuData(({ selected: key, openKeys: keyPath.slice(1) }));
        navigate(key)
    };

    const handleOnOpen = (keys: string[]) => {
        setMenuData(prev => ({ ...prev, openKeys: keys }));
    }

    useEffect(() => {
        if (!collapsed) {
            setTimeout(() => {
                const openKey = getOpenMenuItem(location.pathname, items);
                setMenuData(prev => ({ ...prev,selected:location.pathname, openKeys: openKey }));
            }, 400);
        }
    }, [collapsed, location.pathname])

    return (
        <Menu
            theme="dark"
            mode="inline"
            items={items}
            openKeys={menuData.openKeys}
            onOpenChange={handleOnOpen}
            onSelect={handleSelect}
            selectedKeys={[menuData.selected]

            }
        />
    )
}