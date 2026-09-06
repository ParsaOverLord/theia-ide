import * as React from 'react';

export type BuilderMode = 'edit' | 'preview';

export interface ToolbarProps {
    fileLabel: string;
    isDirty: boolean;
    mode: BuilderMode;
    onModeChange: (mode: BuilderMode) => void;
    onNew: () => void;
    onOpen: () => void;
    onSave: () => void;
    onSaveAs: () => void;
    onExportReact: () => void;
    onExportSchema: () => void;
}

const BUTTON =
    'inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium ' +
    'text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30';

const PRIMARY_BUTTON =
    'inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium ' +
    'text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40';

export function Toolbar(props: ToolbarProps): React.JSX.Element {
    return (
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-2">
            <div className="flex flex-wrap items-center gap-1">
                <button type="button" className={BUTTON} onClick={props.onNew}>
                    New
                </button>
                <button type="button" className={BUTTON} onClick={props.onOpen}>
                    Open…
                </button>
                <button type="button" className={PRIMARY_BUTTON} onClick={props.onSave}>
                    Save
                </button>
                <button type="button" className={BUTTON} onClick={props.onSaveAs}>
                    Save As…
                </button>
                <div className="mx-1 h-4 w-px bg-slate-200" aria-hidden="true" />
                <button type="button" className={BUTTON} onClick={props.onExportReact}>
                    Export React
                </button>
                <button type="button" className={BUTTON} onClick={props.onExportSchema}>
                    Export Schema
                </button>
            </div>
            <div className="flex items-center gap-3">
                <span className="max-w-[16rem] truncate text-xs text-slate-500">
                    {props.fileLabel}
                    {props.isDirty ? ' • unsaved changes' : ''}
                </span>
                <div className="flex items-center rounded-md border border-slate-200 p-0.5 text-xs">
                    <button
                        type="button"
                        className={`rounded px-2 py-1 transition-colors ${
                            props.mode === 'edit' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        onClick={() => props.onModeChange('edit')}
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        className={`rounded px-2 py-1 transition-colors ${
                            props.mode === 'preview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        onClick={() => props.onModeChange('preview')}
                    >
                        Preview
                    </button>
                </div>
            </div>
        </div>
    );
}
