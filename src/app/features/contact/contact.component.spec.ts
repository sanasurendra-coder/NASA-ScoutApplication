import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ContactComponent } from './contact.component';
import { ScoutStore } from '../../core/scoutState/scout.store';
import { CONTACT_PAGE_CONTENT } from '../../core/constants/scout-constants';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;


  let mockContactStatus: ReturnType<typeof signal<'idle' | 'submitting' | 'success' | 'error'>>;
  let mockContactError: ReturnType<typeof signal<string | null>>;
  let mockSubmitInquiry: ReturnType<typeof vi.fn>;
  let mockResetContactForm: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    mockContactStatus = signal<'idle' | 'submitting' | 'success' | 'error'>('idle');
    mockContactError = signal<string | null>(null);
    mockSubmitInquiry = vi.fn().mockResolvedValue(true);
    mockResetContactForm = vi.fn().mockImplementation(() => {
      mockContactStatus.set('idle');
      mockContactError.set(null);
    });

    const mockStore = {
      contactStatus: mockContactStatus,
      contactError: mockContactError,
      submitInquiry: mockSubmitInquiry,
      resetContactForm: mockResetContactForm
    };

    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        { provide: ScoutStore, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component instance', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial Form State', () => {
    it('should initialize with an empty and invalid form', () => {
      expect(component.contactForm.valid).toBe(false);
      expect(component.contactForm.get('name')?.value).toBe('');
      expect(component.contactForm.get('email')?.value).toBe('');
      expect(component.contactForm.get('company')?.value).toBe('');
      expect(component.contactForm.get('employeeCount')?.value).toBe('');
      expect(component.contactForm.get('message')?.value).toBe('');
    });

    it('should not mark fields as invalid initially (untouched and pristine)', () => {
      expect(component.isFieldInvalid('name')).toBe(false);
      expect(component.isFieldInvalid('email')).toBe(false);
      expect(component.isFieldInvalid('message')).toBe(false);
    });
  });

  describe('Form Validation Rules', () => {
    it('should flag name as invalid if empty or only whitespace', () => {
      const nameControl = component.contactForm.get('name');

      nameControl?.setValue('   ');
      nameControl?.markAsTouched();
      expect(nameControl?.valid).toBe(false);
      expect(component.isFieldInvalid('name')).toBe(true);

      nameControl?.setValue('A');
      expect(nameControl?.valid).toBe(false);

      nameControl?.setValue('Jane Doe');
      expect(nameControl?.valid).toBe(true);
    });

    it('should validate email format', () => {
      const emailControl = component.contactForm.get('email');

      emailControl?.setValue('not-an-email');
      emailControl?.markAsTouched();
      expect(emailControl?.valid).toBe(false);
      expect(component.isFieldInvalid('email')).toBe(true);

      emailControl?.setValue('jane@domain.com');
      expect(emailControl?.valid).toBe(true);
    });

    describe('Employee Count Custom Validator', () => {
      it('should allow blank or optional values', () => {
        const empControl = component.contactForm.get('employeeCount');

        empControl?.setValue('');
        expect(empControl?.valid).toBe(true);

        empControl?.setValue('   ');
        expect(empControl?.valid).toBe(true);
      });

      it('should accept valid number formats and ranges', () => {
        const empControl = component.contactForm.get('employeeCount');
        const validSamples = ['10', '10-50', '10 - 50', '10–50', '100+', '500 +'];

        for (const sample of validSamples) {
          empControl?.setValue(sample);
          expect(empControl?.valid).toBe(true);
        }
      });

      it('should reject invalid strings and alphabet inputs', () => {
        const empControl = component.contactForm.get('employeeCount');
        const invalidSamples = ['wert', 'abc', '-10', '10-abc', 'one hundred'];

        for (const sample of invalidSamples) {
          empControl?.setValue(sample);
          empControl?.markAsTouched();
          expect(empControl?.valid).toBe(false);
          expect(empControl?.hasError('invalidEmployeeCount')).toBe(true);
        }
      });
    });

    describe('Message Validation', () => {
      it('should reject messages with less than 10 non-whitespace characters', () => {
        const messageControl = component.contactForm.get('message');

        messageControl?.setValue('          ');
        expect(messageControl?.valid).toBe(false);

        messageControl?.setValue('Short');
        expect(messageControl?.valid).toBe(false);

        messageControl?.setValue('This is a valid message over 10 chars.');
        expect(messageControl?.valid).toBe(true);
      });
    });
  });

  describe('Form Submission', () => {
    it('should not call store.submitInquiry and mark all fields as touched if form is invalid', async () => {
      await component.onSubmit();

      expect(mockSubmitInquiry).not.toHaveBeenCalled();
      expect(component.contactForm.touched).toBe(true);
      expect(component.isFieldInvalid('name')).toBe(true);
      expect(component.isFieldInvalid('email')).toBe(true);
      expect(component.isFieldInvalid('message')).toBe(true);
    });

    it('should trim string inputs and call store.submitInquiry with cleaned payload when valid', async () => {
      component.contactForm.setValue({
        name: '   Dr. Eleanor Arroway   ',
        email: 'arroway@seti.org',
        company: '   SETI Institute   ',
        employeeCount: '10-50',
        message: '   Need dedicated ephemeris feeds for validation.   '
      });

      await component.onSubmit();

      expect(mockSubmitInquiry).toHaveBeenCalledWith({
        name: 'Dr. Eleanor Arroway',
        email: 'arroway@seti.org',
        company: 'SETI Institute',
        employeeCount: '10-50',
        message: 'Need dedicated ephemeris feeds for validation.'
      });
    });

    it('should reset the form on successful inquiry dispatch', async () => {
      component.contactForm.setValue({
        name: 'Dr. Eleanor Arroway',
        email: 'arroway@seti.org',
        company: '',
        employeeCount: '',
        message: 'Valid inquiry message text exceeding 10 characters.'
      });

      await component.onSubmit();

      expect(mockSubmitInquiry).toHaveBeenCalled();
      expect(component.contactForm.get('name')?.value).toBeNull();
      expect(component.contactForm.get('email')?.value).toBeNull();
      expect(component.contactForm.get('message')?.value).toBeNull();
    });
  });

  describe('Reset and Flow Controls', () => {
    it('should trigger store.resetContactForm and reset component form on onSendAnother()', () => {
      component.contactForm.patchValue({ name: 'Jordan' });

      component.onSendAnother();

      expect(mockResetContactForm).toHaveBeenCalled();
      expect(component.contactForm.get('name')?.value).toBeNull();
    });
  });

  describe('DOM Rendering', () => {
    it('should render header and static text from CONTACT_PAGE_CONTENT', () => {
      const headerTitle = fixture.nativeElement.querySelector('.main-title');
      const headerDesc = fixture.nativeElement.querySelector('.main-description');

      expect(headerTitle.textContent).toContain(CONTACT_PAGE_CONTENT.HEADER.TITLE);
      expect(headerDesc.textContent).toContain(CONTACT_PAGE_CONTENT.HEADER.DESCRIPTION);
    });

    it('should display the success box when store contactStatus is success', () => {
      mockContactStatus.set('success');
      fixture.detectChanges();

      const successBox = fixture.nativeElement.querySelector('.success-box');
      const form = fixture.nativeElement.querySelector('form');

      expect(successBox).toBeTruthy();
      expect(form).toBeFalsy();
    });
  });
});
