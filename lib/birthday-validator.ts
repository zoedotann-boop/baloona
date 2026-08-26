import { customizeValidator } from "@rjsf/validator-ajv8"

import { ISRAELI_ID_FORMAT } from "@/lib/birthday-form"
import { isValidIsraeliId } from "@/lib/israeli-id"

/**
 * AJV validator for the booking form, extended with the `israeli-id` format so
 * the ID field is checked with the same checksum the server uses. Built once at
 * module scope — `customizeValidator` compiles the format list eagerly.
 */
export const birthdayValidator = customizeValidator({
  customFormats: { [ISRAELI_ID_FORMAT]: isValidIsraeliId },
})
