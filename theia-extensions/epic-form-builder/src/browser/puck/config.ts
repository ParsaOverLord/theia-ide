import type { Data } from '@puckeditor/core';
import { textFieldComponents } from './fields/text-fields';
import { choiceFieldComponents } from './fields/choice-fields';
import { contentBlockComponents } from './fields/content-blocks';
import { layoutBlockComponents } from './fields/layout-blocks';
import { actionComponents } from './fields/actions';
import { rootConfig } from './root';

/**
 * The full Puck configuration for the form builder: every draggable
 * component plus the categories they're grouped under in the sidebar.
 *
 * Deliberately left without an explicit `Config<...>` generic annotation:
 * Puck checks this object structurally wherever it's consumed (e.g.
 * `<Puck config={formBuilderConfig} .../>`), which gives the same type
 * safety without having to pin down Puck's internal generic signature by
 * hand (and risk drifting from it as Puck evolves).
 */
export const formBuilderConfig = {
    root: rootConfig,
    categories: {
        layout: {
            title: 'Layout',
            components: ['Section', 'Columns', 'Divider'],
        },
        basicFields: {
            title: 'Basic Fields',
            components: ['TextInput', 'Textarea', 'NumberInput', 'EmailInput', 'PasswordInput', 'DateInput'],
        },
        choiceFields: {
            title: 'Choice Fields',
            components: ['Select', 'RadioGroup', 'CheckboxGroup', 'Checkbox'],
        },
        content: {
            title: 'Content',
            components: ['Heading', 'Paragraph'],
        },
        actions: {
            title: 'Actions',
            components: ['SubmitButton'],
        },
    },
    components: {
        ...layoutBlockComponents,
        ...textFieldComponents,
        ...choiceFieldComponents,
        ...contentBlockComponents,
        ...actionComponents,
    },
};

/** A brand-new, empty form document. Always returns a fresh object. */
export function createEmptyFormData(): Data {
    return {
        content: [],
        root: {},
    };
}
