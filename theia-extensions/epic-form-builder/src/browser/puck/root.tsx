import * as React from 'react';

export interface FormRootProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
}

/**
 * Configuration for Puck's special `root` component, which wraps every
 * top-level component that gets dropped onto the canvas. We use it to hold
 * the form's own title/description and the outer <form> element.
 */
export const rootConfig = {
    fields: {
        title: { type: 'text' as const, label: 'Form title' },
        description: { type: 'textarea' as const, label: 'Form description' },
    },
    defaultProps: {
        title: 'Untitled form',
        description: '',
    },
    // See the comment in actions.tsx for why `props` is untyped here and
    // narrowed with a cast instead of a parameter annotation.
    render: (props: unknown) => {
        const { title, description, children } = props as FormRootProps;
        return (
            <form
                className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6"
                onSubmit={(event: React.FormEvent<HTMLFormElement>) => event.preventDefault()}
            >
                <div className="border-b border-slate-200 pb-4">
                    <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
                    {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
                </div>
                <div className="flex flex-col gap-6">{children}</div>
            </form>
        );
    },
};
