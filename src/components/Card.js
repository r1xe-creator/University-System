import { Link } from "react-router-dom";

export default function Card({ title, details = [], linkTo, linkText }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex flex-col gap-2">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
      {details.map((detail, idx) => (
        <p key={idx} className="text-sm text-gray-600 dark:text-gray-300">{detail}</p>
      ))}
      {linkTo && linkText && (
        <Link
          to={linkTo}
          className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:underline transition-colors duration-200"
        >
          {linkText}
        </Link>
      )}
    </div>
  );
}