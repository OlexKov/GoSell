import React, { useState } from 'react'
import './style.scss'
import { Input } from 'antd'
import { SearchOutlined } from '@mui/icons-material'
import { SearchInputProps } from './props'
import { useNavigate } from 'react-router-dom'

const SearchInput: React.FC<SearchInputProps> = ({ className }) => {
    const [search,setSearch] = useState<string>('')
    const navigate = useNavigate()
    const onEnterPress = () => {
        navigate(`/adverts?search=${search}`)
        setSearch('')
    }
    return (
        <div className='search-input'>
            <Input className={` rounded-[.7vh] ${className} pl-[1vw] min-h-[30px] w-[38vw] h-[4.5vh] text-[#BB8A52] text-adaptive-input-form-text leading-6`}
                value={search}
                placeholder="Пошук"
                prefix={<SearchOutlined style={{ fontSize: "clamp(20px, 4vh, 36px)" }} />}
                onChange={(e) => setSearch(e.target.value)}
                onPressEnter={onEnterPress} />
        </div>
    )
}

export default SearchInput