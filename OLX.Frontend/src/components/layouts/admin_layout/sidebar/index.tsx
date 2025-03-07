import { Divider } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { AdminSideBarMenu } from "../menu";
import { IUser } from "../../../../models/account";
import { useSelector } from "react-redux";
import './sidebar.scss'
import { getUser } from "../../../../redux/slices/userSlice";
import { getUserDescr } from "../../../../utilities/common_funct";
import UserAvatar from "../../../user_avatar";


export const SideBar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const user: IUser | null = useSelector(getUser)
  return (
    <Sider
      width={280}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}>
      <div className="flex flex-col">
        <div className={` flex p-3 gap-5 ${collapsed ? ' justify-center' : ''} items-center overflow-hidden user-container`}>
          <UserAvatar className=" flex-shrink-0" size={collapsed ? 46 : 84} user={user} />
          {!collapsed &&
            <div className="flex flex-col gap-1">
              <span className='flex-shrink-0 font-bold text-lime-300 text-lg text-nowrap'>{getUserDescr(user)}</span>
              <span className=" animate-pulse text-green-400">Online</span>
            </div>}
        </div>
        {!collapsed &&
          <>
              <Divider type="horizontal" variant="solid" className="border-red-400 m-0 p-0 mb-7" />
          </>}
      </div>
      <AdminSideBarMenu collapsed={collapsed} />
    </Sider>)
}