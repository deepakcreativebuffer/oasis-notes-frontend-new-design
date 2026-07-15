/** @format */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { employeeService } from "../../services";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { ClipLoader } from "react-spinners";
import { debouncedSetQuery } from "@/utils/utils";
import { BorderlessInput } from "@/utils/Makers";
import NoFound from "../Loader/NoFound";
const SearchEmployees = ({ isOpen, clickHandler, setIsOpen, residentName }) => {
  const [limit, setLimit] = useState(100);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const QuerySetter = async (term) => {
    await debouncedSetQuery({
      term,
      setQuery: setSearch,
    });
  };
  useEffect(() => {
    employeeService.search({
      limit,
      search,
      setResponse: setData,
      setLoading,
    });
  }, [limit, search]);
  const customDebounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  const loadMorePatient = customDebounce(() => {
    if (limit === data?.data?.totalDocs || limit < data?.data?.totalDocs) {
      setLimit(limit + 25);
    }
  }, 500);
  const [patientRef] = useInfiniteScroll({
    loading,
    hasNextPage: data?.data?.hasNextPage,
    onLoadMore: loadMorePatient,
    disabled: loading,
  });
  const fetchName = (i) => {
    if (i.firstName || i.lastName) {
      return `${i.firstName} ${i.lastName}`;
    } else {
      return i.fullName;
    }
  };
  return (
    <motion.div
      initial={{
        height: 0,
        opacity: 0,
        zIndex: -1,
      }}
      animate={{
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0,
        zIndex: isOpen ? 200 : -1,
      }}
      transition={{
        duration: 0.3,
      }}
      exit={{
        height: 0,
        opacity: 0,
        zIndex: -1,
      }}
      className="search_Header"
    >
      <div className="close_btn">
        <i
          className="fa-solid fa-circle-xmark"
          onClick={() => setIsOpen(false)}
        ></i>
      </div>
      <BorderlessInput
        setState={QuerySetter}
        type="text"
        placeholder={"Search"}
      />
      {loading ? (
        <div className="block m-auto mt-2.5">
          <ClipLoader />
        </div>
      ) : (
        <ul>
          {data?.data?.docs?.length > 0 ? (
            data?.data?.docs?.map((i, index) => (
              <li
                onClick={() => clickHandler(i)}
                className="normal"
                key={`paitnet${index}`}
              >
                {fetchName(i)}
              </li>
            ))
          ) : (
            <NoFound />
          )}
        </ul>
      )}

      <div ref={patientRef}></div>
    </motion.div>
  );
};
export default SearchEmployees;
