import { customizeValidator } from "@rjsf/validator-ajv8"

import { ISRAELI_ID_FORMAT } from "@/lib/birthday-form"
import { isValidIsraeliId } from "@/lib/israeli-id"

export const birthdayValidator = customizeValidator({
  customFormats: { [ISRAELI_ID_FORMAT]: isValidIsraeliId },
})
