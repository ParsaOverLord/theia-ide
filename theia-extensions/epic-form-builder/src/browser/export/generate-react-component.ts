import type { Data } from '@puckeditor/core';

interface ComponentDatum {
    type: string;
    props: Record<string, unknown> & { id: string };
}

interface OptionDatum {
    label: string;
    value: string;
}

/**
 * Safely embed an arbitrary, user-authored value into generated JSX as a
 * `{ ... }` expression. Using `JSON.stringify` (rather than interpolating
 * raw text) means we never have to hand-roll JSX/HTML escaping - quotes,
 * angle brackets, curly braces, unicode, and newlines are all handled
 * correctly by construction.
 */
function esc(value: unknown): string {
    return JSON.stringify(value ?? '');
}

function indent(code: string, spaces: number): string {
    const pad = ' '.repeat(spaces);
    return code
        .split('\n')
        .map(line => (line.length ? pad + line : line))
        .join('\n');
}

function renderTextLike(type: string, p: Record<string, unknown>): string {
    const htmlType: Record<string, string> = {
        TextInput: 'text',
        EmailInput: 'email',
        PasswordInput: 'password',
        DateInput: 'date',
        NumberInput: 'number',
    };
    return [
        `<FormField label={${esc(p.label)}} htmlFor={${esc(p.name)}} required={${!!p.required}} helperText={${esc(p.helperText)}}>`,
        `  <input`,
        `    id={${esc(p.name)}}`,
        `    name={${esc(p.name)}}`,
        `    type="${htmlType[type]}"`,
        `    placeholder={${esc(p.placeholder)}}`,
        `    required={${!!p.required}}`,
        `    className={inputClass}`,
        `  />`,
        `</FormField>`,
    ].join('\n');
}

function renderField(item: ComponentDatum): string {
    const p = item.props;

    switch (item.type) {
        case 'TextInput':
        case 'EmailInput':
        case 'PasswordInput':
        case 'DateInput':
        case 'NumberInput':
            return renderTextLike(item.type, p);

        case 'Textarea':
            return [
                `<FormField label={${esc(p.label)}} htmlFor={${esc(p.name)}} required={${!!p.required}} helperText={${esc(p.helperText)}}>`,
                `  <textarea`,
                `    id={${esc(p.name)}}`,
                `    name={${esc(p.name)}}`,
                `    rows={${Number(p.rows) || 4}}`,
                `    placeholder={${esc(p.placeholder)}}`,
                `    required={${!!p.required}}`,
                `    className={inputClass}`,
                `  />`,
                `</FormField>`,
            ].join('\n');

        case 'Select': {
            const options = (Array.isArray(p.options) ? (p.options as OptionDatum[]) : []);
            const optionsJsx = options
                .map(option => `    <option value={${esc(option.value)}}>{${esc(option.label)}}</option>`)
                .join('\n');
            return [
                `<FormField label={${esc(p.label)}} htmlFor={${esc(p.name)}} required={${!!p.required}} helperText={${esc(p.helperText)}}>`,
                `  <select id={${esc(p.name)}} name={${esc(p.name)}} required={${!!p.required}} defaultValue="" className={inputClass}>`,
                `    <option value="" disabled>{${esc(p.placeholder)}}</option>`,
                optionsJsx,
                `  </select>`,
                `</FormField>`,
            ].join('\n');
        }

        case 'RadioGroup':
        case 'CheckboxGroup': {
            const isRadio = item.type === 'RadioGroup';
            const options = (Array.isArray(p.options) ? (p.options as OptionDatum[]) : []);
            const optionsJsx = options
                .map(
                    (option, index) => `    <label key={${index}} className="flex items-center gap-2 text-sm text-slate-700">
      <input type="${isRadio ? 'radio' : 'checkbox'}" name={${esc(isRadio ? p.name : `${String(p.name)}[]`)}} value={${esc(option.value)}} className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/30" />
      {${esc(option.label)}}
    </label>`,
                )
                .join('\n');
            return [
                `<FormField label={${esc(p.label)}} htmlFor={${esc(p.name)}} required={${!!p.required}} helperText={${esc(p.helperText)}}>`,
                `  <div className="flex flex-col gap-2">`,
                optionsJsx,
                `  </div>`,
                `</FormField>`,
            ].join('\n');
        }

        case 'Checkbox':
            return [
                `<div className="w-full">`,
                `  <label className="flex items-start gap-2 text-sm text-slate-700">`,
                `    <input name={${esc(p.name)}} type="checkbox" required={${!!p.required}} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/30" />`,
                `    <span>{${esc(p.label)}}</span>`,
                `  </label>`,
                p.helperText ? `  <p className="mt-1.5 ml-6 text-xs text-slate-500">{${esc(p.helperText)}}</p>` : '',
                `</div>`,
            ]
                .filter(Boolean)
                .join('\n');

        case 'Heading': {
            const level = typeof p.level === 'string' ? p.level : 'h2';
            const sizeClass = level === 'h3' ? 'text-lg' : level === 'h4' ? 'text-base' : 'text-xl';
            return `<${level} className="${sizeClass} font-semibold text-slate-900">{${esc(p.text)}}</${level}>`;
        }

        case 'Paragraph':
            return `<p className="whitespace-pre-line text-sm text-slate-600">{${esc(p.text)}}</p>`;

        case 'Divider':
            return `<hr className="my-1 border-slate-200" />`;

        case 'SubmitButton': {
            const isPrimary = p.variant !== 'secondary';
            const variantClass = isPrimary
                ? 'bg-blue-600 text-white hover:bg-blue-500'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50';
            return `<button type="submit" className="inline-flex w-fit items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm ${variantClass}">
  {${esc(p.label)}}
</button>`;
        }

        case 'Section': {
            const items = Array.isArray(p.content) ? (p.content as ComponentDatum[]) : [];
            return [
                `<fieldset className="rounded-lg border border-slate-200 p-4">`,
                `  <legend className="px-1 text-sm font-semibold text-slate-900">{${esc(p.title)}}</legend>`,
                p.description ? `  <p className="mb-4 text-xs text-slate-500">{${esc(p.description)}}</p>` : '',
                `  <div className="flex flex-col gap-6">`,
                indent(items.map(renderField).join('\n'), 4),
                `  </div>`,
                `</fieldset>`,
            ]
                .filter(Boolean)
                .join('\n');
        }

        case 'Columns': {
            const left = Array.isArray(p.left) ? (p.left as ComponentDatum[]) : [];
            const right = Array.isArray(p.right) ? (p.right as ComponentDatum[]) : [];
            return [
                `<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">`,
                `  <div className="flex flex-col gap-6">`,
                indent(left.map(renderField).join('\n'), 4),
                `  </div>`,
                `  <div className="flex flex-col gap-6">`,
                indent(right.map(renderField).join('\n'), 4),
                `  </div>`,
                `</div>`,
            ].join('\n');
        }

        default:
            return `{/* Unrecognized field type: ${item.type} */}`;
    }
}

/**
 * Turns a Puck `Data` document into a standalone, dependency-free
 * (no Puck, no Theia) React + Tailwind component that can be dropped
 * straight into a real application.
 */
export function generateReactComponent(data: Data): string {
    const content = (data.content ?? []) as ComponentDatum[];
    const rootProps = ((data.root as { props?: { title?: string; description?: string } } | undefined)?.props) ?? {};
    const title = rootProps.title ?? 'Untitled form';
    const description = rootProps.description ?? '';

    const body = indent(content.map(renderField).join('\n'), 6);
    const descriptionJsx = description
        ? `\n        <p className="mt-1 text-sm text-slate-600">{${esc(description)}}</p>`
        : '';

    return `import * as React from 'react';

/**
 * Generated by the Theia Form Builder. This file is a plain, standalone
 * React + Tailwind CSS component with no dependency on Puck or Theia -
 * copy it into any React project that already has Tailwind CSS configured.
 *
 * Feel free to edit it by hand; exporting again from the builder will only
 * overwrite this exact file if you choose the same path.
 */

const inputClass =
  'block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm ' +
  'placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30';

function FormField(props: {
  label: string;
  htmlFor: string;
  required?: boolean;
  helperText?: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="w-full">
      <label htmlFor={props.htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700">
        {props.label}
        {props.required ? <span className="ml-0.5 text-red-500">*</span> : null}
      </label>
      {props.children}
      {props.helperText ? <p className="mt-1.5 text-xs text-slate-500">{props.helperText}</p> : null}
    </div>
  );
}

export interface GeneratedFormProps {
  onSubmit?: (formData: FormData) => void;
}

export function GeneratedForm({ onSubmit }: GeneratedFormProps): React.JSX.Element {
  return (
    <form
      className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6"
      onSubmit={event => {
        event.preventDefault();
        onSubmit?.(new FormData(event.currentTarget));
      }}
    >
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-semibold text-slate-900">{${esc(title)}}</h1>${descriptionJsx}
      </div>
      <div className="flex flex-col gap-6">
${body}
      </div>
    </form>
  );
}
`;
}
