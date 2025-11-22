const TextInput = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
  error = "",
  className = "",
  rows = 1,
}) => {
  const isTextarea = rows > 1;

  return (
    <div className={`mb-4 ${className}`}>
      <label
        className="block text-base font-medium text-gray-700 mb-2"
        dir="rtl"
      >
        {label}
      </label>
      {isTextarea ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`w-full px-4 py-3 text-base border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-4 py-3 text-base border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
        />
      )}
      {error && <p className="mt-2 text-base text-red-600">{error}</p>}
    </div>
  );
};

export default TextInput;
