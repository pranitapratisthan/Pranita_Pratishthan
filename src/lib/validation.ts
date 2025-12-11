import { z } from 'zod';

// Feedback form validation schema
export const feedbackSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'नाव आवश्यक आहे')
    .max(100, 'नाव 100 अक्षरांपेक्षा कमी असावे'),
  email: z.string()
    .trim()
    .email('वैध ईमेल पत्ता प्रविष्ट करा')
    .max(255, 'ईमेल 255 अक्षरांपेक्षा कमी असावे')
    .optional()
    .or(z.literal('')),
  contact_number: z.string()
    .regex(/^[0-9]{10}$/, '10 अंकी मोबाइल नंबर प्रविष्ट करा')
    .optional()
    .or(z.literal('')),
  feedback: z.string()
    .trim()
    .min(1, 'प्रतिक्रिया आवश्यक आहे')
    .max(2000, 'प्रतिक्रिया 2000 अक्षरांपेक्षा कमी असावी'),
  suggestion: z.string()
    .trim()
    .max(2000, 'सुचना 2000 अक्षरांपेक्षा कमी असावी')
    .optional()
    .or(z.literal('')),
  rating: z.number()
    .min(0)
    .max(5)
    .optional()
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;

// Rental form validation schema
export const rentalFormSchema = z.object({
  patientName: z.string()
    .trim()
    .min(1, 'Patient name is required')
    .max(100, 'Patient name must be less than 100 characters'),
  mobileNumber: z.string()
    .regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'),
  equipmentId: z.string()
    .min(1, 'Please select equipment'),
  pickupDate: z.string()
    .min(1, 'Pickup date is required')
});

export type RentalFormData = z.infer<typeof rentalFormSchema>;

// Validate and return errors if any
export function validateFeedback(data: {
  name: string;
  email: string;
  contactNumber: string;
  feedback: string;
  suggestion: string;
  rating: number;
}): { success: true; data: FeedbackFormData } | { success: false; error: string } {
  const result = feedbackSchema.safeParse({
    name: data.name,
    email: data.email || undefined,
    contact_number: data.contactNumber || undefined,
    feedback: data.feedback,
    suggestion: data.suggestion || undefined,
    rating: data.rating || undefined
  });

  if (!result.success) {
    const firstError = result.error.errors[0];
    return { success: false, error: firstError.message };
  }

  return { success: true, data: result.data };
}

export function validateRental(data: RentalFormData): { success: true; data: RentalFormData } | { success: false; error: string } {
  const result = rentalFormSchema.safeParse(data);

  if (!result.success) {
    const firstError = result.error.errors[0];
    return { success: false, error: firstError.message };
  }

  return { success: true, data: result.data };
}
