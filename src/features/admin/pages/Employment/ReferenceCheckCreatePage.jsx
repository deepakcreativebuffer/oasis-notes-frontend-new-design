/** @format */

import { useState } from "react";
import { Container, Table } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { BorderlessInput, DateFormatter } from "@/utils/Makers";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { employmentService } from "@/features/shared/services/index";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";

const ReferenceCheck = () => {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [arr, setArr] = useState([]);
  const [date, setDate] = useState("");
  const [referenceName, setRefrenceName] = useState("");
  const [referenceRecommendation, setRefrenceRecommendation] = useState("");
  const [savedSigned, setSavedSigned] = useState("");
  const [time, setTime] = useState("");
  const [signDate, setSignDate] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signers, setSigners] = useState([]);

  const payload = {
    date,
    referenceName,
    referenceRecommendation,
    savedSigned,
    signDate,
    time,
  };

  const addMore = () => {
    setArr((prev) => [...prev, payload]);
    setRefrenceName("");
    setRefrenceRecommendation("");
    setSavedSigned("");
    setDate("");
    setTime("");
    setSignDate("");
    setOpen(false);
  };
  const removeOne = async (index) => {
    await setArr((prev) => prev.filter((_, i) => i !== index));
  };

  const apiPayload = {
    data: arr?.map((i) => ({
      referenceName: i.referenceName,
      referenceRecommendation: i.referenceRecommendation,
      savedSigned: i.savedSigned,
      date: i.date,
      signTime: i.time,
      signDate: i.signDate,
    })),
    signers: signers?.map((signer) => ({
      signerId: signer.value,
      name: signer.label,
      signature: "",
      dateSigned: "",
      signedTime: "",
    })),
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    employmentService.createReferenceCheck(apiPayload, { setLoading });
  };

  return (
    <>
      <div>
        <AddSignature
          show={open}
          setValue={setSavedSigned}
          setTime={setTime}
          setDate={setSignDate}
        />
        <NavWrapper
          title={"Reference Check and Recommendation"}
          isArrow={true}
        />

        <Container className="full-width-container">
          <form className="w-100 text-start" onSubmit={submitHandle}>
            <div className="grid-container">
              <div className="third-wid-input grid-item" />
              <div className="grid-item">
                <label>Date of Contact:</label>
                <BorderlessInput
                  setState={setDate}
                  placeholder=""
                  type={"date"}
                  value={date && DateFormatter(date)}
                />
              </div>
              <div className="grid-item long-input">
                <label>Reference Name:</label>
                <BorderlessInput
                  setState={setRefrenceName}
                  placeholder=""
                  type={"text"}
                  value={referenceName}
                />
              </div>
              <div className="grid-item"></div>
              <div className="grid-item full-wid-input">
                <label>Reference Recommendation:</label>
                <BorderlessInput
                  setState={setRefrenceRecommendation}
                  placeholder=""
                  type={"text"}
                  value={referenceRecommendation}
                />
              </div>

              <div className="grid-item full-wid-input d-block">
                <label>Signature </label>
                <div className="custome-cloud-btn mt-2">
                  <div className="btns hidePrint">
                    <button
                      type="button"
                      className="signed"
                      onClick={() => setOpen(true)}
                    >
                      SAVED AND SIGNED
                    </button>
                  </div>
                  <div>
                    {savedSigned && (
                      <p className="mb-0">
                        Digitally Signed by {savedSigned} {signDate} {time}{" "}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <button
                className="add_more hidePrint"
                type="button"
                onClick={() => addMore()}
              >
                Add More
              </button>
            </div>
            {arr?.length > 0 && (
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Reference Name</th>
                    <th>Reference Recommendation</th>
                    <th>Signature</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {arr?.map((i, index) => (
                    <tr key={index}>
                      <td> {i.date && formatDateToMMDDYYYY(i.date)} </td>
                      <td> {i.referenceName} </td>
                      <td> {i.referenceRecommendation} </td>
                      <td>
                        {signatureFormat({
                          sign: i.savedSigned,
                          date: i.signDate,
                          time: i.signTime,
                          hoursFormat,
                          withText: false,
                          style: {
                            textAlign: "left",
                          },
                        })}
                      </td>
                      <td>
                        {" "}
                        <i
                          className="fa-solid fa-trash"
                          onClick={() => removeOne(index)}
                        />{" "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            <div className="mt-4 mb-5">
              Signers:
              <MultiEmployee setValue={setSigners} value={signers} />
            </div>

            <button className="employee_create_btn hidePrint" type="submit">
              {loading ? <ClipLoader color="#fff" /> : "SUBMIT"}
            </button>
          </form>
        </Container>
      </div>
    </>
  );
};
export default HOC({ Wcomponenet: ReferenceCheck });
