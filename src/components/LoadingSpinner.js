export default function LoadingSpinner({ message = "Loading..." }) {
    return (
      <div className="text-center mt-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 dark:text-gray-300 mt-2">{message}</p>
      </div>
    );
  }