import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getModule, getCohort } from "../services/api";

function SingleModule() {
  const { moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moduleResponse = await getModule(moduleId);
        setModule(moduleResponse.data);
        const cohortPromises = moduleResponse.data.delivered_to.map((url) =>
          getCohort(url.split("/").slice(-2, -1)[0])
        );
        const cohortResponses = await Promise.all(cohortPromises);
        setCohorts(cohortResponses.map((res) => res.data));
      } catch (err) {
        setError("Failed to load module or cohorts.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [moduleId]);

  if (loading) return (
    <div className="text-center mt-10">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 mx-auto"></div>
    </div>
  );
  if (error) return <div className="text-center mt-10 text-red-500 animate-pulse">{error}</div>;
  if (!module) return <div className="text-center mt-10 text-gray-600 dark:text-gray-300">Module not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in-up">
      <Link
        to="/modules"
        className="mb-4 inline-block text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
      >
        ← Back to All Modules
      </Link>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{module.full_name}</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">Code: {module.code}</p>
      <Link
        to={`/modules/${moduleId}/students`}
        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4 inline-block transition-colors duration-300 group relative"
      >
        View Students in This Module
        <span className="absolute bottom-0 left-5 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
      </Link>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Enrolled Cohorts</h3>
      {cohorts.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {cohorts.map((cohort) => (
            <div
              key={cohort.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Link
                to={`/cohorts/${cohort.id}`}
                className="text-lg font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
              >
                {cohort.name} ({cohort.id})
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No cohorts enrolled in this module.</p>
      )}
    </div>
  );
}

export default SingleModule;