import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import SingInUpdateModel2 from "./SignInModal2";
import { selectPrimarySignatureDraft } from "@/store/signatureDraftSlice";

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <SingInUpdateModel2 onHide={props.onHide} />
    </Modal>
  );
}

export const ModalOpner = () => {
  const [modalShow, setModalShow] = useState(false);
  const primaryDraft = useSelector(selectPrimarySignatureDraft);
  const staffParts = primaryDraft.staffLabel?.split(" ") || [];

  return (
    <>
      <div>
        <Button
          className="theme-button"
          variant="primary"
          onClick={() => setModalShow(true)}
        >
          SAVED AND SIGNED
        </Button>
        <p className="text-right text-sm">
          {!modalShow &&
            primaryDraft.staffLabel &&
            ` Digitally Signed by ${staffParts[0] || ""} on ${staffParts[1] || ""} ${staffParts[2] || ""}`}
        </p>
        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </div>
    </>
  );
};
