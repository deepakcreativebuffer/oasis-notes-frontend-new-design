/* eslint-disable no-unused-vars, eqeqeq */
/** @format */

import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { Row, Col, Form, Button, Table } from "react-bootstrap";
import { PROTECTIVE_FACTORS_FIXED_ROWS } from "../../config/dynamicFormGroups";
import {
  isYesNoRowHiddenForPrint,
  isYesNoSectionHiddenForPrint,
} from "../../utils/dynamicFormState";

export default function ProtectiveFactorsSection({
  fixedRows,
  extraRows,
  otherDraft,
  updateFixedRow,
  updateOtherDraft,
  appendOtherDraft,
  removeExtraRow,
  canDelete,
}) {
  const sectionHidden = isYesNoSectionHiddenForPrint(
    fixedRows,
    otherDraft.yesNo,
  );
  const sectionHiddenClass =
    sectionHidden && !otherDraft.type
      ? "table-row-hinde-print"
      : sectionHidden
        ? "table-row-hinde-print"
        : "";

  const printHidden =
    fixedRows.every(isYesNoRowHiddenForPrint) && !otherDraft.type
      ? "table-row-hinde-print"
      : "";

  return (
    <>
      <Row>
        <Col xs={12} md={12} className={printHidden}>
          <Form.Label className="fw-bold">Protective factors</Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12}>
          <Table responsive="lg" bordered className={printHidden}>
            <thead className={printHidden}>
              <tr>
                <th>Protective factors that apply</th>
                <th>Yes</th>
                <th>No</th>
                <th className="w-50">Comments</th>
              </tr>
            </thead>
            <tbody>
              {PROTECTIVE_FACTORS_FIXED_ROWS.map((config, index) => {
                const row = fixedRows[index] || { type: config.type };
                const hidden = isYesNoRowHiddenForPrint(row);
                return (
                  <tr
                    key={config.type}
                    className={`${hidden && "table-row-hinde-print"}`}
                  >
                    <td>{row.type}</td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={row.yesNo === true}
                        onChange={() => updateFixedRow(index, "yesNo", true)}
                      />
                    </td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={row.yesNo === false}
                        onChange={() => updateFixedRow(index, "yesNo", false)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        as="textarea"
                        className={`${!row.comment && "hidePrint"}`}
                        rows="1"
                        type="text"
                        placeholder=""
                        value={row.comment || ""}
                        onChange={(e) =>
                          updateFixedRow(index, "comment", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                );
              })}

              {extraRows?.map((item, index) => (
                <tr
                  key={`extra-${index}`}
                  className={`${item.yesNo == undefined && "table-row-hinde-print"}`}
                >
                  <td>{item?.type}</td>
                  <td>
                    <Form.Check type="checkbox" checked={item.yesNo === true} />
                  </td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={item.yesNo === false}
                    />
                  </td>
                  <td
                    className={`${!item.comment && "hidePrint"} flex justify-between`}
                  >
                    <p>{item.comment}</p>
                    {canDelete && (
                      <div className="icon-joiner hidePrint">
                        <span
                          className="del-btn"
                          onClick={() => removeExtraRow(index)}
                        >
                          <AiFillDelete />
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              <tr className={`${!otherDraft.type && "table-row-hinde-print"}`}>
                <td>
                  Other:{" "}
                  <input
                    type="text"
                    className={`${!otherDraft.type && "hidePrint"}`}
                    placeholder="__________"
                    value={otherDraft.type}
                    onChange={(e) => updateOtherDraft("type", e.target.value)}
                  />
                </td>
                <td>
                  <Form.Check
                    inline
                    type="checkbox"
                    checked={otherDraft.yesNo === true}
                    onChange={() => updateOtherDraft("yesNo", true)}
                  />
                </td>
                <td>
                  <Form.Check
                    inline
                    type="checkbox"
                    checked={otherDraft.yesNo === false}
                    onChange={() => updateOtherDraft("yesNo", false)}
                  />
                </td>
                <td>
                  <Form.Control
                    as="textarea"
                    className={`${!otherDraft.comment && "hidePrint"}`}
                    rows="1"
                    type="text"
                    placeholder=""
                    value={otherDraft.comment || ""}
                    onChange={(e) =>
                      updateOtherDraft("comment", e.target.value)
                    }
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row className="mb-3 hidePrint">
        <Col xs={12} className="text-center">
          <Button
            type="button"
            className="theme-button"
            onClick={appendOtherDraft}
          >
            Add
          </Button>
        </Col>
      </Row>
    </>
  );
}
