import * as React from 'react';
import { useState } from 'react';
import { Puck, Render } from '@puckeditor/core';
import type { Data } from '@puckeditor/core';
import { formBuilderConfig } from '../puck/config';
import { BuilderMode, Toolbar } from './toolbar';

export interface FormBuilderAppProps {
    /**
     * Bumped by the widget every time a *different* document is loaded
     * (New/Open). `<Puck>` treats its `data` prop as initial-value-only and
     * ignores later changes to it, so switching documents needs a fresh
     * mount - changing `key` is exactly how React does that.
     */
    formKey: number;
    data: Data;
    onDataChange: (data: Data) => void;
    isDirty: boolean;
    fileLabel: string;
    onNew: () => void;
    onOpen: () => void;
    onSave: () => void;
    onSaveAs: () => void;
    onExportReact: () => void;
    onExportSchema: () => void;
}

export function FormBuilderApp(props: FormBuilderAppProps): React.JSX.Element {
    const [mode, setMode] = useState<BuilderMode>('edit');

    return (
        <div className="absolute inset-0 flex flex-col overflow-hidden bg-white text-slate-900">
            <Toolbar
                fileLabel={props.fileLabel}
                isDirty={props.isDirty}
                mode={mode}
                onModeChange={setMode}
                onNew={props.onNew}
                onOpen={props.onOpen}
                onSave={props.onSave}
                onSaveAs={props.onSaveAs}
                onExportReact={props.onExportReact}
                onExportSchema={props.onExportSchema}
            />
            <div className="min-h-0 flex-1">
                {mode === 'edit' ? (
                    <Puck key={props.formKey} config={formBuilderConfig} data={props.data} onChange={props.onDataChange}>
                        <div className="flex h-full min-h-0 w-full">
                            <div className="w-56 shrink-0 overflow-auto border-r border-slate-200 bg-slate-50">
                                <Puck.Components />
                            </div>
                            <div className="min-w-0 flex-1 overflow-auto bg-slate-100">
                                <Puck.Preview />
                            </div>
                            <div className="w-80 shrink-0 overflow-auto border-l border-slate-200 bg-slate-50">
                                <Puck.Fields />
                            </div>
                        </div>
                    </Puck>
                ) : (
                    <div className="h-full w-full overflow-auto bg-slate-100">
                        <div className="mx-auto min-h-full max-w-3xl bg-white shadow-sm">
                            <Render key={props.formKey} config={formBuilderConfig} data={props.data} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
