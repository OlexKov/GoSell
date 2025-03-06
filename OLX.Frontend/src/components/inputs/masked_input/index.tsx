import { forwardRef } from "react";
import InputMask from "react-input-mask";
import { MaskedInputProps } from "./props";

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(({ name, mask, maskChar, placeholder, className, disabled, value, onChange }, ref) => {
    return <InputMask
        value={value}
        onChange={onChange}
        disabled={disabled}
        name={name}
        mask={mask}
        maskChar={maskChar}
    >
        {({ props }) =>
            <input {...props}
                disabled={disabled}
                ref={ref}
                name={name}
                placeholder={placeholder}
                className={className} />}
    </InputMask>
});

export default MaskedInput;