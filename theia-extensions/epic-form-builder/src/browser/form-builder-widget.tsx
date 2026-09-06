import { createRoot, Root } from 'react-dom/client';
import { injectable, inject, postConstruct } from '@theia/core/shared/inversify';
import { BaseWidget, Message } from '@theia/core/lib/browser';
import { MessageService } from '@theia/core/lib/common/message-service';
import { Emitter } from '@theia/core/lib/common/event';
import URI from '@theia/core/lib/common/uri';
import type { Data } from '@puckeditor/core';
import { FORM_BUILDER_WIDGET_ID, FORM_BUILDER_WIDGET_LABEL } from '../common/protocol';
import { createEmptyFormData } from './puck/config';
import { FormBuilderApp } from './components/form-builder-app';
import { FormPersistenceService } from './form-persistence-service';

// The compiled Tailwind bundle (theme + utilities, no Preflight - see tailwind.css).
import './style/index.css';
// Puck's own chrome (drag handles, selection outlines, sidebar layout, ...).
import '@puckeditor/core/puck.css';

/*
 * Why this widget manually mounts its own React root instead of extending
 * Theia's `ReactWidget` (which renders through `@theia/core/shared/react`):
 *
 * Theia's "shared" modules exist so that every extension's widgets share
 * exactly one copy of React/ReactDOM with Theia core, avoiding "invalid
 * hook call" errors from multiple React copies mounted into the *same*
 * component tree. That constraint only matters within a single tree,
 * though - separate `createRoot()` calls are entirely independent React
 * trees and can safely run different React versions side by side.
 *
 * Since the whole point of this extension is to use React 19 (as pinned in
 * package.json) together with Puck - regardless of which React version the
 * installed Theia core happens to bundle - we opt out of the shared-React
 * mechanism here and bring our own `react`/`react-dom` instead. Theia's own
 * DI container (`@theia/core/shared/inversify`) is still used normally
 * below, since our widget/contribution classes *do* need to live in
 * Theia's own object graph.
 */
@injectable()
export class FormBuilderWidget extends BaseWidget {

    static readonly ID = FORM_BUILDER_WIDGET_ID;
    static readonly LABEL = FORM_BUILDER_WIDGET_LABEL;

    // The `!` (definite assignment assertion) tells TypeScript's
    // `strictPropertyInitialization` check that Inversify assigns this
    // property via reflection right after construction, even though no
    // constructor or field initializer does it visibly.
    @inject(FormPersistenceService)
    protected readonly persistence!: FormPersistenceService;

    @inject(MessageService)
    protected readonly messageService!: MessageService;

    protected root: Root | undefined;
    protected data: Data = createEmptyFormData();
    protected fileUri: URI | undefined;
    protected dirty = false;
    /** Incremented whenever a *different* document is loaded; forces <Puck> to remount. */
    protected formKey = 0;

    protected readonly onDidChangeDirtyEmitter = new Emitter<void>();
    readonly onDidChangeDirty = this.onDidChangeDirtyEmitter.event;

    @postConstruct()
    protected init(): void {
        this.id = FormBuilderWidget.ID;
        this.title.closable = true;
        this.title.iconClass = 'codicon codicon-checklist';
        this.addClass('theia-form-builder-widget');
        this.node.tabIndex = 0;
        this.toDispose.push(this.onDidChangeDirtyEmitter);
        this.updateTitle();
    }

    get isDirty(): boolean {
        return this.dirty;
    }

    // #region document actions

    async newForm(): Promise<void> {
        if (!(await this.confirmDiscardIfDirty())) {
            return;
        }
        this.data = createEmptyFormData();
        this.fileUri = undefined;
        this.formKey++;
        this.setDirty(false);
    }

    async openForm(): Promise<void> {
        if (!(await this.confirmDiscardIfDirty())) {
            return;
        }
        const opened = await this.persistence.pickAndReadFormFile();
        if (opened) {
            this.data = opened.data;
            this.fileUri = opened.uri;
            this.formKey++;
            this.setDirty(false);
        }
    }

    async save(): Promise<void> {
        if (!this.fileUri) {
            return this.saveAs();
        }
        await this.persistence.writeFormFile(this.fileUri, this.data);
        this.setDirty(false);
    }

    async saveAs(): Promise<void> {
        const suggestedName = this.fileUri ? this.fileUri.path.base : 'untitled.form.json';
        const uri = await this.persistence.pickSaveLocation(suggestedName);
        if (!uri) {
            return;
        }
        await this.persistence.writeFormFile(uri, this.data);
        this.fileUri = uri;
        this.setDirty(false);
    }

    async exportReactComponent(): Promise<void> {
        await this.persistence.exportReactComponent(this.data, this.fileUri);
    }

    async exportJsonSchema(): Promise<void> {
        await this.persistence.exportJsonSchema(this.data, this.fileUri);
    }

    protected async confirmDiscardIfDirty(): Promise<boolean> {
        if (!this.dirty) {
            return true;
        }
        const discard = 'Discard Changes';
        const answer = await this.messageService.warn('This form has unsaved changes. Discard them?', discard);
        return answer === discard;
    }

    // #endregion

    protected readonly handleDataChange = (data: Data): void => {
        this.data = data;
        this.setDirty(true);
    };

    protected setDirty(dirty: boolean): void {
        const changed = this.dirty !== dirty;
        this.dirty = dirty;
        this.updateTitle();
        this.renderApp();
        if (changed) {
            this.onDidChangeDirtyEmitter.fire();
        }
    }

    protected updateTitle(): void {
        const base = this.fileUri ? this.fileUri.path.base : 'Untitled form';
        this.title.label = this.dirty ? `${base} ●` : base;
        this.title.caption = this.fileUri ? this.fileUri.toString() : FormBuilderWidget.LABEL;
    }

    // #region Theia widget lifecycle

    protected override onAfterAttach(msg: Message): void {
        super.onAfterAttach(msg);
        if (!this.root) {
            this.root = createRoot(this.node);
        }
        this.renderApp();
    }

    protected override onBeforeDetach(msg: Message): void {
        this.root?.unmount();
        this.root = undefined;
        super.onBeforeDetach(msg);
    }

    protected override onActivateRequest(msg: Message): void {
        super.onActivateRequest(msg);
        this.node.focus();
    }

    // #endregion

    protected renderApp(): void {
        if (!this.root) {
            // Not attached yet; onAfterAttach will render once it is.
            return;
        }
        this.root.render(
            <FormBuilderApp
                formKey={this.formKey}
                data={this.data}
                onDataChange={this.handleDataChange}
                isDirty={this.dirty}
                fileLabel={this.fileUri ? this.fileUri.path.base : 'Untitled form'}
                onNew={() => this.newForm()}
                onOpen={() => this.openForm()}
                onSave={() => this.save()}
                onSaveAs={() => this.saveAs()}
                onExportReact={() => this.exportReactComponent()}
                onExportSchema={() => this.exportJsonSchema()}
            />,
        );
    }
}
