import { useEffect, useRef, useState, memo } from "react";
import Select from "react-select";

const Search = memo((props) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target))
        if (isOpen) {
          setIsOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      onClick={() => setIsOpen((is) => !is)}
      onTouchEnd={() => setIsOpen(true)}
    >
      <Select menuIsOpen={isOpen} {...props} />
    </div>
  );
});

export default Search;
