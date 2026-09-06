import * as React from 'react';

/*
 * Layout is achieved with Puck's `slot` field type rather than the legacy
 * `<DropZone>` component: a slot field is passed to `render` as a component
 * you invoke as JSX (e.g. `<Content />`), and it renders its own droppable
 * area. Because we author the wrapping markup (the flex/grid container)
 * ourselves and the slot outputs are direct children of it, we have full,
 * unambiguous control over the resulting layout.
 */

export interface SectionProps {
    title: string;
    description?: string;
    content: React.ComponentType;
}

export interface ColumnsProps {
    left: React.ComponentType;
    right: React.ComponentType;
}

export const layoutBlockComponents = {
    Section: {
        label: 'Section',
        fields: {
            title: { type: 'text' as const, label: 'Section title' },
            description: { type: 'text' as const, label: 'Section description' },
            content: { type: 'slot' as const },
        },
        defaultProps: {
            title: 'Section title',
            description: '',
            content: [],
        },
        // See the comment in actions.tsx for why `props` is untyped here and
        // narrowed with a cast instead of a parameter annotation.
        render: (props: unknown) => {
            const { title, description, content: Content } = props as SectionProps;
            return (
                <fieldset className="w-full rounded-lg border border-slate-200 p-4">
                    <legend className="px-1 text-sm font-semibold text-slate-900">{title}</legend>
                    {description ? <p className="mb-4 text-xs text-slate-500">{description}</p> : null}
                    <div className="flex flex-col gap-6">
                        <Content />
                    </div>
                </fieldset>
            );
        },
    },

    Columns: {
        label: 'Columns (2)',
        fields: {
            left: { type: 'slot' as const },
            right: { type: 'slot' as const },
        },
        defaultProps: {
            left: [],
            right: [],
        },
        render: (props: unknown) => {
            const { left: Left, right: Right } = props as ColumnsProps;
            return (
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-6">
                        <Left />
                    </div>
                    <div className="flex flex-col gap-6">
                        <Right />
                    </div>
                </div>
            );
        },
    },

    Divider: {
        label: 'Divider',
        render: () => <hr className="my-1 w-full border-slate-200" />,
    },
};
