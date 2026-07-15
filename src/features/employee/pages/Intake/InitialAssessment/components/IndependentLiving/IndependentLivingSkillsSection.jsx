/* eslint-disable eqeqeq */
/** @format */

import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { Row, Col, Form, Button, Table } from "react-bootstrap";
import { INDEPENDENT_LIVING_SKILLS_FIXED_ROWS } from "../../config/dynamicFormGroups";
import {
  isIndependentLivingRowEmptyForPrint,
  isIndependentLivingSectionHiddenForPrint,
} from "../../utils/dynamicFormState";
import SelectTrueFalse from "../common/SelectTrueFalse";

function SkillCommentsField({ value, onChange }) {
  return (
    <Form.Control
      as="textarea"
      className={`${!value && "hidePrint"}`}
      rows={Math.max(value ? value.split("\n").length : 1, 1)}
      value={value || ""}
      placeholder=""
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onChange(`${value || ""}\n`);
        }
      }}
    />
  );
}

function FixedSkillRow({ row, index, onUpdate, inlineCheckbox = false }) {
  const checkProps = inlineCheckbox ? { inline: true } : {};
  const rowHidden = isIndependentLivingRowEmptyForPrint(row);

  return (
    <tr className={`${rowHidden && "table-row-hinde-print"}`}>
      <td>{row.type}</td>
      <td>
        <Form.Check
          {...checkProps}
          type="checkbox"
          checked={row.good === true}
          onChange={() => onUpdate(index, "good", !row.good)}
        />
      </td>
      <td>
        <Form.Check
          {...checkProps}
          type="checkbox"
          checked={row.fair === true}
          onChange={() => onUpdate(index, "fair", !row.fair)}
        />
      </td>
      <td>
        <Form.Check
          {...checkProps}
          type="checkbox"
          checked={row.otherCurrentNotSoGood === true}
          onChange={() =>
            onUpdate(index, "otherCurrentNotSoGood", !row.otherCurrentNotSoGood)
          }
        />
      </td>
      <td>
        <SelectTrueFalse
          value={row.needAssist}
          onChange={(e) => onUpdate(index, "needAssist", e.target.value)}
        />
      </td>
      <td>
        <SkillCommentsField
          value={row.comments}
          onChange={(value) => onUpdate(index, "comments", value)}
        />
      </td>
    </tr>
  );
}

/**
 * Current Independent Living Skills — dynamic table backed by API array shape.
 */
export default function IndependentLivingSkillsSection({
  fixedRows,
  extraRows,
  otherDraft,
  showTakingMedications,
  updateFixedRow,
  updateOtherDraft,
  appendOtherDraft,
  removeExtraRow,
  canDelete,
}) {
  const sectionHidden = isIndependentLivingSectionHiddenForPrint(
    fixedRows,
    otherDraft.type,
    showTakingMedications,
  );
  const sectionHiddenClass = sectionHidden ? "table-row-hinde-print" : "";

  return (
    <>
      <div className={sectionHiddenClass}>
        <Row>
          <Col xs={12} className={sectionHiddenClass}>
            <Form.Label className="fw-bold">
              Current Independent Living Skills
            </Form.Label>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Table
              responsive="lg"
              bordered
              className={`className="w-50" ${sectionHiddenClass}`}
            >
              <thead className={sectionHiddenClass}>
                <tr>
                  <th>Type of Activity</th>
                  <th>Good</th>
                  <th>Fair</th>
                  <th>Not so good</th>
                  <th>Need assist</th>
                  <th className="w-50">Comments</th>
                </tr>
              </thead>
              <tbody>
                {INDEPENDENT_LIVING_SKILLS_FIXED_ROWS.map((config, index) => {
                  if (config.requiresIndependent10 && !showTakingMedications) {
                    return null;
                  }
                  const row = fixedRows[index] || { type: config.type };
                  return (
                    <FixedSkillRow
                      key={config.type}
                      row={row}
                      index={index}
                      onUpdate={updateFixedRow}
                      inlineCheckbox={config.requiresIndependent10}
                    />
                  );
                })}

                {extraRows?.map((item, index) => (
                  <tr
                    key={`extra-${index}`}
                    className={`${!item?.type && "table-row-hinde-print"}`}
                  >
                    <td>Other: {item?.type}</td>
                    <td>
                      <Form.Check
                        inline
                        className={`${item.good == undefined && "table-row-hinde-print"}`}
                        type="checkbox"
                        checked={item.good === true}
                      />
                    </td>
                    <td>
                      <Form.Check
                        inline
                        type="checkbox"
                        className={`${item.fair == undefined && "table-row-hinde-print"}`}
                        checked={item.fair === true}
                      />
                    </td>
                    <td>
                      <Form.Check
                        inline
                        type="checkbox"
                        className={`${item.otherCurrentNotSoGood == undefined && "table-row-hinde-print"}`}
                        checked={item.otherCurrentNotSoGood === true}
                      />
                    </td>
                    <td>{` ${item.needAssist === true ? "Yes" : "No"}`} </td>
                    <td
                      className={`${!item.comments && "hidePrint"} flex justify-between`}
                    >
                      <p>{item.comments}</p>
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
                  className={`${!otherDraft.type && "table-row-hinde-print"}`}
                >
                  <td className={`${!otherDraft.type && "hidePrint"}`}>
                    Other:{" "}
                    <input
                      type="text"
                      placeholder="___________"
                      value={otherDraft.type}
                      onChange={(e) => updateOtherDraft("type", e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      className={`${otherDraft.good == undefined && "table-row-hinde-print"}`}
                      checked={otherDraft.good}
                      onChange={() =>
                        updateOtherDraft("good", !otherDraft.good)
                      }
                    />
                  </td>
                  <td>
                    <Form.Check
                      className={`${otherDraft.fair == undefined && "table-row-hinde-print"}`}
                      type="checkbox"
                      checked={otherDraft.fair}
                      onChange={() =>
                        updateOtherDraft("fair", !otherDraft.fair)
                      }
                    />
                  </td>
                  <td>
                    <Form.Check
                      className={`${otherDraft.otherCurrentNotSoGood == undefined && "table-row-hinde-print"}`}
                      type="checkbox"
                      checked={otherDraft.otherCurrentNotSoGood}
                      onChange={() =>
                        updateOtherDraft(
                          "otherCurrentNotSoGood",
                          !otherDraft.otherCurrentNotSoGood,
                        )
                      }
                    />
                  </td>
                  <td>
                    <SelectTrueFalse
                      value={otherDraft.needAssist}
                      className={`${!otherDraft.needAssist && "table-row-hinde-print"}`}
                      onChange={(e) =>
                        updateOtherDraft("needAssist", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <SkillCommentsField
                      value={otherDraft.comments}
                      onChange={(value) => updateOtherDraft("comments", value)}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
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
