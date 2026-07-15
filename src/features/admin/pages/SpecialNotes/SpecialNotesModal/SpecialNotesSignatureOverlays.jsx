import { AddSignature } from "@/utils/utils";
import { ROLES } from "@/features/shared/constants";

const SpecialNotesSignatureOverlays = ({
  open,
  openSigner,
  openAdmin,
  vanEmergency,
  profileInfo,
  editStatus,
  setEmployeeSignature,
  editSignHandler,
  setEmployeeSignatureDate,
  editDateHandler,
  setSignerSignature,
  setSignerDate,
  setSignerTime,
  setAdminSignature,
  setAdminDateSigned,
  setAdminSignedTime,
}) => {
  return (
    <>
      <AddSignature
        show={open}
        setValue={(sign) =>
          (vanEmergency?.employeeId === profileInfo?._id &&
            profileInfo?.userType === ROLES.EMPLOYEE) ||
          (!vanEmergency?.employeeId &&
            !editStatus &&
            profileInfo?.userType === ROLES.EMPLOYEE)
            ? setEmployeeSignature(sign)
            : editSignHandler(sign)
        }
        setDate={(date) =>
          (vanEmergency?.employeeId === profileInfo?._id &&
            profileInfo?.userType === ROLES.EMPLOYEE) ||
          (!vanEmergency?.employeeId &&
            !editStatus &&
            profileInfo?.userType === ROLES.EMPLOYEE)
            ? setEmployeeSignatureDate(date)
            : editDateHandler(date)
        }
      />

      <AddSignature
        show={openSigner}
        setValue={setSignerSignature}
        setDate={setSignerDate}
        setTime={setSignerTime}
      />
      <AddSignature
        show={openAdmin}
        setValue={setAdminSignature}
        setDate={setAdminDateSigned}
        setTime={setAdminSignedTime}
      />
    </>
  );
};

export default SpecialNotesSignatureOverlays;
