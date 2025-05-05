const Input = ({ label, id, type = "text", error, className = "", ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-[13px] font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`
          w-full px-3 py-2 border rounded-lg shadow-[13px]
          focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600
          ${error ? "border-red-500" : "border-gray-300"}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-[13px] text-red-600">{error}</p>}
    </div>
  )
}

export default Input

