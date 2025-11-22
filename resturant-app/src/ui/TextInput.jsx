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
  name,
}) => {
  const isTextarea = rows > 1;

  return (
    <div className={`mb-6 ${className}`}>
      <label className="block text-lg font-medium text-gray-700 mb-3" dir="rtl">
        {label}
      </label>
      {isTextarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`w-full px-5 py-4 text-lg border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full px-5 py-4 text-lg border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
        />
      )}
      {error && (
        <p className="mt-3 text-lg text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default TextInput;
