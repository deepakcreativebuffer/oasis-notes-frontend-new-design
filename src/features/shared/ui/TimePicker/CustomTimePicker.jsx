import React, { useState, useRef, useEffect } from "react";

const CustomTimePicker = ({
  use24Hours = false,
  onChange,
  value = null,
  disabled,
  placeHolderText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(
    value ? value.getHours() : 0,
  );
  const [selectedMinute, setSelectedMinute] = useState(
    value ? value?.getMinutes() : 0,
  );
  const [isPM, setIsPM] = useState(value ? value?.getHours() >= 12 : false);
  const dropdownRef = useRef(null);

  const hours = use24Hours
    ? Array.from({ length: 24 }, (_, i) => i)
    : Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (value) {
      const hours = value?.getHours();
      setIsPM(hours >= 12);
      setSelectedHour(!use24Hours ? hours % 12 || 12 : hours);
      setSelectedMinute(value?.getMinutes());
    }
  }, [value, use24Hours]);

  const handleTimeSelection = (hour, minute, newIsPM) => {
    const now = new Date();
    let adjustedHour = hour;

    if (!use24Hours) {
      const pmState = newIsPM !== undefined ? newIsPM : isPM;
      if (pmState && hour !== 12) {
        adjustedHour = hour + 12;
      } else if (!pmState && hour === 12) {
        adjustedHour = 0;
      }
    }

    const newDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      adjustedHour,
      minute,
    );
    const timeString = newDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !use24Hours,
    });

    if (onChange) {
      if (onChange.length === 1) {
        onChange(newDate);
      } else {
        onChange(null, timeString);
      }
    }
  };

  const formatTime = (date) => {
    if (!date) return "";

    // Format the time using the system locale
    const timeString = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !use24Hours,
    });

    // Ensure AM/PM is in uppercase
    return timeString.replace(/\s?(am|pm)$/i, (match) => match.toUpperCase());
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="relative cursor-pointer "
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="text"
          className={`w-100 px-2 py-2 ${
            disabled ? "bg-gray-100" : " bg-white"
          } border border-gray-200 rounded text-gray-700 text-sm font-medium 
                   focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 
                hover:border-gray-300 pr-10 placeholder-gray-400`}
          value={formatTime(value)}
          readOnly
          placeholder={placeHolderText ? placeHolderText : "Select time"}
          disabled={disabled}
        />
        {value && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedHour(0);
              setSelectedMinute(0);
              setIsPM(false);
              if (onChange) onChange("");
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className="absolute mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 time-picker-dropdown 
                      overflow-hidden backdrop-blur-sm bg-white/95"
        >
          <div className="flex divide-x divide-gray-100">
            {/* Hours Column */}
            <div className="w-15 h-52 overflow-y-auto scrollbar-thin">
              <div
                className="sticky top-0 bg-gray-50/80 backdrop-blur-sm text-gray-700 text-xs font-medium py-1 px-2 
                            text-center border-b border-gray-100"
              >
                Hours
              </div>
              <div className="py-1">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className={`px-3 py-2 cursor-pointer text-center text-xs transition-all duration-200
                              ${
                                selectedHour === hour
                                  ? "bg-blue-50 text-blue-600 font-medium"
                                  : "text-gray-600 hover:bg-gray-50"
                              }`}
                    onClick={() => {
                      setSelectedHour(hour);
                      handleTimeSelection(hour, selectedMinute);
                    }}
                  >
                    {hour.toString().padStart(2, "0")}
                  </div>
                ))}
              </div>
            </div>

            {/* Minutes Column */}
            <div className="w-15 h-52 overflow-y-auto scrollbar-thin">
              <div
                className="sticky top-0 bg-gray-50/80 backdrop-blur-sm text-gray-700 text-xs font-medium py-1 px-2 
                            text-center border-b border-gray-100"
              >
                Minutes
              </div>
              <div className="py-1">
                {minutes.map((minute) => (
                  <div
                    key={minute}
                    className={`px-3 py-2 cursor-pointer text-center text-xs transition-all duration-200
                              ${
                                selectedMinute === minute
                                  ? "bg-blue-50 text-blue-600 font-medium"
                                  : "text-gray-600 hover:bg-gray-50"
                              }`}
                    onClick={() => {
                      setSelectedMinute(minute);
                      handleTimeSelection(selectedHour, minute);
                    }}
                  >
                    {minute.toString().padStart(2, "0")}
                  </div>
                ))}
              </div>
            </div>

            {/* AM/PM Column */}
            {!use24Hours && (
              <div className="w-15 h-52">
                <div
                  className="sticky top-0 bg-gray-50/80 backdrop-blur-sm text-gray-700 text-xs font-medium py-1 px-2 
                              text-center border-b border-gray-100"
                >
                  AM/PM
                </div>
                <div className="py-1">
                  <div
                    className={`px-3 py-2 cursor-pointer text-center text-xs transition-all duration-200
                              ${
                                !isPM
                                  ? "bg-blue-50 text-blue-600 font-medium"
                                  : "text-gray-600 hover:bg-gray-50"
                              }`}
                    onClick={() => {
                      setIsPM(false);
                      handleTimeSelection(selectedHour, selectedMinute, false);
                    }}
                  >
                    AM
                  </div>
                  <div
                    className={`px-3 py-2 cursor-pointer text-center text-xs transition-all duration-200
                              ${
                                isPM
                                  ? "bg-blue-50 text-blue-600 font-medium"
                                  : "text-gray-600 hover:bg-gray-50"
                              }`}
                    onClick={() => {
                      setIsPM(true);
                      handleTimeSelection(selectedHour, selectedMinute, true);
                    }}
                  >
                    PM
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTimePicker;
