import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ScoutStore } from '../../core/scoutState/scout.store';
import { ContactInquiry } from '../../core/models/scout.model';
import {
  CONTACT_PAGE_CONTENT,
  EMPLOYEE_COUNT_OPTIONS,
  CONTACT_FORM_CONFIG
} from '../../core/constants/scout-constants';

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
  readonly employeeCountOptions = EMPLOYEE_COUNT_OPTIONS;

  readonly contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(CONTACT_FORM_CONFIG.MIN_NAME_LENGTH)]],
    email: ['', [Validators.required, Validators.email]],
    company: [''],
    employeeCount: [''],
    message: [
      '',
      [
        Validators.required,
        Validators.minLength(CONTACT_FORM_CONFIG.MIN_MESSAGE_LENGTH),
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

    const payload = this.contactForm.getRawValue() as ContactInquiry;
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
