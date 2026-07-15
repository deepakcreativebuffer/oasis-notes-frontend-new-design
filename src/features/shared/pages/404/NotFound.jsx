/** @format */

import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { userProfile } from "@/store/authSlice";

const homeRoutes = {
  Admin: "/dashboard/homepage",
  Employee: "/Home",
};

const NotFound = () => {
  return (
    <div className="not-found">
      <img src="/404.jpg" alt="" />
      <p>
        Unfortunately the page you are looking for has been moved or deleted
      </p>
      <Link to={homeRoutes[useSelector(userProfile).userType] ?? "/"}>
        <button>GO TO HOMEPAGE</button>
      </Link>
    </div>
  );
};

export default NotFound;
