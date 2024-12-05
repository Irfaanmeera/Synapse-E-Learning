import React from "react";
import { Link, useLocation } from "react-router-dom";

const Error404: React.FC = () => {
  const locationData = useLocation();

  const location = locationData.pathname;

  const data = location.split("/")[1];
  console.log(data)

  const url =
    data === "admin" ? "/admin" : data === "instructor" ? "/instructor" : "/";

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-cover bg-center">
      <div>
        <img
          src="/assets/error404.jpg"
          alt="check-image"
          width={400}
          height={400}
        />
      </div>
      <Link
        to={`${url}`}
        className="px-6 py-3 bg-Blueviolet text-white rounded-md shadow-md hover:bg-blue-600 transition-colors"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default Error404;
