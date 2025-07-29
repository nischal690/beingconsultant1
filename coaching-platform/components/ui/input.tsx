import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-black ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-black placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-gray-700 dark:bg-black dark:text-white dark:file:text-white dark:placeholder:text-gray-400 dark:focus-visible:ring-white [&:not(:placeholder-shown)]:bg-white [&:not(:placeholder-shown)]:text-black dark:[&:not(:placeholder-shown)]:bg-black dark:[&:not(:placeholder-shown)]:text-white",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
