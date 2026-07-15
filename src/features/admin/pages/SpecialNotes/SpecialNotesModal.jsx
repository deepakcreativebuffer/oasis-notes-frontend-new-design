import { Modal } from "react-bootstrap";
import "@/assets/styles/Print.css";
import { useSpecialNotesModalLogic } from "./SpecialNotesModal/useSpecialNotesModalLogic";
import SpecialNotesSignatureOverlays from "./SpecialNotesModal/SpecialNotesSignatureOverlays";
import SpecialNotesModalContent from "./SpecialNotesModal/SpecialNotesModalContent";

const SpecialNotesModal = (props) => {
  const { show, onHide } = props;
  const logic = useSpecialNotesModalLogic(props);

  return (
    <>
      <SpecialNotesSignatureOverlays
        open={logic.open}
        openSigner={logic.openSigner}
        openAdmin={logic.openAdmin}
        vanEmergency={props.vanEmergency}
        profileInfo={logic.profileInfo}
        editStatus={props.editStatus}
        setEmployeeSignature={logic.setEmployeeSignature}
        editSignHandler={logic.editSignHandler}
        setEmployeeSignatureDate={logic.setEmployeeSignatureDate}
        editDateHandler={logic.editDateHandler}
        setSignerSignature={logic.setSignerSignature}
        setSignerDate={logic.setSignerDate}
        setSignerTime={logic.setSignerTime}
        setAdminSignature={logic.setAdminSignature}
        setAdminDateSigned={logic.setAdminDateSigned}
        setAdminSignedTime={logic.setAdminSignedTime}
      />
      <Modal
        show={show}
        onHide={onHide}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <SpecialNotesModalContent {...logic} />
      </Modal>
    </>
  );
};

export default SpecialNotesModal;
