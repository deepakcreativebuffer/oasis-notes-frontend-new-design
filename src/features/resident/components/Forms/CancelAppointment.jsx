import { ibutton, formupload } from "@/assets";
import "./CancelAppointment.css";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { Container } from "react-bootstrap";

const CancelAppointment = () => {
  return (
    <div className="booking-container">
      <NavWrapper title={"Cancel Appointment"} isArrow={true} />
      <Container className="full-width-container dashboard-page">
        <div className="form-container">
          <div className="cancelconatainer">
            <h2>
              {" "}
              <img src={ibutton} alt="" />
              Please Confirm and Provide details to Cancel your Appointment!
            </h2>
            <p>
              I have been offered the opportunity to have medical care at the
              hospital/urgent care for the above illness/injury. I feel as
              though I do not require medical care at this time. However, should
              I feel the need to have medical care, I will immediately report
              this to a Devine Care staff.
            </p>
            <div className="yeschechbox2">
              <div>
                <input type="checkbox" name="" id="" />
                <label>I agree to the ‘Terms & Conditions’ above</label>
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="approvedby">Resident Full Name</label>
              <input
                type="text"
                id="approvedby"
                value=""
                placeholder="Enter text"
                required
              />
            </div>
            <label htmlFor="approvedby">Resident Signature</label>
            <div className="file-upload-box">
              <input type="file" id="fileInput hidden" />
              <div className="upload-icon">
                <img src={formupload} alt="" className="w-[100px] h-[100px]" />
              </div>
              <div className="block">
                <button className="upload-button1" onclick="uploadFile()">
                  SAVED AS DRAFT
                </button>
                <button className="upload-button" onclick="uploadFile()">
                  SAVED AND SIGNED
                </button>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="managecontinue1">
              SUBMIT
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HOC({ Wcomponenet: CancelAppointment });
