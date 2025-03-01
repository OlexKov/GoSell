import React from 'react'
import { PrimaryButtonProps } from './props'
import { Button } from 'antd'
import './style.scss'

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ disabled, fontSize, onButtonClick = () => { }, className = '', title, brColor = '#FFBA00', bgColor = '#FFBA00', fontColor = '#3A211C', isLoading, htmlType = "button" }) => {
  return (
    <Button
      loading={isLoading}
      onClick={onButtonClick}
      htmlType={htmlType}
      disabled={disabled}
      style={{
        fontSize: fontSize,
        backgroundColor: bgColor,
        color: fontColor,
        borderColor: brColor
      }}
      className={`primary-button rounded-[8px] min-w-[140px] min-h-[30px] text-adaptive-text font-normal font-montserrat leading-[28px] ${disabled ? 'opacity-40' : '' } hover:shadow-xl ${className}`}>
      {title}
    </Button>
  )
}

export default PrimaryButton