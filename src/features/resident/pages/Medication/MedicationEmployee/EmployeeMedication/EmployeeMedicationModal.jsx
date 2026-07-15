/* eslint-disable eqeqeq */
/** @format */
import React from "react";
import { Modal } from "react-bootstrap";
import { useEmployeeMedicationModalLogic } from "./useEmployeeMedicationModalLogic";
import EmployeeMedicationModalEdit from "./EmployeeMedicationModalEdit";
import EmployeeMedicationModalAdd from "./EmployeeMedicationModalAdd";
import EmployeeMedicationModalView from "./EmployeeMedicationModalView";

const EmployeeMedicationModal = (props) => {
  const { parentCtx, ...modalProps } = props;
  const ctx = useEmployeeMedicationModalLogic({
    ...parentCtx,
    onHide: modalProps.onHide,
    show: modalProps.show,
  });
  const allProps = { ...ctx, ...modalProps, props: modalProps };

  return (
    <Modal
      {...modalProps}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="medication-modal-part"
    >
      {allProps.addContactBtn === "f" ? (
        <EmployeeMedicationModalEdit {...allProps} />
      ) : allProps.addContactBtn == "t" ? (
        <EmployeeMedicationModalAdd {...allProps} />
      ) : allProps.addContactBtn == "v" ? (
        <EmployeeMedicationModalView {...allProps} />
      ) : null}
    </Modal>
  );
};

export default EmployeeMedicationModal;
