export interface MaskedInputProps {
    name?: string
    mask: string
    maskChar?: string
    placeholder?: string
    className?: string
    disabled?: boolean
    value?: string
    onChange?: () => void
}
