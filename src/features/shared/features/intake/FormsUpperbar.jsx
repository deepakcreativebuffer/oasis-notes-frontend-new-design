/** @format */

import AssessmentTypeHeader from "../../ui/forms/AssessmentTypeHeader";

/** Resident / Guardian intake — print title + uppercase labels */
const FormUpper = (props) => (
  <AssessmentTypeHeader
    showPrintTitle
    uppercaseLabels
    wrapperClassName="therapy-notes-multiple-radio-wb mb-3"
    {...props}
  />
);

export default FormUpper;
