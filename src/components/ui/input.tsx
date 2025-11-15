'use client';

import { cn } from '@/lib/utils';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { Suspense, useState, useMemo, InputHTMLAttributes } from 'react';

/**
 * Input Component
 * 
 * @example
 * // Standalone usage (without form library)
 * <Input 
 *   name="email" 
 *   label="Email Address"
 *   type="email"
 *   placeholder="Enter your email"
 *   icon="Mail"
 * />
 * 
 * @example
 * // With react-hook-form
 * const { register, formState: { errors } } = useForm();
 * 
 * <Input 
 *   name="email"
 *   label="Email Address"
 *   type="email"
 *   icon="Mail"
 *   register={() => register('email')}
 *   error={errors.email}
 * />
 */

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  icon?: string;
  name: string;
  label?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  value?: string;
  register?: () => Record<string, unknown>;
  error?: { message?: string };
  showToggle?: boolean; // Show password visibility toggle (default: true for password, false for others)
}

const Input: React.FC<InputProps> = ({
  icon = '',
  name,
  label = '',
  type = 'text',
  required = true,
  placeholder = '',
  className,
  value = '',
  register = () => ({}),
  error,
  showToggle,
  ...props
}) => {
  // Memoize the icon component to prevent re-renders
  const Icon = useMemo(() => {
    if (!icon) return null;

    return dynamic(() =>
      import('lucide-react').then((mod) => {
        const IconComponent = (mod as Record<string, unknown>)[icon] as LucideIcon | undefined;
        if (!IconComponent) {
          console.warn(`Icon "${icon}" not found in lucide-react`);
          return () => null;
        }
        return IconComponent;
      }), {
      ssr: false,
      loading: () => <div className="inline-block w-4 h-4 shrink-0" />,
    });
  }, [icon]);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const isPassword = type === 'password';
  
  const shouldShowToggle = showToggle !== undefined ? showToggle : isPassword;
  
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={name} className="text-text block text-sm font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        {/* Icon container with fixed width */}
        <div className={cn(
          "absolute top-1/2 left-3 -translate-y-1/2 transform",
          icon ? "w-4 h-4" : "w-0 h-0"
        )}>
          {Icon && (
            <Suspense fallback={<div className="inline-block w-4 h-4 shrink-0 opacity-30" />}>
              <Icon className="text-muted-foreground w-4 h-4 shrink-0" />
            </Suspense>
          )}
        </div>

        <input
          id={name}
          type={inputType}
          placeholder={placeholder || `Enter your ${name}`}
          autoComplete={name}
          required={required}
          defaultValue={value}
          className={cn(
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full min-w-0 rounded-md border bg-transparent py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            icon ? 'pl-10 pr-3' : 'px-3',
            shouldShowToggle && 'pr-10',
            error && 'border-destructive',
            className
          )}
          {...register()}
          {...props}
        />

        {/* Password toggle with fixed positioning */}
        {shouldShowToggle && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2 transform w-4 h-4">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground w-4 h-4 flex items-center justify-center"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export { Input };