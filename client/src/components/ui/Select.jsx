const Select = ({ label, id, options = [], error, className = "", ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-[13px] font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`
          w-full px-3 py-2 border rounded-lg shadow-[13px] bg-white
          focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600
          ${error ? "border-red-500" : "border-gray-300"}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-[13px] text-red-600">{error}</p>}
    </div>
  )
}

export default Select

