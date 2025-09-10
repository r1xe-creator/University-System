import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCohort, getStudentsByCohort } from "../services/api";

function StudentsByCohort() {
  const { cohortId } = useParams();
  const [cohort, setCohort] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cohortResponse = await getCohort(cohortId);
        setCohort(cohortResponse.data);
        const studentsResponse = await getStudentsByCohort(cohortId);
        setStudents(studentsResponse.data);
      } catch (err) {
        setError("Failed to load cohort or students.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cohortId]);

  if (loading) return (
    <div className="text-center mt-10">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 mx-auto"></div>
    </div>
  );
  if (error) return <div className="text-center mt-10 text-red-500 animate-pulse">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in-up">
      <Link
        to={`/cohorts/${cohortId}`}
        className="mb-4 inline-block text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
      >
        ← Back to Cohort
      </Link>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Students in Cohort {cohort?.name} ({cohortId})
      </h2>
      {students.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {students.map((student) => (
            <div
              key={student.student_id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Link
                to={`/students/${student.student_id}`}
                className="text-lg font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
              >
                {student.first_name} {student.last_name}
              </Link>
              <p className="text-gray-600 dark:text-gray-300">ID: {student.student_id}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No students in this cohort.</p>
      )}
    </div>
  );
}

export default StudentsByCohort;