import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDegree } from "../services/api";
import ErrorMessage from "../components/ErrorMessage";
import Button from "../components/Button";

function NewDegree() {
  const [shortcode, setShortcode] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (shortcode.length > 5) {
      setError("Shortcode must be 5 characters or less.");
      return;
    }
    try {
      await createDegree({ shortcode, full_name: fullName });
      navigate("/degrees");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create degree.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 animate-fade-in-up">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Create New Degree</h2>
      <ErrorMessage error={error} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="shortcode" className="block text-gray-700 dark:text-gray-200 mb-2 font-medium">
            Degree Code
          </label>
          <input
            type="text"
            id="shortcode"
            value={shortcode}
            onChange={(e) => setShortcode(e.target.value)}
            className="w-full p-3 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., COM"
            required
          />
        </div>
        <div>
          <label htmlFor="fullName" className="block text-gray-700 dark:text-gray-200 mb-2 font-medium">
            Degree Name
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Computer Science"
            required
          />
        </div>
        <Button type="submit">Create Degree</Button>
      </form>
    </div>
  );
}

export default NewDegree;