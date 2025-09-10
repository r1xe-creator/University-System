import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCohorts } from "../services/api";

function AllCohorts() {
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const response = await getCohorts();
        setCohorts(response.data);
      } catch (err) {
        setError("Failed to load cohorts.");
      } finally {
        setLoading(false);
      }
    };
    fetchCohorts();
  }, []);

  if (loading) return (
    <div className="text-center mt-10">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 mx-auto"></div>
    </div>
  );
  if (error) return <div className="text-center mt-10 text-red-500 animate-pulse">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">All Cohorts</h2>
      <div className="flex justify-between mb-4">
        <Link to="/cohorts/new" className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-all duration-300">
          Add New Cohort
        </Link>
        <Link
          to="/students/new"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all duration-300"
        >
          Create New Student
        </Link>
      </div>
      {cohorts.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {cohorts.map((cohort) => (
            <div
              key={cohort.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">{cohort.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">ID: {cohort.id}</p>
              <p className="text-gray-600 dark:text-gray-300">
                Degree: {cohort.degree.split("/").slice(-2, -1)[0]}
              </p>
              <Link
                to={`/cohorts/${cohort.id}`}
                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
              >
                View Cohort Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No cohorts found.</p>
      )}
    </div>
  );
}

export default AllCohorts;