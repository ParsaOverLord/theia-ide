/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 *
 * SPDX-License-Identifier: MIT
 ********************************************************************************/

import { BaseWidget, LabelProvider, Message, Navigatable, NavigatableWidgetOptions } from '@theia/core/lib/browser';
import { injectable, inject } from '@theia/core/shared/inversify';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import URI from '@theia/core/lib/common/uri';

export const DashboardWidgetOptions = Symbol('DashboardWidgetOptions');

export interface DashboardWidgetOptions extends NavigatableWidgetOptions {
    uri: string;
}

interface DashboardData {
    host: string;
    port: number | undefined;
}

const DASHBOARD_HTML =
    `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Server Configuration</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
<style>
    body { font-family: 'Inter', sans-serif; }
</style>
<script id="tailwind-config">
  tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        "colors": {
                "secondary-fixed-dim": "#b1c5ff",
                "on-secondary-container": "#fefcff",
                "surface-tint": "#565e70",
                "on-error-container": "#93000a",
                "on-surface-variant": "#45474c",
                "placeholder": "#7C8B9D",
                "on-secondary-fixed-variant": "#00419e",
                "surface-variant": "#d5e4f8",
                "surface-neutral": "#E6E9EC",
                "ui-decorative": "#D1D9E2",
                "on-tertiary-fixed-variant": "#614000",
                "error": "#ba1a1a",
                "on-primary-fixed-variant": "#3f4758",
                "primary-fixed-dim": "#bfc6db",
                "on-dark": "#F8F9FB",
                "on-secondary-fixed": "#001946",
                "outline-variant": "#c6c6cc",
                "secondary-fixed": "#dae2ff",
                "on-primary-container": "#979fb2",
                "outline": "#76777d",
                "inverse-surface": "#243241",
                "surface-container-lowest": "#ffffff",
                "inverse-on-surface": "#e9f1ff",
                "inverse-primary": "#bfc6db",
                "on-error": "#ffffff",
                "on-primary-fixed": "#141c2b",
                "surface-muted": "#F9FBFD",
                "secondary": "#0055c9",
                "secondary-container": "#2f6ee7",
                "surface-container-highest": "#d5e4f8",
                "on-tertiary-fixed": "#281800",
                "on-tertiary": "#ffffff",
                "tertiary-container": "#4b3100",
                "on-secondary": "#ffffff",
                "primary": "#2e3646",
                "surface-container-high": "#dbe9fd",
                "surface": "#f8f9ff",
                "primary-container": "#2e3646",
                "primary-fixed": "#dbe2f7",
                "error-container": "#ffdad6",
                "on-background": "#0e1d2b",
                "surface-container-low": "#eef4ff",
                "tertiary-fixed": "#ffddb0",
                "background": "#f8f9ff",
                "on-primary": "#ffffff",
                "surface-dim": "#cddbef",
                "on-tertiary-container": "#c89646",
                "surface-container": "#e4efff",
                "tertiary-fixed-dim": "#f4bd69",
                "tertiary": "#2f1d00",
                "surface-bright": "#f8f9ff",
                "on-surface": "#0e1d2b"
        },
        "borderRadius": {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
        },
        "spacing": {
                "xs": "4px",
                "md": "16px",
                "lg": "24px",
                "base": "4px",
                "gutter": "16px",
                "margin-mobile": "16px",
                "xl": "32px",
                "margin-desktop": "32px",
                "sm": "8px"
        },
        "fontFamily": {
                "label-xs": [
                        "Inter"
                ],
                "body-lg": [
                        "Inter"
                ],
                "headline-lg-mobile": [
                        "Inter"
                ],
                "label-sm": [
                        "Inter"
                ],
                "headline-lg": [
                        "Inter"
                ],
                "headline-sm": [
                        "Inter"
                ],
                "label-md": [
                        "Inter"
                ],
                "headline-md": [
                        "Inter"
                ],
                "body-md": [
                        "Inter"
                ],
                "body-sm": [
                        "Inter"
                ]
        },
        "fontSize": {
                "label-xs": [
                        "12px",
                        {
                                "lineHeight": "16px",
                                "letterSpacing": "0.02em",
                                "fontWeight": "600"
                        }
                ],
                "body-lg": [
                        "16px",
                        {
                                "lineHeight": "24px",
                                "fontWeight": "400"
                        }
                ],
                "headline-lg-mobile": [
                        "28px",
                        {
                                "lineHeight": "36px",
                                "fontWeight": "700"
                        }
                ],
                "label-sm": [
                        "14px",
                        {
                                "lineHeight": "18px",
                                "fontWeight": "600"
                        }
                ],
                "headline-lg": [
                        "32px",
                        {
                                "lineHeight": "40px",
                                "letterSpacing": "-0.02em",
                                "fontWeight": "700"
                        }
                ],
                "headline-sm": [
                        "20px",
                        {
                                "lineHeight": "28px",
                                "fontWeight": "600"
                        }
                ],
                "label-md": [
                        "15px",
                        {
                                "lineHeight": "20px",
                                "fontWeight": "600"
                        }
                ],
                "headline-md": [
                        "24px",
                        {
                                "lineHeight": "32px",
                                "letterSpacing": "-0.01em",
                                "fontWeight": "600"
                        }
                ],
                "body-md": [
                        "15px",
                        {
                                "lineHeight": "22px",
                                "fontWeight": "500"
                        }
                ],
                "body-sm": [
                        "14px",
                        {
                                "lineHeight": "20px",
                                "fontWeight": "400"
                        }
                ]
        }
},
    },
  }
</script>
</head>
<body class="bg-surface-muted text-on-background min-h-screen flex items-start justify-center p-margin-mobile md:p-margin-desktop antialiased">
<div class="w-full max-w-4xl bg-surface-container-lowest rounded-lg border border-ui-decorative p-lg shadow-sm">
<div class="mb-lg border-b border-outline-variant pb-md">
<h3 class="text-headline-sm font-headline-sm text-primary mb-xs">Server Configuration &amp; Deployment</h3>
<p class="text-body-sm font-body-sm text-on-surface-variant">Set server connection settings and select sections to deploy.</p>
</div>
<form class="flex flex-col gap-lg" id="deployForm">
<!-- Server Settings Row -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-md">
<div class="flex flex-col gap-sm">
<label class="text-label-md font-label-md text-on-surface" for="hostInput">HOST <span class="text-error">*</span></label>
<input class="bg-surface-neutral border border-transparent rounded-lg py-sm px-md text-body-md font-body-md focus:ring-1
focus:ring-primary-container outline-none w-full h-[40px] hover:bg-surface-container-highest transition-colors" id="hostInput" placeholder="Example: 192.168.1.100" type="text"/>
<span id="hostError" class="text-error text-label-xs hidden">Host is required to deploy.</span>
</div>
<div class="flex flex-col gap-sm">
<label class="text-label-md font-label-md text-on-surface" for="portInput">PORT <span class="text-error">*</span></label>
<input class="bg-surface-neutral border border-transparent rounded-lg py-sm px-md text-body-md font-body-md
focus:ring-1 focus:ring-primary-container
outline-none w-full h-[40px] hover:bg-surface-container-highest transition-colors" id="portInput" placeholder="Example: 8080" type="number"/>
<span id="portError" class="text-error text-label-xs hidden">Port is required to deploy.</span>
</div>
</div>
<!-- Deployment Options Header -->
<div class="flex flex-row justify-between items-center border-b border-outline-variant pb-sm">
<label class="text-headline-sm font-headline-sm text-primary">Deployable Sections</label>
<label class="flex items-center gap-xs cursor-pointer group">
<input class="w-4 h-4 text-primary-container bg-surface-neutral border-outline-variant rounded focus:ring-primary-container" id="selectAllGlobal" type="checkbox"/>
<span class="text-label-md font-label-md text-on-surface-variant group-hover:text-primary transition-colors">Select All Sections</span>
</label>
</div>
<!-- Deployment Categories Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
<!-- Forms Section -->
<div class="flex flex-col border border-ui-decorative rounded-lg bg-surface-container-lowest overflow-hidden">
<div class="flex items-center justify-between p-sm bg-surface-neutral border-b border-outline-variant">
<span class="text-label-md font-label-md text-on-surface">Forms</span>
<label class="flex items-center gap-xs cursor-pointer group">
<input class="w-4 h-4 text-primary-container bg-surface-container-lowest
border-outline-variant rounded focus:ring-primary-container section-all" data-target="forms-group" type="checkbox"/>
<span class="text-label-xs font-label-xs text-on-surface-variant">All</span>
</label>
</div>
<div class="p-sm flex flex-col gap-sm max-h-[200px] overflow-y-auto" id="forms-group">
<label class="flex items-center gap-sm cursor-pointer p-xs hover:bg-surface-container-low rounded transition-colors group">
<input class="w-4 h-4 text-primary-container bg-surface-neutral border-outline-variant rounded focus:ring-primary-container item-check" type="checkbox"/>
<span class="text-body-sm font-body-sm text-on-surface-variant group-hover:text-on-surface">Registration_Form.html</span>
</label>
<label class="flex items-center gap-sm cursor-pointer p-xs hover:bg-surface-container-low rounded transition-colors group">
<input class="w-4 h-4 text-primary-container bg-surface-neutral border-outline-variant rounded focus:ring-primary-container item-check" type="checkbox"/>
<span class="text-body-sm font-body-sm text-on-surface-variant group-hover:text-on-surface">Feedback_Survey.html</span>
</label>
<label class="flex items-center gap-sm cursor-pointer p-xs hover:bg-surface-container-low rounded transition-colors group">
<input class="w-4 h-4 text-primary-container bg-surface-neutral border-outline-variant rounded focus:ring-primary-container item-check" type="checkbox"/>
<span class="text-body-sm font-body-sm text-on-surface-variant group-hover:text-on-surface">Contact_Us_v2.html</span>
</label>
<label class="flex items-center gap-sm cursor-pointer p-xs hover:bg-surface-container-low rounded transition-colors group">
<input class="w-4 h-4 text-primary-container bg-surface-neutral border-outline-variant rounded focus:ring-primary-container item-check" type="checkbox"/>
<span class="text-body-sm font-body-sm text-on-surface-variant group-hover:text-on-surface">Order_Checkout.html</span>
</label>
</div>
</div>
<!-- Domains Section -->
<div class="flex flex-col border border-ui-decorative rounded-lg bg-surface-container-lowest overflow-hidden">
<div class="flex items-center justify-between p-sm bg-surface-neutral border-b border-outline-variant">
<span class="text-label-md font-label-md text-on-surface">Domains</span>
<label class="flex items-center gap-xs cursor-pointer group">
<input class="w-4 h-4 text-primary-container bg-surface-container-lowest
border-outline-variant rounded focus:ring-primary-container section-all" data-target="domains-group" type="checkbox"/>
<span class="text-label-xs font-label-xs text-on-surface-variant">All</span>
</label>
</div>
<div class="p-sm flex flex-col gap-sm max-h-[200px] overflow-y-auto" id="domains-group">
<label class="flex items-center gap-sm cursor-pointer p-xs hover:bg-surface-container-low rounded transition-colors group">
<input class="w-4 h-4 text-primary-container bg-surface-neutral border-outline-variant rounded focus:ring-primary-container item-check" type="checkbox"/>
<span class="text-body-sm font-body-sm text-on-surface-variant group-hover:text-on-surface">api.core-system.com</span>
</label>
<label class="flex items-center gap-sm cursor-pointer p-xs hover:bg-surface-container-low rounded transition-colors group">
<input class="w-4 h-4 text-primary-container bg-surface-neutral border-outline-variant rounded focus:ring-primary-container item-check" type="checkbox"/>
<span class="text-body-sm font-body-sm text-on-surface-variant group-hover:text-on-surface">auth.core-system.com</span>
</label>
<label class="flex items-center gap-sm cursor-pointer p-xs hover:bg-surface-container-low rounded transition-colors group">
<input class="w-4 h-4 text-primary-container bg-surface-neutral border-outline-variant rounded focus:ring-primary-container item-check" type="checkbox"/>
<span class="text-body-sm font-body-sm text-on-surface-variant group-hover:text-on-surface">admin.core-system.com</span>
</label>
</div>
</div>
<!-- Processes Section -->
<div class="flex flex-col border border-ui-decorative rounded-lg bg-surface-container-lowest overflow-hidden">
<div class="flex items-center justify-between p-sm bg-surface-neutral border-b border-outline-variant">
<span class="text-label-md font-label-md text-on-surface">Processes</span>
<label class="flex items-center gap-xs cursor-pointer group">
<input class="w-4 h-4 text-primary-container bg-surface-container-lowest
border-outline-variant rounded focus:ring-primary-container section-all" data-target="processes-group" type="checkbox"/>
<span class="text-label-xs font-label-xs text-on-surface-variant">All</span>
</label>
</div>
<div class="p-sm flex flex-col gap-sm max-h-[200px] overflow-y-auto" id="processes-group">
<label class="flex items-center gap-sm cursor-pointer p-xs hover:bg-surface-container-low rounded transition-colors group">
<input class="w-4 h-4 text-primary-container bg-surface-neutral border-outline-variant rounded focus:ring-primary-container item-check" type="checkbox"/>
<span class="text-body-sm font-body-sm text-on-surface-variant group-hover:text-on-surface">Daily_Backup_Cron.sh</span>
</label>
<label class="flex items-center gap-sm cursor-pointer p-xs hover:bg-surface-container-low rounded transition-colors group">
<input class="w-4 h-4 text-primary-container bg-surface-neutral border-outline-variant rounded focus:ring-primary-container item-check" type="checkbox"/>
<span class="text-body-sm font-body-sm text-on-surface-variant group-hover:text-on-surface">Data_Sync_Worker.js</span>
</label>
<label class="flex items-center gap-sm cursor-pointer p-xs hover:bg-surface-container-low rounded transition-colors group">
<input class="w-4 h-4 text-primary-container bg-surface-neutral border-outline-variant rounded focus:ring-primary-container item-check" type="checkbox"/>
<span class="text-body-sm font-body-sm text-on-surface-variant group-hover:text-on-surface">Email_Queue_Processor.py</span>
</label>
</div>
</div>
<!-- Scripts Section -->
<div class="flex flex-col border border-ui-decorative rounded-lg bg-surface-container-lowest overflow-hidden">
<div class="flex items-center justify-between p-sm bg-surface-neutral border-b border-outline-variant">
<span class="text-label-md font-label-md text-on-surface">Scripts</span>
<label class="flex items-center gap-xs cursor-pointer group">
<input class="w-4 h-4 text-primary-container bg-surface-container-lowest border-outline-variant
rounded focus:ring-primary-container section-all" data-target="scripts-group" type="checkbox"/>
<span class="text-label-xs font-label-xs text-on-surface-variant">All</span>
</label>
</div>
<div class="p-sm flex flex-col gap-sm max-h-[200px] overflow-y-auto" id="scripts-group">
<label class="flex items-center gap-sm cursor-pointer p-xs hover:bg-surface-container-low rounded transition-colors group">
<input class="w-4 h-4 text-primary-container bg-surface-neutral border-outline-variant rounded focus:ring-primary-container item-check" type="checkbox"/>
<span class="text-body-sm font-body-sm text-on-surface-variant group-hover:text-on-surface">analytics-tracking.js</span>
</label>
<label class="flex items-center gap-sm cursor-pointer p-xs hover:bg-surface-container-low rounded transition-colors group">
<input class="w-4 h-4 text-primary-container bg-surface-neutral border-outline-variant rounded focus:ring-primary-container item-check" type="checkbox"/>
<span class="text-body-sm font-body-sm text-on-surface-variant group-hover:text-on-surface">ui-components-bundle.js</span>
</label>
<label class="flex items-center gap-sm cursor-pointer p-xs hover:bg-surface-container-low rounded transition-colors group">
<input class="w-4 h-4 text-primary-container bg-surface-neutral border-outline-variant rounded focus:ring-primary-container item-check" type="checkbox"/>
<span class="text-body-sm font-body-sm text-on-surface-variant group-hover:text-on-surface">vendor-libraries.min.js</span>
</label>
</div>
</div>
<!-- Menus Section -->
<div class="flex flex-col border border-ui-decorative rounded-lg bg-surface-container-lowest overflow-hidden">
<div class="flex items-center justify-between p-sm bg-surface-neutral border-b border-outline-variant">
<span class="text-label-md font-label-md text-on-surface">Menus</span>
<label class="flex items-center gap-xs cursor-pointer group">
<input class="w-4 h-4 text-primary-container bg-surface-container-lowest border-outline-variant
rounded focus:ring-primary-container section-all" data-target="menus-group" type="checkbox"/>
<span class="text-label-xs font-label-xs text-on-surface-variant">All</span>
</label>
</div>
<div class="p-sm flex flex-col gap-sm max-h-[200px] overflow-y-auto" id="menus-group">
<label class="flex items-center gap-sm cursor-pointer p-xs hover:bg-surface-container-low rounded transition-colors group">
<input class="w-4 h-4 text-primary-container bg-surface-neutral border-outline-variant rounded focus:ring-primary-container item-check" type="checkbox"/>
<span class="text-body-sm font-body-sm text-on-surface-variant group-hover:text-on-surface">Top_Navigation_Bar.json</span>
</label>
<label class="flex items-center gap-sm cursor-pointer p-xs hover:bg-surface-container-low rounded transition-colors group">
<input class="w-4 h-4 text-primary-container bg-surface-neutral border-outline-variant rounded focus:ring-primary-container item-check" type="checkbox"/>
<span class="text-body-sm font-body-sm text-on-surface-variant group-hover:text-on-surface">Sidebar_Admin_Links.json</span>
</label>
<label class="flex items-center gap-sm cursor-pointer p-xs hover:bg-surface-container-low rounded transition-colors group">
<input class="w-4 h-4 text-primary-container bg-surface-neutral border-outline-variant rounded focus:ring-primary-container item-check" type="checkbox"/>
<span class="text-body-sm font-body-sm text-on-surface-variant group-hover:text-on-surface">Footer_Navigation.json</span>
</label>
</div>
</div>
</div>
<!-- Action Area -->
<div class="mt-md pt-lg border-t border-outline-variant flex justify-end">
<button class="h-[48px] px-lg bg-primary-container text-on-dark rounded-lg text-label-md font-label-md flex items-center gap-sm hover:bg-inverse-surface
hover:shadow-md active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed" id="deployBtn" type="button">
<span class="material-symbols-outlined text-sm" id="btnIcon">cloud_upload</span>
<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-on-dark hidden" fill="none" id="btnSpinner" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
<path class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
</svg>
<span id="btnText">Deploy</span>
</button>
</div>
</form>
</div>
<script>
        document.addEventListener('DOMContentLoaded', () => {
            const hostInput = document.getElementById('hostInput');
            const portInput = document.getElementById('portInput');
            const hostError = document.getElementById('hostError');
            const portError = document.getElementById('portError');

            const allGlobalCheckbox = document.getElementById('selectAllGlobal');
            const sectionCheckboxes = Array.from(document.querySelectorAll('.section-all'));
            const itemCheckboxes = Array.from(document.querySelectorAll('.item-check'));

            // Pre-fill inputs when loaded from parent widget
            window.addEventListener('message', (event) => {
                const message = event.data;
                if (message && message.type === 'load' && message.data) {
                    if (message.data.host !== undefined) {
                        hostInput.value = message.data.host;
                    }
                    if (message.data.port !== undefined && message.data.port !== null) {
                        portInput.value = message.data.port;
                    }
                }
            });

            // Clear visual validation styles on typing
            hostInput.addEventListener('input', () => {
                hostInput.classList.remove('border-error');
                hostError.classList.add('hidden');
            });

            portInput.addEventListener('input', () => {
                portInput.classList.remove('border-error');
                portError.classList.add('hidden');
            });

            // Handle Global "Select All"
            allGlobalCheckbox.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                sectionCheckboxes.forEach(cb => cb.checked = isChecked);
                itemCheckboxes.forEach(cb => cb.checked = isChecked);
            });

            // Handle Section "Select All"
            sectionCheckboxes.forEach(sectionCb => {
                sectionCb.addEventListener('change', (e) => {
                    const isChecked = e.target.checked;
                    const targetGroupId = sectionCb.getAttribute('data-target');
                    const groupItems = Array.from(document.querySelectorAll(\`#\${targetGroupId} .item-check\`));
                    
                    groupItems.forEach(cb => cb.checked = isChecked);
                    updateGlobalCheckbox();
                });
            });

            // Handle Individual Item Checkboxes
            itemCheckboxes.forEach(itemCb => {
                itemCb.addEventListener('change', () => {
                    updateSectionCheckboxes();
                    updateGlobalCheckbox();
                });
            });

            function updateSectionCheckboxes() {
                sectionCheckboxes.forEach(sectionCb => {
                    const targetGroupId = sectionCb.getAttribute('data-target');
                    const groupItems = Array.from(document.querySelectorAll(\`#\${targetGroupId} .item-check\`));
                    const allGroupChecked = groupItems.every(cb => cb.checked);
                    const someGroupChecked = groupItems.some(cb => cb.checked);
                    
                    sectionCb.checked = allGroupChecked;
                    sectionCb.indeterminate = !allGroupChecked && someGroupChecked;
                });
            }

            function updateGlobalCheckbox() {
                const allItemsChecked = itemCheckboxes.every(cb => cb.checked);
                const someItemsChecked = itemCheckboxes.some(cb => cb.checked);
                
                allGlobalCheckbox.checked = allItemsChecked;
                allGlobalCheckbox.indeterminate = !allItemsChecked && someItemsChecked;
            }

            // Deploy button logic
            const deployBtn = document.getElementById('deployBtn');
            const btnText = document.getElementById('btnText');
            const btnIcon = document.getElementById('btnIcon');
            const btnSpinner = document.getElementById('btnSpinner');

            deployBtn.addEventListener('click', () => {
                const hostVal = hostInput.value.trim();
                const portVal = portInput.value.trim();

                let isValid = true;

                if (!hostVal) {
                    hostInput.classList.add('border-error');
                    hostError.classList.remove('hidden');
                    isValid = false;
                }

                if (!portVal) {
                    portInput.classList.add('border-error');
                    portError.classList.remove('hidden');
                    isValid = false;
                }

                if (!isValid) {
                    return;
                }

                // Post back host & port to parent widget to save to file
                window.parent.postMessage({
                    type: 'change',
                    data: {
                        host: hostVal,
                        port: Number(portVal)
                    }
                }, '*');

                const selectedFiles = itemCheckboxes.filter(cb => cb.checked).length;
                
                // Set loading state
                deployBtn.disabled = true;
                btnIcon.classList.add('hidden');
                btnSpinner.classList.remove('hidden');
                btnText.textContent = \`Deploying \${selectedFiles} files...\`;

                // Simulate deployment delay
                setTimeout(() => {
                    deployBtn.disabled = false;
                    btnIcon.classList.remove('hidden');
                    btnSpinner.classList.add('hidden');
                    btnText.textContent = 'Deploy';
                    
                    // Uncheck all after deploy
                    allGlobalCheckbox.checked = false;
                    allGlobalCheckbox.indeterminate = false;
                    sectionCheckboxes.forEach(cb => { cb.checked = false; cb.indeterminate = false; });
                    itemCheckboxes.forEach(cb => cb.checked = false);
                }, 2000);
            });
        });
    </script>
</body></html>`;

@injectable()
export class DashboardEditorWidget extends BaseWidget implements Navigatable {

    static readonly ID = 'dashboard-editor';

    @inject(DashboardWidgetOptions)
    protected readonly options: DashboardWidgetOptions;

    @inject(LabelProvider)
    protected readonly labelProvider: LabelProvider;

    @inject(FileService)
    protected readonly fileService: FileService;

    protected iframe!: HTMLIFrameElement;

    constructor() {
        super();

        this.id =
            DashboardEditorWidget.ID +
            '_' +
            Math.random()
                .toString(36)
                .substring(2, 9);

        this.title.label = 'Dashboard Config';
        this.title.closable = true;
        this.title.iconClass = 'fa fa-cogs';
    }

    /**
     * Initialize the iframe.
     */
    protected async init(): Promise<void> {
        this.node.innerHTML = `
            <iframe
                id="dashboard-frame"
                style="
                    width: 100%;
                    height: 100%;
                    border: none;
                    display: block;
                "
            ></iframe>
        `;

        this.iframe = this.node.querySelector('#dashboard-frame') as HTMLIFrameElement;

        /*
         * Listen for messages coming from the iframe.
         */
        window.addEventListener('message', this.handleIframeMessage);

        /*
         * Wait until the iframe is ready.
         */
        this.iframe.addEventListener('load', () => {
            this.loadFile();
        });

        /*
         * Load the HTML editor string directly.
         */
        await this.loadHtml();
    }

    /**
     * Load the raw HTML string directly into the iframe via srcdoc.
     */
    protected async loadHtml(): Promise<void> {
        this.iframe.srcdoc = DASHBOARD_HTML;
    }

    /**
     * Read the dashboard JSON file.
     */
    protected async loadFile(): Promise<void> {
        try {
            const uri = new URI(this.options.uri);
            this.title.label = this.labelProvider.getName(uri);

            const file = await this.fileService.read(uri);
            if (!file.value) {
                return;
            }

            const data = JSON.parse(file.value);

            const dashboardData: DashboardData = {
                host: data.host || '',
                port:
                    data.port !== undefined && data.port !== undefined
                        ? Number(data.port)
                        : undefined
            };

            /*
             * Send the existing configuration into the iframe.
             */
            this.iframe.contentWindow?.postMessage(
                {
                    type: 'load',
                    data: dashboardData
                },
                '*'
            );
        } catch (error) {
            console.error('Failed to load dashboard file.', error);
        }
    }

    /**
     * Handle messages sent by the iframe.
     */
    protected handleIframeMessage = (event: MessageEvent): void => {
        const message = event.data;

        if (!message) {
            return;
        }

        if (message.type === 'change') {
            this.saveFile(message.data);
        }
    };

    /**
     * Save data received from the iframe.
     */
    protected async saveFile(data: DashboardData): Promise<void> {
        try {
            const uri = new URI(this.options.uri);

            const contentString = JSON.stringify(data, undefined, 2);

            await this.fileService.write(uri, contentString);
        } catch (error) {
            console.error('Failed to save dashboard file.', error);
        }
    }

    /**
     * The widget is attached to the workbench.
     */
    protected onAfterAttach(msg: Message): void {
        super.onAfterAttach(msg);

        if (!this.iframe) {
            this.init();
        }
    }

    /**
     * Tell Theia which resource this editor represents.
     */
    getResourceUri(): URI | undefined {
        return new URI(this.options.uri);
    }

    /**
     * Required by Navigatable.
     */
    createMoveToUri(targetUri: URI): URI | undefined {
        return targetUri;
    }

    /**
     * Clean up when the widget is destroyed.
     */
    dispose(): void {
        window.removeEventListener('message', this.handleIframeMessage);
        super.dispose();
    }
}
