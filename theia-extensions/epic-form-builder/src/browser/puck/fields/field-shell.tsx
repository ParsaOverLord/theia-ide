import * as React from 'react';
import type { Field } from '@puckeditor/core';

/**
 * Props every "basic" form field (text input, textarea, select, ...) shares.
 * Choice-style fields (radio/checkbox) lay their label out differently, so
 * they don't extend this - see choice-fields.tsx.
 */
export interface BaseFieldProps {
    label: string;
    name: string;
    helperText?: string;
    required: boolean;
}

/**
 * The Puck `fields` definitions for {@link BaseFieldProps}. Spread this into
 * every component's own `fields` object so the label/name/helper/required
 * editors look and behave identically everywhere.
 */
export const commonFieldDefs: Record<keyof BaseFieldProps, Field> = {
    label: { type: 'text', label: 'Field label' },
    name: { type: 'text', label: 'Field name (used as the form data key)' },
    helperText: { type: 'text', label: 'Helper text' },
    required: {
        type: 'radio',
        label: 'Required',
        options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false },
        ],
    },
};

export const commonDefaultProps: BaseFieldProps = {
    label: 'Field label',
    name: 'field',
    helperText: '',
    required: false,
};

/** Shared Tailwind classes for text-like inputs, selects and textareas. */
export const INPUT_CLASS =
    'block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ' +
    'placeholder:text-slate-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none ' +
    'focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:bg-slate-50';

export interface FieldShellProps {
    label: string;
    htmlFor: string;
    required?: boolean;
    helperText?: string;
    children: React.ReactNode;
}

/** Consistent label + control + helper-text layout used by every basic field. */
export function FieldShell(props: FieldShellProps): React.JSX.Element {
    return (
        <div className="w-full">
            <label htmlFor={props.htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700">
                {props.label}
                {props.required ? (
                    <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>
                ) : null}
            </label>
            {props.children}
            {props.helperText ? (
                <p className="mt-1.5 text-xs text-slate-500">{props.helperText}</p>
            ) : null}
        </div>
    );
}

/** Builds a stable, human-friendly id for pairing a <label> with its control. */
export function fieldHtmlId(name: string, puckId: string): string {
    return `${name || 'field'}-${puckId}`;
}
