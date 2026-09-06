import { injectable, inject } from '@theia/core/shared/inversify';
import URI from '@theia/core/lib/common/uri';
import { MessageService } from '@theia/core/lib/common/message-service';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { FileDialogService } from '@theia/filesystem/lib/browser/file-dialog/file-dialog-service';
import type { FileStat } from '@theia/filesystem/lib/common/files';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { EditorManager } from '@theia/editor/lib/browser';
import type { Data } from '@puckeditor/core';
import { generateReactComponent } from './export/generate-react-component';
import { generateJsonSchema } from './export/generate-json-schema';

const FORM_FILE_FILTERS = { 'Form Builder Files': ['json'] };

export interface OpenedForm {
    uri: URI;
    data: Data;
}

/**
 * All filesystem/dialog interaction for the form builder lives here, kept
 * separate from FormBuilderWidget so the widget stays focused on Theia
 * widget lifecycle + wiring the React tree.
 */
@injectable()
export class FormPersistenceService {

    // See the matching comment in form-builder-widget.tsx: these are
    // populated by Inversify after construction, hence the `!`.
    @inject(FileService)
    protected readonly fileService!: FileService;

    @inject(FileDialogService)
    protected readonly fileDialogService!: FileDialogService;

    @inject(WorkspaceService)
    protected readonly workspaceService!: WorkspaceService;

    @inject(EditorManager)
    protected readonly editorManager!: EditorManager;

    @inject(MessageService)
    protected readonly messageService!: MessageService;

    protected defaultFolder(): FileStat | undefined {
        return this.workspaceService.tryGetRoots()[0];
    }

    async pickAndReadFormFile(): Promise<OpenedForm | undefined> {
        const uri = await this.fileDialogService.showOpenDialog(
            { title: 'Open Form', filters: FORM_FILE_FILTERS },
            this.defaultFolder(),
        );
        if (!uri) {
            return undefined;
        }
        try {
            const { value } = await this.fileService.read(uri);
            const data = JSON.parse(value) as Data;
            return { uri, data };
        } catch (error) {
            this.messageService.error(`Could not open ${uri.path.base}: ${toMessage(error)}`);
            return undefined;
        }
    }

    async pickSaveLocation(suggestedName: string): Promise<URI | undefined> {
        return this.fileDialogService.showSaveDialog(
            { title: 'Save Form', filters: FORM_FILE_FILTERS, inputValue: suggestedName },
            this.defaultFolder(),
        );
    }

    async writeFormFile(uri: URI, data: Data): Promise<void> {
        const content = JSON.stringify(data, undefined, 2);
        try {
            await this.writeFile(uri, content);
            this.messageService.info(`Saved ${uri.path.base}`);
        } catch (error) {
            this.messageService.error(`Could not save ${uri.path.base}: ${toMessage(error)}`);
            throw error;
        }
    }

    async exportReactComponent(data: Data, relatedUri: URI | undefined): Promise<void> {
        await this.exportGeneratedFile(generateReactComponent(data), relatedUri, 'GeneratedForm.tsx');
    }

    async exportJsonSchema(data: Data, relatedUri: URI | undefined): Promise<void> {
        await this.exportGeneratedFile(JSON.stringify(generateJsonSchema(data), undefined, 2), relatedUri, 'form.schema.json');
    }

    protected async exportGeneratedFile(content: string, relatedUri: URI | undefined, suggestedName: string): Promise<void> {
        const folder = relatedUri ? await this.fileService.resolve(relatedUri.parent) : this.defaultFolder();
        const uri = await this.fileDialogService.showSaveDialog({ title: 'Export', inputValue: suggestedName }, folder);
        if (!uri) {
            return;
        }
        try {
            await this.writeFile(uri, content);
            await this.editorManager.open(uri);
        } catch (error) {
            this.messageService.error(`Could not export ${uri.path.base}: ${toMessage(error)}`);
        }
    }

    protected async writeFile(uri: URI, content: string): Promise<void> {
        if (await this.fileService.exists(uri)) {
            await this.fileService.write(uri, content);
        } else {
            await this.fileService.create(uri, content);
        }
    }
}

function toMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}
