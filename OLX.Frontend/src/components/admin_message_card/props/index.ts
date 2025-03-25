import { IAdminMesssage } from "../../../models/adminMesssage"

export interface AdminMessageCardProps {
    adminMessage: IAdminMesssage
    divider?: boolean
    className?: string
    dividerClassName?: string
    onDelete?: (id: number) => void
    onClick?: (id: number) => void
}