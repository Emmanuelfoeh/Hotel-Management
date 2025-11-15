'use server';

import { z } from 'zod';
import { sendContactEmail } from '@/lib/services/email.service';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export async function submitContactForm(data: ContactFormData) {
  try {
    // Validate the form data
    const validatedData = contactFormSchema.parse(data);

    // Send the email
    const result = await sendContactEmail(validatedData);

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to send message. Please try again.',
      };
    }

    return {
      success: true,
      message:
        "Your message has been sent successfully! We'll get back to you soon.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }

    console.error('Contact form submission error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}
