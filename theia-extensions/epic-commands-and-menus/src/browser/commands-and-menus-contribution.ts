/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { injectable, inject } from '@theia/core/shared/inversify';
import { CommandContribution, CommandRegistry } from '@theia/core/lib/common/command';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service';
import { MessageService } from '@theia/core/lib/common/message-service';
import { MenuContribution, MenuModelRegistry } from '@theia/core/lib/common/menu';
import { CommonMenus, QuickInputService } from '@theia/core/lib/browser';
import { NAVIGATOR_CONTEXT_MENU, NavigatorContextMenu } from '@theia/navigator/lib/browser/navigator-contribution';

export const NewEpicProjectCommand = {
    id: 'new-project.epic',
    label: 'New Epic Project...'
};

@injectable()
export class NewEpicProjectContribution implements CommandContribution, MenuContribution {

    @inject(FileService)
    protected readonly fileService: FileService;

    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService;

    @inject(MessageService)
    protected readonly messageService: MessageService;

    @inject(QuickInputService)
    protected readonly quickInputService: QuickInputService;

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(NewEpicProjectCommand, {
            execute: () => this.createFolderAndFile()
        });
    }

    registerMenus(menus: MenuModelRegistry): void {

        menus.registerMenuAction(CommonMenus.FILE_NEW, {
            commandId: NewEpicProjectCommand.id,
            label: NewEpicProjectCommand.label
        });

        menus.registerMenuAction([...NavigatorContextMenu.NAVIGATION, ...NAVIGATOR_CONTEXT_MENU], {
            commandId: NewEpicProjectCommand.id,
            label: NewEpicProjectCommand.label
        });
    }

    protected async createFolderAndFile(): Promise<void> {
        // 1. Ensure we have an active workspace folder opened
        const roots = this.workspaceService.tryGetRoots();
        if (roots.length === 0) {
            this.messageService.warn('No active workspace folder. Please open a folder first.');
            return;
        }

        // 2. Prompt the user for the Project Name
        const projectName = await this.quickInputService.input({
            prompt: 'Enter the new project name',
            placeHolder: 'e.g., KTF',
            // ADDED: Mark the callback as async so it returns a Promise
            validateInput: async value => {
                if (!value || value.trim() === '') {
                    return 'Project name cannot be empty.';
                }
                // Check for invalid directory characters
                if (/[\\/:*?"<>|]/.test(value)) {
                    return 'Project name contains invalid characters.';
                }
                return undefined;
            }
        });

        // If the user cancelled or hit ESC, exit gracefully
        if (!projectName) {
            return;
        }

        const trimmedName = projectName.trim();
        const rootUri = roots[0].resource;
        const parentFolderUri = rootUri.resolve(trimmedName);

        try {
            // 3. Create the parent folder (named dynamically by the user)
            if (!await this.fileService.exists(parentFolderUri)) {
                await this.fileService.createFolder(parentFolderUri);
            }

            // 4. Create 5 subfolders inside the parent folder
            const subFolders = ['domains', 'processes', 'forms', 'scripts', 'menus'];
            for (const folderName of subFolders) {
                const subFolderUri = parentFolderUri.resolve(folderName);
                if (!await this.fileService.exists(subFolderUri)) {
                    await this.fileService.createFolder(subFolderUri);
                }
            }

            // 5. Create the customized .dashboard file inside the parent folder
            const dashboardFileUri = parentFolderUri.resolve(`${trimmedName}.dashboard`);
            const defaultContent = JSON.stringify({
                serverLink: 'http://localhost',
                port: 8080
            }, undefined, 2);

            await this.fileService.create(dashboardFileUri, defaultContent);

            this.messageService.info(`Project '${trimmedName}' with structure and dashboard created successfully!`);
        } catch (error) {
            this.messageService.error(`Failed to generate project structure: ${error}`);
        }
    }
}
