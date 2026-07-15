// TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): the standalone
// "Resident/Representative Signature : ___ Date: ___" print row is hidden
// per client request. Component now renders nothing — all callers
// (Treatment Plan create/update/view, Initial Assessment create/update/view)
// keep their imports + JSX, but the rendered output is null. To restore,
// uncomment the original implementation below. See
// documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md.

const ResidentPrintSignature = () => {
  return null;
};

/* TEMP-DISABLED-BHP-BHT-ADMIN: original implementation
const ResidentPrintSignature = () => {
  return (
    <Row>
      <Col className="d-flex flex-row justify-end mt-2">
        <span className="fw-bold text-sm">
          Resident/Representative Signature :{" "}
        </span>{" "}
        <p
          class="border-b border-black w-[260px] m-0 text-sm"
        ></p>{" "}
        <span className="fw-bold text-sm">
          Date:{" "}
        </span>
        <p
          class="border-b border-black w-[100px] m-0 text-sm"
        ></p>
      </Col>{" "}
    </Row>
  );
};
*/

export default ResidentPrintSignature;
