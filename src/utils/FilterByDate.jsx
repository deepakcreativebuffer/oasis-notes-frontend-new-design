import DatePicker from "react-datepicker";
import { MdFilterAltOff } from "react-icons/md";
import { Button } from "react-bootstrap";
export const FilterByDate = ({
  fromStartDate,
  fromEndDate,
  setFromStartDate,
  setFromEndDate,
  onHide,
}) => {
  const clearFilter = () => {
    setFromStartDate("");
    setFromEndDate("");
  };
  return (
    <div className="flex gap-2 mb-3 mb-md-0">
      <div className="flex flex-col gap-1">
        <span className="text-sm">From</span>
        <DatePicker
          selected={fromStartDate}
          onChange={(selectedDate) => {
            selectedDate
              ? setFromStartDate(new Date(selectedDate))
              : setFromStartDate(null);
          }}
          dateFormat="MM/dd/yyyy"
          placeholderText="MM/DD/YYYY"
          className="form-control filterList p-1 font-normal"
          highlightDates={[
            {
              "react-datepicker__day--highlighted-custom": [
                fromStartDate ? fromStartDate : new Date(),
              ],
            },
          ]}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm">To</span>
        <DatePicker
          selected={fromEndDate}
          onChange={(selectedDate) => {
            selectedDate
              ? setFromEndDate(new Date(selectedDate).setHours(23, 59, 59, 999))
              : setFromEndDate(null);
          }}
          dateFormat="MM/dd/yyyy"
          placeholderText="MM/DD/YYYY"
          className="form-control filterList p-1 "
          highlightDates={[
            {
              "react-datepicker__day--highlighted-custom": [
                fromEndDate ? fromEndDate : new Date(),
              ],
            },
          ]}
        />
      </div>
      <div className="flex flex-col gap-1 items-end">
        <span className="text-sm"> Reset</span>
        <Button type="button" className="theme-button">
          <MdFilterAltOff onClick={clearFilter} />
        </Button>
      </div>
    </div>
  );
};
