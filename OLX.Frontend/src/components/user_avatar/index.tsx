import { Avatar } from "antd";
import { IUserAvatarProps } from "./props";
import { getNameInitials, getUserDescr, stringToColor } from "../../utilities/common_funct";
import { APP_ENV } from "../../constants/env";
import { useMemo } from "react";




const UserAvatar: React.FC<IUserAvatarProps> = ({ user, size, className, imageSize }) => {

    const getImage = useMemo((): string => {
        let size = ''
        switch (imageSize) {
            case "200":
                size = APP_ENV.IMAGES_200_URL
                break;
            case "400":
                size = APP_ENV.IMAGES_400_URL
                break;
            case "800":
                size = APP_ENV.IMAGES_800_URL
                break;
            case "1200":
                size = APP_ENV.IMAGES_1200_URL
                break;
            default:
                size = APP_ENV.IMAGES_100_URL
        }
        return size
    }, [imageSize])

    if (user) {
        if (user.photo) {
            return <Avatar className={`flex-shrink-0 ${className}`} size={size} src={getImage + user.photo} />
        }
        const userDesc = getUserDescr(user);
        const color = stringToColor(userDesc);
        return <Avatar size={size} className={`${className}`} style={{ backgroundColor: color, verticalAlign: 'middle', flexShrink: 0 }} >
            <div  className="h-full w-full p-[10vh] text-[50vh] font-montserrat">{getNameInitials(userDesc)}</div>
        </Avatar>
    }
    return null;
};

export default UserAvatar;