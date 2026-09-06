import type { Data } from '@puckeditor/core';

interface ComponentDatum {
    type: string;
    props: Record<string, unknown>;
}

/** Maps a field component's Puck type to the JSON Schema `type` of the value it collects. */
const SCHEMA_TYPE_BY_COMPONENT: Record<string, string> = {
    TextInput: 'string',
    Textarea: 'string',
    EmailInput: 'string',
    PasswordInput: 'string',
    DateInput: 'string',
    NumberInput: 'number',
    Select: 'string',
    RadioGroup: 'string',
    Checkbox: 'boolean',
    CheckboxGroup: 'array',
};

function collectFields(items: ComponentDatum[], properties: Record<string, unknown>, required: string[]): void {
    for (const item of items) {
        const p = item.props;

        if (item.type === 'Section' && Array.isArray(p.content)) {
            collectFields(p.content as ComponentDatum[], properties, required);
            continue;
        }
        if (item.type === 'Columns') {
            if (Array.isArray(p.left)) {
                collectFields(p.left as ComponentDatum[], properties, required);
            }
            if (Array.isArray(p.right)) {
                collectFields(p.right as ComponentDatum[], properties, required);
            }
            continue;
        }

        const schemaType = SCHEMA_TYPE_BY_COMPONENT[item.type];
        if (!schemaType || !p.name) {
            continue;
        }

        const fieldSchema: Record<string, unknown> = {
            type: schemaType,
            title: p.label,
        };
        if (item.type === 'CheckboxGroup') {
            fieldSchema.items = { type: 'string' };
        }
        if ((item.type === 'Select' || item.type === 'RadioGroup') && Array.isArray(p.options)) {
            fieldSchema.enum = (p.options as { value: unknown }[]).map(option => option.value);
        }
        if (p.helperText) {
            fieldSchema.description = p.helperText;
        }

        properties[p.name as string] = fieldSchema;
        if (p.required) {
            required.push(p.name as string);
        }
    }
}

/** Turns a Puck `Data` document into a JSON Schema describing the data the form collects. */
export function generateJsonSchema(data: Data): Record<string, unknown> {
    const properties: Record<string, unknown> = {};
    const required: string[] = [];
    collectFields((data.content ?? []) as ComponentDatum[], properties, required);

    const rootProps = ((data.root as { props?: { title?: string; description?: string } } | undefined)?.props) ?? {};

    return {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: rootProps.title ?? 'Untitled form',
        ...(rootProps.description ? { description: rootProps.description } : {}),
        type: 'object',
        properties,
        required,
    };
}
