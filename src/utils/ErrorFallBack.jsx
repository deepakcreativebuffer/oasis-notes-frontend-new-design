import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import {
  useQueryErrorResetBoundary,
  useQueryClient,
} from "@tanstack/react-query";

export const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();
  const { reset } = useQueryErrorResetBoundary();
  const queryClient = useQueryClient();

  useEffect(() => {
    const isChunkLoadError =
      error?.message?.includes("Failed to fetch dynamically imported module") ||
      error?.message?.includes("Unable to preload CSS");

    if (isChunkLoadError) {
      console.warn("Chunk load error detected in boundary. Forcing reload...");
      window.location.reload();
    }
  }, [error]);

  const resetHandler = () => {
    queryClient.resetQueries({ status: "error" });
    reset();
    resetErrorBoundary();
  };

  const goBackHandler = () => {
    queryClient.resetQueries({ status: "error" });
    reset();
    resetErrorBoundary();
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-center w-full min-h-[60vh] px-4">
      <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Oops! Something went wrong.
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          {error?.message || "Unknown error occurred"}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={goBackHandler}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 shadow-md"
          >
            Go Back
          </button>
          <button
            onClick={resetHandler}
            className="bg-[#27A6B4] hover:bg-[#1d7f8a] text-white font-semibold py-2 px-6 rounded-lg transition duration-300 shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};
