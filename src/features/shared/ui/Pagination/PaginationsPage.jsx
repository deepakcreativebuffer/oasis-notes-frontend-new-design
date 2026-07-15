const PaginationsPage = ({
  page,
  setPage,
  totalPages,
  limit,
  setLimit,
  medication = false,
}) => {
  const pageCount = Number(totalPages) || 1;

  const Prev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const Next = () => {
    if (page < pageCount) {
      setPage(page + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const showPages = 5;

    if (pageCount <= showPages) {
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, 5);
        pages.push("...", pageCount);
      } else if (page >= pageCount - 2) {
        pages.push(1, "...");
        for (let i = pageCount - 4; i <= pageCount; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1, "...");
        pages.push(page - 1, page, page + 1);
        pages.push("...", pageCount);
      }
    }

    return pages.map((p, idx) =>
      p === "..." ? (
        <button key={idx} className="dots" disabled>
          ...
        </button>
      ) : (
        <button
          key={idx}
          type="button"
          className={p === page ? "activePage" : "inActivePage"}
          onClick={() => setPage(p)}
        >
          {p}
        </button>
      ),
    );
  };

  return (
    <div className="pagination pagination-custom mt-4 pointer-events-auto">
      <button
        type="button"
        onClick={Prev}
        disabled={page === 1}
        className="prevBtn"
      >
        <i className="fa fa-angle-left"></i>
      </button>

      {renderPageNumbers()}

      <button
        type="button"
        onClick={Next}
        disabled={page === pageCount}
        className="nextBtn"
      >
        <i className="fa fa-angle-right"></i>
      </button>

      <select
        value={limit}
        onChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);
        }}
      >
        {medication && (
          <>
            <option value={3}>3 per page</option>
            <option value={5}>5 per page</option>
          </>
        )}
        <option value={10}>10 per page</option>
        <option value={20}>20 per page</option>
        <option value={50}>50 per page</option>
        <option value={100}>100 per page</option>
      </select>
    </div>
  );
};

export default PaginationsPage;
