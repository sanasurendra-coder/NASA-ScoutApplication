export const CONTACT_PAGE_CONTENT = {
  HEADER: {
    TITLE: 'Contact Us',
    DESCRIPTION: 'Building with shadcn/ui and Tailwind? Ask us about blocks, components, or copy-paste sections—we read every message.'
  },
  CORPORATE_OFFICE: {
    TITLE: 'Corporate office',
    ADDRESS_LINE_1: '1200 Framework Boulevard',
    ADDRESS_LINE_2: 'San Francisco, CA 94102, United States'
  },
  GET_IN_TOUCH: {
    TITLE: 'Get in touch',
    PHONE: '+1 (555) 010-2400',
    EMAIL: 'hello@shadcnblocks.com',
    EMAIL_DISPLAY: 'hello@shadcnblocks.com',
    WEBSITE_LABEL: 'shadcnblocks.com',
    WEBSITE_URL: 'https://shadcnblocks.com'
  },
  FOLLOW_US: {
    TITLE: 'Follow us',
    FACEBOOK_URL: 'https://facebook.com',
    X_URL: 'https://x.com',
    LINKEDIN_URL: 'https://linkedin.com'
  },
  INQUIRIES: {
    SECTION_TITLE: 'Inquiries',
    FIELDS: {
      NAME: {
        LABEL: 'Full name',
        PLACEHOLDER: 'Jordan Rivera',
        ERROR: 'Please enter your full name.'
      },
      EMAIL: {
        LABEL: 'Work email address',
        PLACEHOLDER: 'you@company.com',
        ERROR: 'Please enter a valid work email address.'
      },
      COMPANY: {
        LABEL: 'Company name',
        PLACEHOLDER: 'Optional'
      },
      EMPLOYEE_COUNT: {
        LABEL: 'Number of employees',
        PLACEHOLDER: 'e.g. 10–50',
        ERROR: 'Please enter a valid count or range (e.g., 25, 10–50, 100+).'
      },
      MESSAGE: {
        LABEL: 'Your message',
        PLACEHOLDER: 'Tell us what you are building...',
        ERROR: 'Message must be at least 10 characters long.'
      }
    },
    BUTTONS: {
      SUBMIT: 'Submit',
      SUBMITTING: 'Submitting...',
      SEND_ANOTHER: 'Send another message'
    },
    SUCCESS: {
      TITLE: 'Thank you !',
      MESSAGE: 'Your query has been delivered. We review every message and will be in touch shortly.'
    }
  }
} as const;


export const CONTACT_FORM_CONFIG = {
  MIN_NAME_LENGTH: 2,
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 1000,
  SIMULATED_DELAY_MS: 1200,
  SIMULATED_GATEWAY_REJECT: 'Telemetry gateway rejected. Kindly check your submission details.',
  GENERIC_FAILURE: 'Failed to dispatch inquiry. Try again later.'
} as const;

export const DEFAULT_LOADING_MESSAGE = 'Loading candidate data';
