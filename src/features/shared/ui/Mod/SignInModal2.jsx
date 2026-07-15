import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Form } from "react-bootstrap";
import "./Modal.css";
import { getAdminProfile } from "../../services";
import { logger } from "@/utils";
import { setPrimarySignatureDraft } from "@/store/signatureDraftSlice";

const SingInUpdateModel2 = ({ onClose, singin, onSubmit, onHide }) => {
  const dispatch = useDispatch();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [signatureData, setSignatureData] = useState(singin || "");
  const [closeModal, setCloseModal] = useState(false);
  const getUserData = async () => {
    try {
      const result = await getAdminProfile();
      if (!result.success) {
        throw result;
      }
      const profileData = result.data;
      const userName =
        `${profileData?.position ? profileData.position + "_" : ""}` +
        `${profileData?.firstName ? profileData.firstName + "_" : ""}` +
        `${profileData?.lastName ? profileData.lastName : ""}`;
      setSignatureData(userName);
    } catch (error) {
      logger.error("Failed to load user profile in SingInUpdateModel2", error);
    }
  };
  useEffect(() => {
    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (singin) {
      setSignatureData(singin);
    }
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    setDate(`${month}-${day}-${year}`);
  }, [singin]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      const hours = currentDate.getHours().toString().padStart(2, "0");
      const minutes = currentDate.getMinutes().toString().padStart(2, "0");
      const seconds = currentDate.getSeconds().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const persistSignature = (staffLabel, sign, dateVal, timeVal) => {
    dispatch(
      setPrimarySignatureDraft({
        staffLabel,
        signedData: sign,
        signedDate: dateVal,
        signedTime: timeVal,
      }),
    );
    setCloseModal(true);
    onHide();
  };

  return (
    <div
      className={`fixed top-1/2 left-1/2 max-w-[300px] h-auto bg-white p-5 rounded-lg z-[9999] translate-x-[-50%] translate-y-[-50%] ${closeModal ? "hidden" : "block"}`}
    >
      <div className="modal-content-sing">
        <div className="input_singin_button">
          {signatureData ? (
            <p className="text-black">Digitally Signed by {signatureData}</p>
          ) : (
            <p className="text-black">Digitally Signed By</p>
          )}
          <p className="text-black">
            Date: {date} Time: {time}{" "}
          </p>

          <Form.Control
            type="text"
            placeholder="Sign Here..."
            value={signatureData}
            required
            onChange={(e) =>
              setSignatureData(e.target.value.replace(/\s/g, "_"))
            }
          />
        </div>

        <div className="sing_in_submit_button">
          <button
            type="button"
            onClick={() => {
              const dateTimeString = `${signatureData} ${date} ${time}`;
              persistSignature(dateTimeString, signatureData, date, time);
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
export default SingInUpdateModel2;
