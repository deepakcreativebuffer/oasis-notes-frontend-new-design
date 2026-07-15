import React from "react";
import { ClipLoader, BarLoader } from "react-spinners";
import "./Loaders.css";
import "./Loader.css";

export const PageLoader = () => {
  return (
    <div className="spinner">
      <ClipLoader color="rgb(26, 159, 178)" />
    </div>
  );
};

export const QuickLinkLoader = () => {
  return (
    <div className="quickLinkLoader">
      <ClipLoader color="rgb(26, 159, 178)" />
    </div>
  );
};

export const ComponentLoader = ({ Wcomponenet, loading }) => {
  return loading ? (
    <div className="spinner">
      <ClipLoader color="rgb(26, 159, 178)" />
    </div>
  ) : (
    <Wcomponenet />
  );
};

export const SectionLoader = () => {
  return (
    <div className="section-loader-container">
      <ClipLoader color="rgb(26, 159, 178)" size={40} />
      <span className="section-loader-text">Loading section...</span>
    </div>
  );
};

export const TableLoader = ({ rowsCount = 5, colsCount = 4 }) => {
  return (
    <div className="table-loader-container">
      <div className="table-loader-header-skeleton">
        {Array.from({ length: colsCount }).map((_, idx) => (
          <div
            key={`header-col-${idx}`}
            className="skeleton-item header-skeleton-item"
          />
        ))}
      </div>
      <div className="table-loader-body-skeleton">
        {Array.from({ length: rowsCount }).map((_, rIdx) => (
          <div key={`row-${rIdx}`} className="table-loader-row-skeleton">
            {Array.from({ length: colsCount }).map((_, cIdx) => (
              <div
                key={`col-${rIdx}-${cIdx}`}
                className="skeleton-item cell-skeleton-item"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ModalLoader = () => {
  return (
    <div className="modal-loader-container">
      <BarLoader color="rgb(26, 159, 178)" width={150} height={4} />
      <p className="modal-loader-text">Updating form content...</p>
    </div>
  );
};

// Trigger Vite HMR
