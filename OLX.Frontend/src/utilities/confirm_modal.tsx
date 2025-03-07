import { Modal } from "antd";
import { ReactNode } from "react";


interface IConfirmData{
    title?:string | ReactNode,
    content?:string|ReactNode,
    onOk?:()=>void,
    okText?:string ,
    cancelText?:string 
    onCancel?:()=>void
}

export const confirm = ( confirmData:IConfirmData ) =>{
    Modal.confirm({
        centered: true,
        closable: true,
        destroyOnClose: true,
        maskClosable: true,
        keyboard: true,
        okType: 'danger',
        width: 'auto',
        title: confirmData.title ,
        content: confirmData.content,
        cancelText: confirmData.cancelText || "Скасувати",
        okText: confirmData.okText || 'Підтвердити',
        footer: (_, { OkBtn, CancelBtn }) => (<><CancelBtn /><OkBtn /></>),
        onOk: confirmData.onOk
    })
}