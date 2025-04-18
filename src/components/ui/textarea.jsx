import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex w-full min-h-[50px] max-h-[200px] rounded-xl border-0 bg-transparent text-base leading-relaxed transition-all placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 resize-none scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-primary/10 hover:bg-accent/5",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
