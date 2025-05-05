const Badge = ({ children, variant = "default", size = "md", className = "", ...props }) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full"

  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-violet-100 text-violet-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-indigo-100 text-indigo-800",
  }

  const sizes = {
    sm: "px-2 py-0.5 text-[13px]",
    md: "px-2.5 py-0.5 text-[13px]",
    lg: "px-3 py-1 text-base",
  }

  return (
    <span
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge

