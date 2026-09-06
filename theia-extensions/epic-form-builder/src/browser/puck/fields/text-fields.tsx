import {
    BaseFieldProps,
    commonDefaultProps,
    commonFieldDefs,
    FieldShell,
    fieldHtmlId,
    INPUT_CLASS,
} from './field-shell';

export interface TextLikeFieldProps extends BaseFieldProps {
    placeholder?: string;
}

export interface NumberFieldProps extends TextLikeFieldProps {
    min?: number;
    max?: number;
}

/**
 * Every text-like input (text/email/password/date/number/textarea) shares
 * the exact same shell + fields, only the rendered control differs. This
 * factory keeps the six component definitions declarative and DRY.
 */
function makeTextLikeField(options: {
    label: string;
    inputType: 'text' | 'email' | 'password' | 'date' | 'number';
    defaultLabel: string;
    defaultName: string;
}) {
    return {
        label: options.label,
        fields: {
            ...commonFieldDefs,
            placeholder: { type: 'text' as const, label: 'Placeholder' },
            ...(options.inputType === 'number'
                ? {
                      min: { type: 'number' as const, label: 'Minimum value' },
                      max: { type: 'number' as const, label: 'Maximum value' },
                  }
                : {}),
        },
        defaultProps: {
            ...commonDefaultProps,
            label: options.defaultLabel,
            name: options.defaultName,
            placeholder: '',
        },
        // See the comment in actions.tsx for why `props` is untyped here and
        // narrowed with a cast instead of a parameter annotation.
        render: (props: unknown) => {
            const { label, name, placeholder, helperText, required, min, max, id } = props as NumberFieldProps & { id: string };
            const htmlId = fieldHtmlId(name, id);
            return (
                <FieldShell label={label} htmlFor={htmlId} required={required} helperText={helperText}>
                    <input
                        id={htmlId}
                        name={name}
                        type={options.inputType}
                        placeholder={placeholder || undefined}
                        required={required}
                        min={options.inputType === 'number' ? min : undefined}
                        max={options.inputType === 'number' ? max : undefined}
                        className={INPUT_CLASS}
                    />
                </FieldShell>
            );
        },
    };
}

export const textFieldComponents = {
    TextInput: makeTextLikeField({
        label: 'Text Input',
        inputType: 'text',
        defaultLabel: 'Short answer',
        defaultName: 'short_answer',
    }),

    EmailInput: makeTextLikeField({
        label: 'Email Input',
        inputType: 'email',
        defaultLabel: 'Email address',
        defaultName: 'email',
    }),

    PasswordInput: makeTextLikeField({
        label: 'Password Input',
        inputType: 'password',
        defaultLabel: 'Password',
        defaultName: 'password',
    }),

    DateInput: makeTextLikeField({
        label: 'Date Input',
        inputType: 'date',
        defaultLabel: 'Date',
        defaultName: 'date',
    }),

    NumberInput: makeTextLikeField({
        label: 'Number Input',
        inputType: 'number',
        defaultLabel: 'Number',
        defaultName: 'number',
    }),

    Textarea: {
        label: 'Textarea',
        fields: {
            ...commonFieldDefs,
            placeholder: { type: 'text' as const, label: 'Placeholder' },
            rows: { type: 'number' as const, label: 'Rows' },
        },
        defaultProps: {
            ...commonDefaultProps,
            label: 'Long answer',
            name: 'long_answer',
            placeholder: '',
            rows: 4,
        },
        render: (props: unknown) => {
            const { label, name, placeholder, helperText, required, rows, id } = props as TextLikeFieldProps & {
                rows?: number;
                id: string;
            };
            const htmlId = fieldHtmlId(name, id);
            return (
                <FieldShell label={label} htmlFor={htmlId} required={required} helperText={helperText}>
                    <textarea
                        id={htmlId}
                        name={name}
                        placeholder={placeholder || undefined}
                        required={required}
                        rows={rows || 4}
                        className={INPUT_CLASS}
                    />
                </FieldShell>
            );
        },
    },
};
