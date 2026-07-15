/* eslint-disable eqeqeq */
/** @format */

import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { Row, Col, Form, Button, Table } from "react-bootstrap";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import { RISK_FACTORS_FIXED_ROWS } from "../../config/dynamicFormGroups";
import {
  isYesNoRowHiddenForPrint,
  isYesNoSectionHiddenForPrint,
} from "../../utils/dynamicFormState";

const MULTI_SELECT_ROW_INDICES = new Set([6, 7]);

function YesNoCommentRow({ row, index, onUpdate, multiSelectProps }) {
  const hidden = isYesNoRowHiddenForPrint(row);
  const useMultiSelect = MULTI_SELECT_ROW_INDICES.has(index);

  return (
    <tr className={`${hidden && "table-row-hinde-print"}`}>
      <td>{row.type}</td>
      <td>
        <Form.Check
          type="checkbox"
          checked={row.yesNo === true}
          onChange={() => onUpdate(index, "yesNo", true)}
        />
      </td>
      <td>
        <Form.Check
          type="checkbox"
          checked={row.yesNo === false}
          onChange={() => onUpdate(index, "yesNo", false)}
        />
      </td>
      <td
        className={`${useMultiSelect && !row.comments?.length && "hidePrint"}`}
      >
        {useMultiSelect ? (
          <>
            <span className="show-print-inline hidden">
              {row.comments?.map((status) => status?.label).join(", ")}
            </span>
            <div className="hidePrint">
              <CustomMultiSelectInput
                className="w-100 border-none outline-none"
                value={row.comments}
                onChange={(value) => onUpdate(index, "comments", value)}
                options={multiSelectProps?.options}
                isCreatable={true}
                onKeyDown={multiSelectProps?.onKeyDown}
              />
            </div>
          </>
        ) : (
          <Form.Control
            as="textarea"
            className={`${!row.comment && "hidePrint"}`}
            rows="1"
            type="text"
            placeholder=""
            value={row.comment || ""}
            onChange={(e) => onUpdate(index, "comment", e.target.value)}
          />
        )}
      </td>
    </tr>
  );
}

export default function RiskFactorsSection({
  fixedRows,
  extraRows,
  otherDraft,
  updateFixedRow,
  updateOtherDraft,
  appendOtherDraft,
  removeExtraRow,
  canDelete,
  behaviorCuesMultiSelect,
  psychosisMultiSelect,
}) {
  const multiSelectByIndex = {
    6: behaviorCuesMultiSelect,
    7: psychosisMultiSelect,
  };
  const sectionHidden = isYesNoSectionHiddenForPrint(
    fixedRows,
    otherDraft.yesNo,
  );
  const sectionHiddenClass = sectionHidden ? "table-row-hinde-print" : "";

  return (
    <>
      <Row>
        <Col xs={12} className={sectionHiddenClass}>
          <Form.Label className="fw-bold">Risk Factors</Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Table responsive="lg" bordered className={sectionHiddenClass}>
            <thead className={sectionHiddenClass}>
              <tr>
                <th>Select risk factors that apply</th>
                <th>Yes</th>
                <th>No</th>
                <th className="w-50">Comments</th>
              </tr>
            </thead>
            <tbody>
              {RISK_FACTORS_FIXED_ROWS.map((config, index) => (
                <YesNoCommentRow
                  key={config.type}
                  row={fixedRows[index] || { type: config.type }}
                  index={index}
                  onUpdate={updateFixedRow}
                  multiSelectProps={multiSelectByIndex[index]}
                />
              ))}

              {extraRows.length > 0 &&
                extraRows.map((item, index) => (
                  <tr
                    key={`extra-${index}`}
                    className={`${item.yesNo == undefined && "table-row-hinde-print"}`}
                  >
                    <td>{item.type}</td>
                    <td>
                      <Form.Check
                        inline
                        type="checkbox"
                        checked={item.yesNo === true}
                      />
                    </td>
                    <td>
                      <Form.Check
                        inline
                        type="checkbox"
                        checked={item.yesNo === false}
                      />
                    </td>
                    <td
                      className={`${!item.comment && "hidePrint"} flex justify-between`}
                    >
                      <p>{` ${item.comment}`}</p>
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

              <tr
                className={`${otherDraft.yesNo == undefined && "table-row-hinde-print"}`}
              >
                <td>
                  Other :{" "}
                  <input
                    type="text"
                    value={otherDraft.type}
                    placeholder="__________"
                    className={`${!otherDraft.type && "hidePrint"}`}
                    onChange={(e) => updateOtherDraft("type", e.target.value)}
                  />{" "}
                </td>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={otherDraft.yesNo === true}
                    onChange={() => updateOtherDraft("yesNo", true)}
                  />
                </td>
                <td>
                  <Form.Check
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
      <Row className="mb-3 hidPrint">
        <Col xs={12} md={12} className="text-center">
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
