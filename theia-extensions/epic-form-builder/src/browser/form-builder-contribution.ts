import { injectable } from '@theia/core/shared/inversify';
import {
    AbstractViewContribution,
    CommonMenus,
    FrontendApplicationContribution,
    KeybindingRegistry,
} from '@theia/core/lib/browser';
import { Command, CommandRegistry, MenuModelRegistry } from '@theia/core/lib/common';
import { FormBuilderWidget } from './form-builder-widget';

export namespace FormBuilderCommands {
    const CATEGORY = 'Form Builder';

    export const OPEN_WIDGET: Command = {
        id: 'formBuilder:openWidget',
        category: CATEGORY,
        label: 'Open Form Builder',
    };
    export const NEW_FORM: Command = {
        id: 'formBuilder.newForm',
        category: CATEGORY,
        label: 'New Form',
    };
    export const OPEN_FILE: Command = {
        id: 'formBuilder.openFile',
        category: CATEGORY,
        label: 'Open Form…',
    };
    export const SAVE: Command = {
        id: 'formBuilder.save',
        category: CATEGORY,
        label: 'Save Form',
    };
    export const SAVE_AS: Command = {
        id: 'formBuilder.saveAs',
        category: CATEGORY,
        label: 'Save Form As…',
    };
    export const EXPORT_REACT: Command = {
        id: 'formBuilder.exportReact',
        category: CATEGORY,
        label: 'Export as React Component',
    };
    export const EXPORT_SCHEMA: Command = {
        id: 'formBuilder.exportSchema',
        category: CATEGORY,
        label: 'Export as JSON Schema',
    };
}

@injectable()
export class FormBuilderContribution extends AbstractViewContribution<FormBuilderWidget> implements FrontendApplicationContribution {

    constructor() {
        super({
            widgetId: FormBuilderWidget.ID,
            widgetName: FormBuilderWidget.LABEL,
            defaultWidgetOptions: { area: 'main' },
            toggleCommandId: FormBuilderCommands.OPEN_WIDGET.id,
        });
    }

    /**
     * The form builder should only open when the user asks for it (command,
     * menu, ...) - never automatically as part of the default layout.
     *
     * Not `override`: this satisfies the `initializeLayout` member declared
     * on the `FrontendApplicationContribution` interface this class
     * `implements`, not a method inherited from the `AbstractViewContribution`
     * base *class* - `override` only applies to the latter.
     */
    async initializeLayout(): Promise<void> {
        // Intentionally empty.
    }

    /** Runs `action` against the widget if one is currently open, otherwise does nothing. */
    protected withOpenWidget<T>(action: (widget: FormBuilderWidget) => T): T | undefined {
        const widget = this.tryGetWidget();
        return widget ? action(widget) : undefined;
    }

    override registerCommands(commands: CommandRegistry): void {
        super.registerCommands(commands);

        commands.registerCommand(FormBuilderCommands.NEW_FORM, {
            execute: async () => (await this.openView({ activate: true, reveal: true })).newForm(),
        });
        commands.registerCommand(FormBuilderCommands.OPEN_FILE, {
            execute: async () => (await this.openView({ activate: true, reveal: true })).openForm(),
        });
        commands.registerCommand(FormBuilderCommands.SAVE, {
            execute: () => this.withOpenWidget(widget => widget.save()),
            isEnabled: () => !!this.tryGetWidget(),
        });
        commands.registerCommand(FormBuilderCommands.SAVE_AS, {
            execute: () => this.withOpenWidget(widget => widget.saveAs()),
            isEnabled: () => !!this.tryGetWidget(),
        });
        commands.registerCommand(FormBuilderCommands.EXPORT_REACT, {
            execute: () => this.withOpenWidget(widget => widget.exportReactComponent()),
            isEnabled: () => !!this.tryGetWidget(),
        });
        commands.registerCommand(FormBuilderCommands.EXPORT_SCHEMA, {
            execute: () => this.withOpenWidget(widget => widget.exportJsonSchema()),
            isEnabled: () => !!this.tryGetWidget(),
        });
    }

    override registerMenus(menus: MenuModelRegistry): void {
        // Adds the standard "toggle view" entry to the View menu.
        super.registerMenus(menus);

        menus.registerMenuAction(CommonMenus.FILE_NEW, {
            commandId: FormBuilderCommands.OPEN_WIDGET.id,
            label: FormBuilderWidget.LABEL,
        });
    }

    override registerKeybindings(keybindings: KeybindingRegistry): void {
        super.registerKeybindings(keybindings);

        // No `when` clause: gated purely by the command's own `isEnabled`
        // (true only while a Form Builder widget exists), so this never
        // shadows the editor's own Ctrl+S/Cmd+S. Also note the canvas lives
        // inside an <iframe> (Puck's drag-and-drop surface), whose keydown
        // events don't bubble to the host document - so the toolbar's Save
        // button remains the one fully reliable way to save; this binding
        // is a convenience for when focus is in the outer widget chrome.
        keybindings.registerKeybinding({
            command: FormBuilderCommands.SAVE.id,
            keybinding: 'ctrlcmd+s',
        });
    }
}
