/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { ContainerModule } from '@theia/core/shared/inversify';
import { OpenHandler, WidgetFactory } from '@theia/core/lib/browser';
import { DashboardEditorWidget, DashboardWidgetOptions } from './deployer-editor-widget';
import { DashboardOpenHandler } from './deployer-open-handler';

export default new ContainerModule(bind => {
    // 1. Register a WidgetFactory to construct the editor when a file opens
    bind(WidgetFactory).toDynamicValue(context => ({
        id: DashboardEditorWidget.ID,
        createWidget: (options: DashboardWidgetOptions) => {
            const child = context.container.createChild();
            child.bind(DashboardWidgetOptions).toConstantValue(options);
            child.bind(DashboardEditorWidget).toSelf();
            return child.get(DashboardEditorWidget);
        }
    })).inSingletonScope();

    // 2. Register the OpenHandler that intercepts .dashboard files
    bind(DashboardOpenHandler).toSelf().inSingletonScope();
    bind(OpenHandler).toService(DashboardOpenHandler);
});
