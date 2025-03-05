import { useEffect, useMemo, useState } from "react"
import { useAppSelector } from "../../../../redux"
import { useGetAdvertByIdQuery } from "../../../../redux/api/advertApi"
import { useGetChatsQuery } from "../../../../redux/api/chatAuthApi"
import { getUserDescr } from "../../../../utilities/common_funct"
import { IChat } from "../../../../models/chat"
import { IAdvert } from "../../../../models/advert"

const createNewChat = (userId: number, advert: IAdvert | undefined): IChat => {
    return {
        id: 0,
        sellerUnreaded: 0,
        buyerUnreaded: 0,
        buyer: {
            id: userId,
            photo: undefined,
            description: ''
        },
        seller: {
            id: advert?.user?.id || 0,
            photo: advert?.user?.photo,
            description: getUserDescr(advert?.user)
        },
        createAt: new Date(Date.now()).toISOString(),
        advert: {
            id: advert?.id || 0,
            image: advert?.images.find(x => x.priority === 0)?.name || '',
            title: advert?.title || '',
            price: advert?.price || 0
        }
    }
}

const useGetChats = (advertId: number | undefined) => {
    const user = useAppSelector(state => state.user.user)
    const { data: advert } = useGetAdvertByIdQuery(advertId || 0, { skip: !advertId })
    const { data: chatsData } = useGetChatsQuery(advertId)
    const [chats, setChats] = useState<IChat[]>([])
    
    const chatItems = useMemo(() => {
        let items = chatsData
            ? !advertId || chatsData.some(x => x.advert.id === advertId)
                ? chatsData
                : [createNewChat(user?.id || 0, advert), ...chatsData]
            : []
        return items.length > 0
            ? items.slice().sort((a: IChat, b: IChat) => b.createAt.localeCompare(a.createAt))
            : []
    }, [advertId, chatsData])
    useEffect(() => {
        setChats(chatItems)
    }, [chatItems, advert, advertId])

    return { chats }
}

export default useGetChats