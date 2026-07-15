/** @format */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { patientService } from "../../services";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { ClipLoader } from "react-spinners";
import { BorderlessInput } from "@/utils/Makers";
import NoFound from "../Loader/NoFound";

const SearchPatients = ({
  isOpen,
  clickHandler,
  setIsOpen,
  residentName,
  mars,
}) => {
  const [limit, setLimit] = useState(100);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Debounce function to delay search updates
  const customDebounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Update the search state with a debounce
  const QuerySetter = customDebounce((term) => {
    setSearch(term.trim());
  }, 300);

  // Fetch patients whenever search, limit, or mars changes
  useEffect(() => {
    patientService.listForSearch({
      search,
      limit,
      mars,
      setResponse: setData,
      setLoading,
    });
  }, [limit, search, mars]);

  // Load more patients on scroll
  const loadMorePatient = customDebounce(() => {
    if (data?.data?.totalDocs > limit) {
      setLimit((prevLimit) => prevLimit + 25);
    }
  }, 500);

  const [patientRef] = useInfiniteScroll({
    loading,
    hasNextPage: data?.data?.hasNextPage,
    onLoadMore: loadMorePatient,
    disabled: loading,
  });

  // Helper function to fetch the full name of a patient
  const fetchName = (i) => {
    if (i.firstName || i.lastName) {
      return `${i.firstName || ""} ${i.lastName || ""}`.trim();
    }
    return i.fullName || "Unknown Name";
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0, zIndex: -1 }}
      animate={{
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0,
        zIndex: isOpen ? 200 : -1,
      }}
      transition={{ duration: 0.3 }}
      exit={{ height: 0, opacity: 0, zIndex: -1 }}
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
        placeholder={"Search Resident..."}
      />
      {loading ? (
        <div className="block m-auto mt-2.5">
          <ClipLoader />
        </div>
      ) : (
        <ul>
          {residentName && <li className="active">{residentName}</li>}
          {data?.data?.docs?.length > 0 ? (
            data.data.docs.map((i, index) => (
              <li
                onClick={() => clickHandler(i)}
                className="normal"
                key={`patient-${index}`}
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

export default SearchPatients;
