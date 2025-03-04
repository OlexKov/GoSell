import { IChat } from "../../../models/chat"

export interface ChatCardProps {
    chat: IChat
    className?: string
    selected?: boolean
    onClick?: (chat: IChat) => void
}