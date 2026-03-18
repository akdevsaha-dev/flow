import React from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputBox = React.forwardRef<HTMLInputElement, InputBoxProps>(
  ({ label, error, type = "text", className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full flex-col flex justify-center mb-4">
        <label className="text-sm font-medium text-neutral-700 mb-1" htmlFor={props.id}>
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all duration-300 ease-in-out text-base ${
              error ? "border-red-500 focus:border-red-500" : "border-neutral-200 focus:border-neutral-400"
            } ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

InputBox.displayName = "InputBox";
