import React, { useState } from "react";
import { motion } from "framer-motion";
import { BorderlessInput } from "@/utils/Makers";
import { ClipLoader } from "react-spinners";
import NoFound from "../Loader/NoFound";
import useInfiniteScroll from "react-infinite-scroll-hook";

const MarsDateList = ({ isOpen, clickHandler, setIsOpen, dateList }) => {
  const [limit, setLimit] = useState(100);
  const [loading] = useState(false);
  const QuerySetter = async (term) => {
    // Search functionality not yet implemented for dateList
  };

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
    if (limit === dateList.length || limit < dateList.length) {
      setLimit(limit + 25);
    }
  }, 500);
  const [patientRef] = useInfiniteScroll({
    loading,
    hasNextPage: dateList,
    onLoadMore: loadMorePatient,
    disabled: loading,
  });

  return (
    <div>
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
        transition={{ duration: 0.3 }}
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
            {dateList?.length > 0 ? (
              dateList?.map((i, index) => (
                <li
                  onClick={() => clickHandler(i)}
                  className="normal"
                  key={i?._id}
                >
                  {i?.month}/ {i?.year}
                </li>
              ))
            ) : (
              <NoFound />
            )}
          </ul>
        )}

        <div ref={patientRef}></div>
      </motion.div>
    </div>
  );
};

export default MarsDateList;
