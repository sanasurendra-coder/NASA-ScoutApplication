export const CONTACT_PAGE_CONTENT = {
  TITLE: 'Contact Us',
  DESCRIPTION: 'Building Applications with shadcn/ui and Tailwind? Ask us about blocks, components, or copy-paste sections we read every message. Lets Connect'
} as const;

export const EMPLOYEE_COUNT_OPTIONS: readonly string[] = [
  '1 - 10 researchers',
  '11 - 50 staff',
  '51 - 250 enterprise',
  '250+ organization'
] as const;

export const CONTACT_FORM_CONFIG = {
  MIN_NAME_LENGTH: 2,
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 1000,
  SIMULATED_DELAY_MS: 1200,
  SIMULATED_GATEWAY_REJECT: 'Telemetry gateway rejected. Check your submission details here.',
  GENERIC_FAILURE: 'Failed to dispatch inquiry. Please try again later.'
} as const;

export const DEFAULT_LOADING_MESSAGE = 'Loading candidate data';
