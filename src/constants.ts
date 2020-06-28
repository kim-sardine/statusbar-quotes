export const EXTENSION_ID: string = 'statusbar-quotes';

export const DEFAULT_DISPLAY_SECONDS: number = 10;
export const MAXIMUM_DISPLAY_SECONDS: number = 86400; // 1 hour
export const MAXIMUM_DISPLAY_SECONDS_HUMANIZE: string = '1 hour';

export const CATEGORY_ALL: string = 'All';
export const CATEGORY_WISE_SAYING: string = 'Wise Saying';
export const CATEGORY_PROGRAMMING: string = 'Programming';
export const CATEGORY_STARTUP: string = 'Startup';

export const LANG_KOREAN: string = 'Korean';
export const LANG_ENGLISH: string = 'English';

export const CMD_CHANGE_CATEGORY: string = `${EXTENSION_ID}.change-category`;
export const CMD_CHANGE_LANGUAGE: string = `${EXTENSION_ID}.change-language`;
export const CMD_CHANGE_DISPLAY_SECONDS: string = `${EXTENSION_ID}.change-display-seconds`;
export const CMD_SHOW_QUOTE_ON_MODAL: string = `${EXTENSION_ID}.show-quote-on-modal`;
export const CMD_SHUFFLE_QUOTES: string = `${EXTENSION_ID}.shuffle-quotes`;

export const SETTING_CATEGORY: string = `${EXTENSION_ID}.category`;
export const SETTING_LANGUAGE: string = `${EXTENSION_ID}.language`;
export const SETTING_DISPLAY_SECONDS: string = `${EXTENSION_ID}.display-seconds`;
