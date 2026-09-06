export interface HeadingProps {
    text: string;
    level: 'h2' | 'h3' | 'h4';
}

export interface ParagraphProps {
    text: string;
}

const HEADING_SIZE_CLASS: Record<HeadingProps['level'], string> = {
    h2: 'text-xl',
    h3: 'text-lg',
    h4: 'text-base',
};

export const contentBlockComponents = {
    Heading: {
        label: 'Heading',
        fields: {
            text: { type: 'text' as const, label: 'Text' },
            level: {
                type: 'select' as const,
                label: 'Size',
                options: [
                    { label: 'Large (H2)', value: 'h2' },
                    { label: 'Medium (H3)', value: 'h3' },
                    { label: 'Small (H4)', value: 'h4' },
                ],
            },
        },
        defaultProps: {
            text: 'Section heading',
            level: 'h2',
        },
        // See the comment in actions.tsx for why `props` is untyped here and
        // narrowed with a cast instead of a parameter annotation.
        render: (props: unknown) => {
            const { text, level } = props as HeadingProps;
            const Tag = level || 'h2';
            return <Tag className={`${HEADING_SIZE_CLASS[level] || HEADING_SIZE_CLASS.h2} font-semibold text-slate-900`}>{text}</Tag>;
        },
    },

    Paragraph: {
        label: 'Paragraph',
        fields: {
            text: { type: 'textarea' as const, label: 'Text' },
        },
        defaultProps: {
            text: 'Add some explanatory text here.',
        },
        render: (props: unknown) => {
            const { text } = props as ParagraphProps;
            return <p className="whitespace-pre-line text-sm text-slate-600">{text}</p>;
        },
    },
};
