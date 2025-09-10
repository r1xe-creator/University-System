export default function Button({ children, disabled, className = "", ...props }) {
    return (
      <button
        disabled={disabled}
        className={`bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 hover:scale-105 transition-all duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }