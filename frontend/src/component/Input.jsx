import React, { useId } from 'react'

// forwardRef allows parent components to access this input directly.
// Example: inputRef.current.focus()
const Input = React.forwardRef(function Input(

  // Destructuring props
  {
    label,                  // Text shown above the input
    type = 'text',          // Default input type
    className = '',         // Extra classes passed from parent
    placeholder,            // Placeholder text
    ...props                // All other props (onChange, value, required, etc.)
  },

  // Ref coming from parent component
  ref

) {

  // Creates a unique ID for connecting label and input
  const id = useId()

  return (

    // Takes full available width
    <div className="w-full">

      {/* Show label only if label exists */}
      {label && (
        <label
          htmlFor={id} // Connects label to input
          className="block mb-2 text-sm text-gray-300"
        >
          {label}
        </label>
      )}

      <input
        // Unique ID for accessibility
        id={id}

        // Dynamic input type
        type={type}

        // Placeholder text
        placeholder={placeholder}

        // Gives parent access to this input
        ref={ref}

        // Extra props like:
        // value
        // onChange
        // required
        // disabled
        {...props}

        // Default styling + custom styling
        className={`
          w-full
          px-4 py-3
          rounded-xl
          bg-zinc-900
          border border-zinc-700
          text-white
          placeholder:text-gray-500
          outline-none
          transition-all
          duration-300
          focus:border-red-500
          focus:ring-2
          focus:ring-red-500/30
          ${className}
        `}
      />
    </div>
  )
})

// Helps React DevTools show "Input" instead of "ForwardRef"
Input.displayName = 'Input'

export default Input