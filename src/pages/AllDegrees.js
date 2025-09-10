import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDegrees } from "../services/api";

function AllDegrees() {
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        const response = await getDegrees();
        setDegrees(response.data);
      } catch (err) {
        setError("Failed to load degrees. Is the API running?");
      } finally {
        setLoading(false);
      }
    };
    fetchDegrees();
  }, []);

  if (loading) return (
    <div className="text-center mt-10">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 mx-auto"></div>
    </div>
  );
  if (error) return <div className="text-center mt-10 text-red-500 animate-pulse">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">All Degrees</h2>
      <Link
        to="/degrees/new"
        className="ml-4 inline-block bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all duration-300"
      >
        Create New Degree
      </Link>
      {degrees.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 mt-4">
          {degrees.map((degree) => (
            <div
              key={degree.shortcode}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">{degree.full_name}</h3>
              <p className="text-gray-600 dark:text-gray-300">Code: {degree.shortcode}</p>
              <Link
                to={`/degrees/${degree.shortcode}`}
                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 mt-4">No degrees found.</p>
      )}
    </div>
  );
}

export default AllDegrees;