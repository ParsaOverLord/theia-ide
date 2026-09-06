/**
 * Identifiers shared across the browser-side pieces of the extension.
 * Kept in `common/` (rather than inlined in `browser/`) so they stay easy to
 * find, and so a future backend contribution could import them too.
 */
export const FORM_BUILDER_WIDGET_ID = 'form-builder:widget';
export const FORM_BUILDER_WIDGET_LABEL = 'Form Builder';

/** Suggested (double) extension for files that store a serialized Puck `Data` document. */
export const FORM_FILE_SUGGESTED_EXTENSION = 'form.json';
