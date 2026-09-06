/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { CommandContribution } from '@theia/core/lib/common/command';
import { MenuContribution } from '@theia/core/lib/common/menu';
import { ContainerModule } from '@theia/core/shared/inversify';
import { NewEpicProjectContribution } from './commands-and-menus-contribution';

export default new ContainerModule(bind => {
  bind(NewEpicProjectContribution).toSelf().inSingletonScope();
  bind(CommandContribution).toService(NewEpicProjectContribution);
  bind(MenuContribution).toService(NewEpicProjectContribution);
});
