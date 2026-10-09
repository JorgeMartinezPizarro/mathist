import { ReactNode } from "react";

interface FieldProps {
    label: string;
    children: ReactNode;
}

// A labelled form control: <input>, <select>...
export const Field = ({ label, children }: FieldProps) =>
    <label className="field">
        <span>{label}</span>
        {children}
    </label>

interface DigitsFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    digits?: string;
    maxLength?: number;
    disabled?: boolean;
}

// Text input that only accepts the given digits, e.g. "012" for base 3 paths.
// Big integers do not fit in <input type="number">, so they stay as text.
export const DigitsField = ({ label, value, onChange, digits = "0123456789", maxLength, disabled }: DigitsFieldProps) => {
    const allowed = new RegExp("^[" + digits + "]*$")

    return <Field label={label}>
        <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={value}
            maxLength={maxLength}
            disabled={disabled}
            onChange={event => {
                if (allowed.test(event.target.value)) {
                    onChange(event.target.value)
                }
            }}
        />
    </Field>
}
