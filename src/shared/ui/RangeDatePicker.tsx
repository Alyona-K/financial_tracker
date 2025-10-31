import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { enGB } from "date-fns/locale";
import sprite from "@/assets/images/sprite.svg";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePickerGlobal.css";
import "./RangeDatePicker.css";

registerLocale("en-GB", enGB);

type RangeDatePickerProps = {
  onChange: (range: { start: Date | null; end: Date | null }) => void;
};

const RangeDatePicker: React.FC<RangeDatePickerProps> = ({ onChange }) => {
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);

  const handleClear = () => {
    setRange([null, null]);
    onChange({ start: null, end: null });
  };

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className="datepicker__wrapper">
      <svg className="datepicker__calendar-icon" width={24} height={24}>
        <use xlinkHref={`${sprite}#calendar-icon`} />
      </svg>
      <ReactDatePicker
        selectsRange
        startDate={range[0]}
        endDate={range[1]}
        onChange={(dates) => {
          const [start, end] = dates as [Date | null, Date | null];
          setRange([start, end]);
          onChange({ start, end });
        }}
        isClearable
        placeholderText="Select date range"
        locale="en-GB"
        dateFormat="yyyy-MM-dd"
        onCalendarOpen={() => setIsCalendarOpen(true)}
        onCalendarClose={() => setIsCalendarOpen(false)}
        wrapperClassName="range-datepicker__wrapper"
        className="range-datepicker__input"
      />
      <svg
        className={`datepicker__clear-icon ${
          isCalendarOpen || range[0] || range[1] ? "visible" : ""
        }`}
        width={22}
        height={22}
        onClick={handleClear}
      >
        <use xlinkHref={`${sprite}#close-icon`} />
      </svg>
    </div>
  );
};

export default RangeDatePicker;
