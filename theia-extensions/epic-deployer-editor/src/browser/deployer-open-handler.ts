/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { injectable } from '@theia/core/shared/inversify';
import { NavigatableWidgetOpenHandler, WidgetOpenerOptions } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { DashboardEditorWidget, DashboardWidgetOptions } from './deployer-editor-widget';

@injectable()
export class DashboardOpenHandler extends NavigatableWidgetOpenHandler<DashboardEditorWidget> {
    readonly id = DashboardEditorWidget.ID;

    canHandle(uri: URI): number {
        // Higher priority than the default text editor for .dashboard files
        return uri.path.ext === '.dashboard' ? 1000 : 0;
    }

    protected createWidgetOptions(uri: URI, options?: WidgetOpenerOptions): DashboardWidgetOptions {
        return {
            kind: 'navigatable',
            uri: uri.toString()
        };
    }
}
