// Room validations
export {
  createRoomSchema,
  updateRoomSchema,
  roomIdSchema,
  roomSearchSchema,
  RoomTypeSchema,
  RoomStatusSchema,
  type CreateRoomInput,
  type UpdateRoomInput,
  type RoomSearchInput,
  type RoomType,
  type RoomStatus,
} from './room';

// Booking validations
export {
  createBookingSchema,
  updateBookingSchema,
  bookingIdSchema,
  checkInSchema,
  checkOutSchema,
  cancelBookingSchema,
  bookingSearchSchema,
  bookingCalendarSchema,
  BookingStatusSchema,
  PaymentStatusSchema,
  BookingSourceSchema,
  type CreateBookingInput,
  type UpdateBookingInput,
  type BookingSearchInput,
  type BookingCalendarInput,
  type BookingStatus,
  type PaymentStatus,
  type BookingSource,
} from './booking';

// Customer validations
export {
  createCustomerSchema,
  updateCustomerSchema,
  customerIdSchema,
  customerSearchSchema,
  type CreateCustomerInput,
  type UpdateCustomerInput,
  type CustomerSearchInput,
} from './customer';

// Staff validations
export {
  createStaffSchema,
  updateStaffSchema,
  updateStaffPasswordSchema,
  staffIdSchema,
  staffLoginSchema,
  staffSearchSchema,
  StaffRoleSchema,
  type CreateStaffInput,
  type UpdateStaffInput,
  type UpdateStaffPasswordInput,
  type StaffLoginInput,
  type StaffSearchInput,
  type StaffRole,
} from './staff';

// Payment validations
export {
  initializePaymentSchema,
  verifyPaymentSchema,
  updatePaymentStatusSchema,
  getPaymentByBookingSchema,
  getPaymentByReferenceSchema,
  paystackWebhookSchema,
  PaymentMethodSchema,
  PaymentStatusSchema as PaymentStatusSchemaFromPayment,
  type InitializePaymentInput,
  type VerifyPaymentInput,
  type UpdatePaymentStatusInput,
  type GetPaymentByBookingInput,
  type GetPaymentByReferenceInput,
  type PaystackWebhookEvent,
  type PaymentMethod,
} from './payment';

// Validation helpers
export {
  validateData,
  validateOrThrow,
  validateSafe,
  formatZodError,
  getFieldErrors,
  validateMultiple,
  createPartialSchema,
  paginationSchema,
  dateRangeSchema,
  idSchema,
  commonPatterns,
  sanitizeString,
  parseNumber,
  parseDate,
  type ValidationResult,
  type PaginationInput,
  type DateRangeInput,
} from './helpers';
