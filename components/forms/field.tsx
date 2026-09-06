export const fieldInputClass =
  "w-full h-12 rounded-xl bg-white border border-border px-4 text-[16px] text-foreground placeholder:text-muted-foreground focus:bg-white focus:border-primary focus:outline-none transition"

export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="mt-1.5 text-[13px] font-bold text-destructive">
      {message}
    </p>
  )
}
