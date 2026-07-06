import { BirthdayHero } from "@/components/birthdays/birthday-hero"
import { BirthdayLeadForm } from "@/components/birthdays/birthday-lead-form"
import { BirthdayPackage } from "@/components/birthdays/birthday-package"
import { BirthdaySteps } from "@/components/birthdays/birthday-steps"

export default function BirthdaysPage() {
  return (
    <>
      <BirthdayHero />
      <BirthdaySteps />
      <BirthdayPackage />
      <BirthdayLeadForm />
    </>
  )
}
