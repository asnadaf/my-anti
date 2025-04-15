import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  helperText?: string;
  maxLength?: number;
  showCharacterCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    error,
    label,
    helperText,
    id,
    maxLength,
    showCharacterCount = false,
    "aria-label": ariaLabel,
    ...props 
  }, ref) => {
    const textareaId = id || React.useId();
    const [characterCount, setCharacterCount] = React.useState(props.value?.toString().length || 0);
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (maxLength) {
        setCharacterCount(e.target.value.length);
      }
      props.onChange?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-foreground mb-1"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          aria-label={ariaLabel || label}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          maxLength={maxLength}
          onChange={handleChange}
          {...props}
        />
        <div className="flex justify-between mt-1">
          {error && (
            <p id={`${textareaId}-error`} className="text-sm text-destructive">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p id={`${textareaId}-helper`} className="text-sm text-muted-foreground">
              {helperText}
            </p>
          )}
          {showCharacterCount && maxLength && (
            <span className="text-sm text-muted-foreground ml-auto">
              {characterCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea } 