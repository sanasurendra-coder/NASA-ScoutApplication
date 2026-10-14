import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { ScoutStore } from '../../core/scoutState/scout.store';
import { ContactInquiry } from '../../core/models/scout.model';
import {
  CONTACT_PAGE_CONTENT,
  CONTACT_FORM_CONFIG
} from '../../core/constants/scout-constants';

function minNonWhitespace(minLength: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    const trimmed = value.trim();
    return trimmed.length < minLength
      ? { minNonWhitespace: { requiredLength: minLength, actualLength: trimmed.length } }
      : null;
  };
}

function employeeCountValidator(control: AbstractControl): ValidationErrors | null {
  const rawValue = control.value;
  if (!rawValue || typeof rawValue !== 'string') return null;

  const value = rawValue.trim();
  if (value.length === 0) return null;

  const validPattern = /^\d+(\s*[-–]\s*\d+)?\s*\+?$/;
  return validPattern.test(value) ? null : { invalidEmployeeCount: true };
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  readonly store = inject(ScoutStore);
  readonly content = CONTACT_PAGE_CONTENT;

  readonly contactForm = this.fb.group({
    name: [
      '',
      [Validators.required, minNonWhitespace(CONTACT_FORM_CONFIG.MIN_NAME_LENGTH)]
    ],
    email: [
      '',
      [Validators.required, Validators.email]
    ],
    company: [''],
    employeeCount: ['', [employeeCountValidator]],
    message: [
      '',
      [
        Validators.required,
        minNonWhitespace(CONTACT_FORM_CONFIG.MIN_MESSAGE_LENGTH),
        Validators.maxLength(CONTACT_FORM_CONFIG.MAX_MESSAGE_LENGTH)
      ]
    ]
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const raw = this.contactForm.getRawValue();
    const payload: ContactInquiry = {
      name: (raw.name || '').trim(),
      email: (raw.email || '').trim(),
      company: raw.company ? raw.company.trim() : undefined,
      employeeCount: raw.employeeCount ? raw.employeeCount.trim() : undefined,
      message: (raw.message || '').trim()
    };

    const success = await this.store.submitInquiry(payload);
    if (success) {
      this.contactForm.reset();
    }
  }

  onSendAnother(): void {
    this.store.resetContactForm();
    this.contactForm.reset();
  }
}
