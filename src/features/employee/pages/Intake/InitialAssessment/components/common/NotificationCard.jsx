/** @format */

import { Card, Form } from "react-bootstrap";
import { AutoSize } from "@/features/shared/ui/forms/AutoSize";

/** Notification paragraph shown above the assessment form. */
export default function NotificationCard({
  companyName,
  residentName,
  getApiData,
  assessmentOn,
  setAssessmentOn,
  hasNotified,
}) {
  return (
    <Card body className={`mb-3 hidePrint ${!hasNotified && "hidePrint"}`}>
      <Form.Label className="w-100">
        <span>{companyName}</span>
        <span className="pl-2.5">has notified</span>
        <span className="mx-2">
          {residentName
            ? residentName
            : getApiData?.data?.residentName
              ? getApiData?.data?.residentName
              : "__________"}
        </span>
        to participate in his/her Service Behavioral Health Treatment
        Plan/Initial Assessment on
        <span>
          <AutoSize
            value={assessmentOn}
            setValue={setAssessmentOn}
            placeholder={"_______________"}
          />
        </span>
      </Form.Label>
    </Card>
  );
}
