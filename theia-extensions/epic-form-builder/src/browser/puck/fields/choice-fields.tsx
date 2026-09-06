import type { Field } from '@puckeditor/core';
import {
    BaseFieldProps,
    commonDefaultProps,
    commonFieldDefs,
    FieldShell,
    fieldHtmlId,
    INPUT_CLASS,
} from './field-shell';

export interface Option {
    label: string;
    value: string;
}

const DEFAULT_OPTIONS: Option[] = [
    { label: 'Option 1', value: 'option_1' },
    { label: 'Option 2', value: 'option_2' },
];

/** Shared Puck `array` field used to let the user edit a list of options in the sidebar. */
const optionsFieldDef: Field = {
    type: 'array',
    label: 'Options',
    arrayFields: {
        label: { type: 'text', label: 'Option label' },
        value: { type: 'text', label: 'Option value' },
    },
    defaultItemProps: { label: 'New option', value: 'new_option' },
    getItemSummary: (item: Option) => item.label || 'Option',
};

export interface ChoiceFieldProps extends BaseFieldProps {
    options: Option[];
}

export interface SelectFieldProps extends ChoiceFieldProps {
    placeholder?: string;
}

const choiceInputClass =
    'h-4 w-4 shrink-0 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/30';

export const choiceFieldComponents = {
    Select: {
        label: 'Dropdown Select',
        fields: {
            ...commonFieldDefs,
            placeholder: { type: 'text' as const, label: 'Placeholder' },
            options: optionsFieldDef,
        },
        defaultProps: {
            ...commonDefaultProps,
            label: 'Dropdown',
            name: 'dropdown',
            placeholder: 'Select an option',
            options: DEFAULT_OPTIONS,
        },
        // See the comment in actions.tsx for why `props` is untyped here and
        // narrowed with a cast instead of a parameter annotation.
        render: (props: unknown) => {
            const { label, name, placeholder, helperText, required, options, id } = props as SelectFieldProps & { id: string };
            const htmlId = fieldHtmlId(name, id);
            return (
                <FieldShell label={label} htmlFor={htmlId} required={required} helperText={helperText}>
                    <select id={htmlId} name={name} required={required} defaultValue="" className={INPUT_CLASS}>
                        {placeholder ? (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        ) : null}
                        {(options || []).map((option, index) => (
                            <option key={`${option.value}-${index}`} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </FieldShell>
            );
        },
    },

    RadioGroup: {
        label: 'Radio Group',
        fields: {
            ...commonFieldDefs,
            options: optionsFieldDef,
        },
        defaultProps: {
            ...commonDefaultProps,
            label: 'Choose one',
            name: 'radio_group',
            options: DEFAULT_OPTIONS,
        },
        render: (props: unknown) => {
            const { label, name, helperText, required, options, id } = props as ChoiceFieldProps & { id: string };
            return (
                <FieldShell label={label} htmlFor={fieldHtmlId(name, id)} required={required} helperText={helperText}>
                    <div className="flex flex-col gap-2">
                        {(options || []).map((option, index) => {
                            const optionId = `${fieldHtmlId(name, id)}-${index}`;
                            return (
                                <label key={optionId} htmlFor={optionId} className="flex items-center gap-2 text-sm text-slate-700">
                                    <input
                                        id={optionId}
                                        type="radio"
                                        name={name}
                                        value={option.value}
                                        required={required}
                                        className={choiceInputClass}
                                    />
                                    {option.label}
                                </label>
                            );
                        })}
                    </div>
                </FieldShell>
            );
        },
    },

    CheckboxGroup: {
        label: 'Checkbox Group',
        fields: {
            ...commonFieldDefs,
            options: optionsFieldDef,
        },
        defaultProps: {
            ...commonDefaultProps,
            label: 'Choose any that apply',
            name: 'checkbox_group',
            options: DEFAULT_OPTIONS,
        },
        render: (props: unknown) => {
            const { label, name, helperText, required, options, id } = props as ChoiceFieldProps & { id: string };
            return (
                <FieldShell label={label} htmlFor={fieldHtmlId(name, id)} required={required} helperText={helperText}>
                    <div className="flex flex-col gap-2">
                        {(options || []).map((option, index) => {
                            const optionId = `${fieldHtmlId(name, id)}-${index}`;
                            return (
                                <label key={optionId} htmlFor={optionId} className="flex items-center gap-2 text-sm text-slate-700">
                                    <input
                                        id={optionId}
                                        type="checkbox"
                                        name={`${name}[]`}
                                        value={option.value}
                                        className={`${choiceInputClass} rounded`}
                                    />
                                    {option.label}
                                </label>
                            );
                        })}
                    </div>
                </FieldShell>
            );
        },
    },

    Checkbox: {
        label: 'Single Checkbox',
        fields: {
            label: { type: 'text' as const, label: 'Checkbox label' },
            name: { type: 'text' as const, label: 'Field name (used as the form data key)' },
            helperText: { type: 'text' as const, label: 'Helper text' },
            required: commonFieldDefs.required,
        },
        defaultProps: {
            label: 'I agree to the terms and conditions',
            name: 'agree',
            helperText: '',
            required: false,
        },
        render: (props: unknown) => {
            const { label, name, helperText, required, id } = props as BaseFieldProps & { id: string };
            const htmlId = fieldHtmlId(name, id);
            return (
                <div className="w-full">
                    <label htmlFor={htmlId} className="flex items-start gap-2 text-sm text-slate-700">
                        <input
                            id={htmlId}
                            name={name}
                            type="checkbox"
                            required={required}
                            className={`${choiceInputClass} mt-0.5 rounded`}
                        />
                        <span>
                            {label}
                            {required ? (
                                <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>
                            ) : null}
                        </span>
                    </label>
                    {helperText ? <p className="mt-1.5 ml-6 text-xs text-slate-500">{helperText}</p> : null}
                </div>
            );
        },
    },
};
