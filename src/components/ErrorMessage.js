export default function ErrorMessage({ error }) {
    return error ? (
      <p className="text-lg font-bold text-white bg-red-500 p-3 rounded-md animate-pulse text-center mb-6">
        {error}
      </p>
    ) : null;
  }