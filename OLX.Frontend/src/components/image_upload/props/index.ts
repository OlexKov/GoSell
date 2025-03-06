import { UploadFile } from "antd"


export interface UploadWithDndProps {
    name?:string,
    images?: UploadFile[]
    onChange?: (files: UploadFile[]) => void
    uploadSize?: number
    className?: string
    maxCount?: number
    defaultCount?: number
    columns?: number
    rowHeight?: number
}