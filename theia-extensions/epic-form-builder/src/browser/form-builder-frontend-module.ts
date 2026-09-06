import { ContainerModule } from '@theia/core/shared/inversify';
import {
    bindViewContribution,
    FrontendApplicationContribution,
    KeybindingContribution,
    WidgetFactory,
} from '@theia/core/lib/browser';
import { CommandContribution, MenuContribution } from '@theia/core/lib/common';
import { FormBuilderWidget } from './form-builder-widget';
import { FormBuilderContribution } from './form-builder-contribution';
import { FormPersistenceService } from './form-persistence-service';

export default new ContainerModule(bind => {
    bind(FormPersistenceService).toSelf().inSingletonScope();

    bind(FormBuilderWidget).toSelf();
    bind(WidgetFactory)
        .toDynamicValue(context => ({
            id: FormBuilderWidget.ID,
            createWidget: () => context.container.get(FormBuilderWidget),
        }))
        .inSingletonScope();

    bindViewContribution(bind, FormBuilderContribution);
    bind(FrontendApplicationContribution).toService(FormBuilderContribution);
    bind(CommandContribution).toService(FormBuilderContribution);
    bind(MenuContribution).toService(FormBuilderContribution);
    bind(KeybindingContribution).toService(FormBuilderContribution);
});
