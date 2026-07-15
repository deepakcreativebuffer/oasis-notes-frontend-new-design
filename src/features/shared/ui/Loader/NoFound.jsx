/** @format */

import { Alert } from "react-bootstrap";

const NoFound = ({ msg }) => {
  return <Alert className="mt-3">{msg ? msg : `No Results Found`}</Alert>;
};

export default NoFound;
