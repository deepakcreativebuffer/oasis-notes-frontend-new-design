/* eslint-disable no-unused-vars, eqeqeq */
/** @format */

import React from "react";
import { Row, Col, Form, Table, Button } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";

/**
 * SECTION II — medications note + medical/psychiatric conditions table.
 */
export default function MedicalConditionsSection(props) {
  const {
    AllergiesComment,
    AllergiesYes,
    AnxietyComment,
    AnxietyYes,
    BipolarComment,
    BipolarYes,
    DepressionComment,
    DepressionYes,
    InfectionYes,
    InsomniaComment,
    InsomniaYes,
    ObsessiveComment,
    ObsessiveYes,
    OtherConditionOther,
    PersonalityComment,
    PersonalityYes,
    PhobiasComment,
    PhobiasYes,
    SchizophreniaComment,
    SchizophreniaYes,
    SubstanceComment,
    SubstanceYes,
    SurgeriesComment,
    SurgeriesYes,
    chronicCommit,
    commentCancer,
    commentDiabety,
    commentHeart,
    commentHigh,
    commentHistory,
    commentLiver,
    commentLung,
    commentSeizures,
    commentbrain,
    canDelete,
    handleAddCondition,
    handleKeyInfectionDiseases,
    handleKeyThyroidDisorder,
    healthConditionsYes,
    healthConditionsYesComment,
    infectionDiseases,
    infectionDiseasesHandler,
    infectionDiseasesOptions,
    otherConditionArray,
    otherConditionDiscription,
    otherConditionYesNO,
    pregnanciesComment,
    pregnanciesYes,
    removehandleAddCondition,
    setAllergiesComment,
    setAllergiesYes,
    setAnxietyComment,
    setAnxietyYes,
    setBipolarComment,
    setBipolarYes,
    setChronicCommit,
    setCommentCancer,
    setCommentDeabetes,
    setCommentHeart,
    setCommentHigh,
    setCommentHistory,
    setCommentLiver,
    setCommentLung,
    setCommentSeizures,
    setYesBrain,
    setbrain,
    setThyroidDisorder,
    setInfectionDiseases,
    setDepressionComment,
    setDepressionYes,
    setHealthConditionsYes,
    setInfectionYes,
    setInsomniaComment,
    setInsomniaYes,
    setObsessiveComment,
    setObsessiveYes,
    setOtherConditionDiscription,
    setOtherConditionOther,
    setOtherConditionYesNo,
    setPersonalityComment,
    setPersonalityYes,
    setPhobiasComment,
    setPhobiasYes,
    setPregnanciesComment,
    setPregnanciesYes,
    setSchizophreniaComment,
    setSchizophreniaYes,
    setSubstanceComment,
    setSubstanceYes,
    setSurgeriesComment,
    setSurgeriessYes,
    setYesCancer,
    setYesChronic,
    setYesDiabetes,
    setYesHeart,
    setYesHigh,
    setYesHistory,
    setYesLiver,
    setYesLung,
    setYesSeizures,
    setYesThyroid,
    sethealthConditionsYesComment,
    thyroidDisorder,
    thyroidOptions,
    thyroiddisorderhnadler,
    yesCancer,
    yesChronic,
    yesDiabetes,
    yesHeart,
    yesHigh,
    yesHistory,
    yesLiver,
    yesLung,
    yesSeizures,
    yesThyroid,
    yesbrain,
  } = props;

  return (
    <>
      <Row className="my-3">
        <Col xs={12}>
          <Form.Label className="fw-bold h5 w-100 text-center">
            SECTION II
          </Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Form.Label className="fw-bold">
            A. Currently prescribed medications are attached on a separate page.
          </Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Form.Label className="fw-bold">
            B. Current and Past Medical/Psychiatric Conditions.
          </Form.Label>
        </Col>
      </Row>

      <Row>
        <Col xs={12} sm={12}>
          <Table
            responsive="lg"
            bordered
            className={`table-fix-layout ${yesDiabetes === undefined && yesHeart === undefined && yesHistory === undefined && yesHigh === undefined && yesLung === undefined && yesSeizures === undefined && yesCancer === undefined && yesLiver === undefined && yesThyroid === undefined && yesbrain === undefined && yesChronic === undefined && AllergiesYes === undefined && SurgeriesYes === undefined && pregnanciesYes === undefined && SubstanceYes === undefined && DepressionYes === undefined && AnxietyYes === undefined && InsomniaYes === undefined && BipolarYes === undefined && SchizophreniaYes === undefined && ObsessiveYes === undefined && PersonalityYes === undefined && PhobiasYes === undefined && healthConditionsYes === undefined && InfectionYes === undefined && !OtherConditionOther && "table-row-hinde-print"}`}
          >
            <thead
              className={`overflow-clip ${yesDiabetes === undefined && yesHeart === undefined && yesHistory === undefined && yesHigh === undefined && yesLung === undefined && yesSeizures === undefined && yesCancer === undefined && yesLiver === undefined && yesThyroid === undefined && yesbrain === undefined && yesChronic === undefined && AllergiesYes === undefined && SurgeriesYes === undefined && pregnanciesYes === undefined && SubstanceYes === undefined && DepressionYes === undefined && AnxietyYes === undefined && InsomniaYes === undefined && BipolarYes === undefined && SchizophreniaYes === undefined && ObsessiveYes === undefined && PersonalityYes === undefined && PhobiasYes === undefined && healthConditionsYes === undefined && InfectionYes === undefined && !OtherConditionOther && "table-row-hinde-print"}`}
            >
              <tr>
                <th>Conditions</th>
                <th className="text-center">Yes</th>
                <th className="text-center">No</th>
                <th className="w-50">Comments</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={`${yesDiabetes == undefined && "table-row-hinde-print"}`}
              >
                <td>Diabetes</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="diabetes"
                    checked={yesDiabetes === true}
                    onChange={() => setYesDiabetes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="diabetesno"
                    checked={yesDiabetes === false}
                    onChange={() => setYesDiabetes(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    className={`${!commentDiabety && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof commentDiabety === "string"
                        ? commentDiabety.split("\n").length
                        : 1,
                      1,
                    )}
                    value={commentDiabety || ""}
                    placeholder="___________"
                    onChange={(e) => setCommentDeabetes(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setCommentDeabetes((prevComment) => prevComment + "\n");
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${yesHeart == undefined && "table-row-hinde-print"}`}
              >
                <td>Heart disease / heart attack</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="yesHeart"
                    checked={yesHeart === true}
                    onChange={() => setYesHeart(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="yesHeartno"
                    checked={yesHeart === false}
                    onChange={() => setYesHeart(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    className={`${!commentHeart && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof commentHeart === "string"
                        ? commentHeart.split("\n").length
                        : 1,
                      1,
                    )}
                    value={commentHeart || ""}
                    placeholder="___________"
                    onChange={(e) => setCommentHeart(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setCommentHeart((prevComment) => prevComment + "\n");
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${yesHistory == undefined && "table-row-hinde-print"}`}
              >
                <td>History of stroke</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="yesHistory"
                    checked={yesHistory === true}
                    onChange={() => setYesHistory(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="yesHistoryno"
                    checked={yesHistory === false}
                    onChange={() => setYesHistory(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    className={`${!commentHistory && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof commentHistory === "string"
                        ? commentHistory.split("\n").length
                        : 1,
                      1,
                    )}
                    value={commentHistory || ""}
                    placeholder="___________"
                    onChange={(e) => setCommentHistory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setCommentHistory((prevComment) => prevComment + "\n");
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${yesHigh == undefined && "table-row-hinde-print"}`}
              >
                <td>High Blood Pressure</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="yesHigh"
                    checked={yesHigh === true}
                    onChange={() => setYesHigh(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="yesHighno"
                    checked={yesHigh === false}
                    onChange={() => setYesHigh(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    className={`${!commentHigh && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof commentHigh === "string"
                        ? commentHigh.split("\n").length
                        : 1,
                      1,
                    )}
                    value={commentHigh || ""}
                    placeholder="___________"
                    onChange={(e) => setCommentHigh(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setCommentHigh((prevComment) => prevComment + "\n");
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${yesLung == undefined && "table-row-hinde-print"}`}
              >
                <td>Lung disease (ie asthma, COPD, emphysema)</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="yesLung"
                    checked={yesLung === true}
                    onChange={() => setYesLung(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="yesLungno"
                    checked={yesLung === false}
                    onChange={() => setYesLung(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    className={`${!commentLung && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof commentLung === "string"
                        ? commentLung.split("\n").length
                        : 1,
                      1,
                    )}
                    value={commentLung || ""}
                    placeholder="___________"
                    onChange={(e) => setCommentLung(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setCommentLung((prevComment) => prevComment + "\n");
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${yesSeizures == undefined && "table-row-hinde-print"}`}
              >
                <td>Seizures</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="diabetes"
                    checked={yesSeizures === true}
                    onChange={() => setYesSeizures(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="yesSeizuresno"
                    checked={yesSeizures === false}
                    onChange={() => setYesSeizures(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    className={`${!commentSeizures && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof commentSeizures === "string"
                        ? commentSeizures.split("\n").length
                        : 1,
                      1,
                    )}
                    value={commentSeizures || ""}
                    placeholder="___________"
                    onChange={(e) => setCommentSeizures(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setCommentSeizures((prevComment) => prevComment + "\n");
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${yesCancer == undefined && "table-row-hinde-print"}`}
              >
                <td>Cancer</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="yesCancer"
                    checked={yesCancer === true}
                    onChange={() => setYesCancer(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="yesCancerno"
                    checked={yesCancer === false}
                    onChange={() => setYesCancer(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    className={`${!commentCancer && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof commentCancer === "string"
                        ? commentCancer.split("\n").length
                        : 1,
                      1,
                    )}
                    value={commentCancer || ""}
                    placeholder="___________"
                    onChange={(e) => setCommentCancer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setCommentCancer((prevComment) => prevComment + "\n");
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${yesLiver == undefined && "table-row-hinde-print"}`}
              >
                <td>Liver/kidney disease</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="yesLiver"
                    checked={yesLiver === true}
                    onChange={() => setYesLiver(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="yesLiverno"
                    checked={yesLiver === false}
                    onChange={() => setYesLiver(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    className={`${!commentLiver && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof commentLiver === "string"
                        ? commentLiver.split("\n").length
                        : 1,
                      1,
                    )}
                    value={commentLiver || ""}
                    placeholder="___________"
                    onChange={(e) => setCommentLiver(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setCommentLiver((prevComment) => prevComment + "\n");
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${yesThyroid == undefined && "table-row-hinde-print"}`}
              >
                <td className="print-fw-300">Thyroid disorder</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="yesThyroid"
                    checked={yesThyroid === true}
                    onChange={() => setYesThyroid(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="setYesThyroidno"
                    checked={yesThyroid === false}
                    onChange={() => setYesThyroid(false)}
                  />
                </td>
                <td className={`${!thyroidDisorder && "hidePrint"}`}>
                  <span className="show-print-inline hidden">
                    {thyroidDisorder?.map((status) => status?.label).join(", ")}
                  </span>
                  <div className="hidePrint">
                    <CustomMultiSelectInput
                      className="w-100 border-none outline-none"
                      value={thyroidDisorder}
                      onChange={thyroiddisorderhnadler}
                      options={thyroidOptions}
                      isCreatable={true}
                      onKeyDown={handleKeyThyroidDisorder}
                    />
                  </div>
                </td>
              </tr>

              <tr
                className={`${yesbrain == undefined && "table-row-hinde-print"}`}
              >
                <td>History of head trauma/traumatic brain injury</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="yesbrain"
                    checked={yesbrain === true}
                    onChange={() => setYesBrain(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="yesbrainno"
                    checked={yesbrain === false}
                    onChange={() => setYesBrain(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    className={`${!commentbrain && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof commentbrain === "string"
                        ? commentbrain.split("\n").length
                        : 1,
                      1,
                    )}
                    value={commentbrain || ""}
                    placeholder="___________"
                    onChange={(e) => setbrain(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setbrain((prevComment) => prevComment + "\n");
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${yesChronic == undefined && "table-row-hinde-print"}`}
              >
                <td>Chronic pain</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="Chronic"
                    checked={yesChronic === true}
                    onChange={() => setYesChronic(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="Chronicno"
                    checked={yesChronic === false}
                    onChange={() => setYesChronic(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    className={`${!chronicCommit && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof chronicCommit === "string"
                        ? chronicCommit.split("\n").length
                        : 1,
                      1,
                    )}
                    value={chronicCommit || ""}
                    placeholder="___________"
                    onChange={(e) => setChronicCommit(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setChronicCommit((prevComment) => prevComment + "\n");
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${AllergiesYes == undefined && "table-row-hinde-print"}`}
              >
                <td>Allergies</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="AllergiesYes"
                    disabled
                    checked={AllergiesYes === true}
                    onChange={() => setAllergiesYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="AllergiesYesno"
                    disabled
                    checked={AllergiesYes === false}
                    onChange={() => setAllergiesYes(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    className={`${!AllergiesComment && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof AllergiesComment === "string"
                        ? AllergiesComment.split("\n").length
                        : 1,
                      1,
                    )}
                    value={AllergiesComment || ""}
                    placeholder="___________"
                    disabled
                    onChange={(e) => setAllergiesComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setAllergiesComment(
                          (prevComment) => prevComment + "\n",
                        );
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${SurgeriesYes == undefined && "table-row-hinde-print"}`}
              >
                <td>Surgeries</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="SurgeriesYes"
                    checked={SurgeriesYes === true}
                    onChange={() => setSurgeriessYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="SurgeriesYesno"
                    checked={SurgeriesYes === false}
                    onChange={() => setSurgeriessYes(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    className={`${!SurgeriesComment && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof SurgeriesComment === "string"
                        ? SurgeriesComment.split("\n").length
                        : 1,
                      1,
                    )}
                    value={SurgeriesComment || ""}
                    placeholder="___________"
                    onChange={(e) => setSurgeriesComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setSurgeriesComment(
                          (prevComment) => prevComment + "\n",
                        );
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${pregnanciesYes == undefined && "table-row-hinde-print"}`}
              >
                <td>Number of pregnancies / births</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="pregnanciesYes"
                    checked={pregnanciesYes === true}
                    onChange={() => setPregnanciesYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="pregnanciesYesno"
                    checked={pregnanciesYes === false}
                    onChange={() => setPregnanciesYes(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    className={`${!pregnanciesComment && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof pregnanciesComment === "string"
                        ? pregnanciesComment.split("\n").length
                        : 1,
                      1,
                    )}
                    value={pregnanciesComment || ""}
                    placeholder="___________"
                    onChange={(e) => setPregnanciesComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setPregnanciesComment(
                          (prevComment) => prevComment + "\n",
                        );
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${SubstanceYes == undefined && "table-row-hinde-print"}`}
              >
                <td>Substance use disorder (please specify)</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="SubstanceYes"
                    checked={SubstanceYes === true}
                    onChange={() => setSubstanceYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="SubstanceYesno"
                    checked={SubstanceYes === false}
                    onChange={() => setSubstanceYes(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    className={`${!SubstanceComment && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof SubstanceComment === "string"
                        ? SubstanceComment.split("\n").length
                        : 1,
                      1,
                    )}
                    value={SubstanceComment || ""}
                    placeholder="___________"
                    onChange={(e) => setSubstanceComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setSubstanceComment(
                          (prevComment) => prevComment + "\n",
                        );
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${DepressionYes == undefined && "table-row-hinde-print"}`}
              >
                <td>Depression</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="DepressionYes"
                    checked={DepressionYes === true}
                    onChange={() => setDepressionYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="DepressionYesno"
                    checked={DepressionYes === false}
                    onChange={() => setDepressionYes(false)}
                  />
                </td>
                <td className={`${!DepressionComment && "hidePrint"}`}>
                  <Form.Control
                    as="textarea"
                    rows={Math.max(
                      typeof DepressionComment === "string"
                        ? DepressionComment.split("\n").length
                        : 1,
                      1,
                    )}
                    value={DepressionComment || ""}
                    placeholder="___________"
                    onChange={(e) => setDepressionComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setDepressionComment(
                          (prevComment) => prevComment + "\n",
                        );
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${AnxietyYes == undefined && "table-row-hinde-print"}`}
              >
                <td>Anxiety/panic attacks</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="AnxietyYes"
                    checked={AnxietyYes === true}
                    onChange={() => setAnxietyYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="AnxietyYesno"
                    checked={AnxietyYes === false}
                    onChange={() => setAnxietyYes(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    as="textarea"
                    className={`${!AnxietyComment && "hidePrint"}`}
                    rows={Math.max(
                      typeof AnxietyComment === "string"
                        ? AnxietyComment.split("\n").length
                        : 1,
                      1,
                    )}
                    value={AnxietyComment || ""}
                    placeholder="___________"
                    onChange={(e) => setAnxietyComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setAnxietyComment((prevComment) => prevComment + "\n");
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${InsomniaYes == undefined && "table-row-hinde-print"}`}
              >
                <td>Insomnia</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="InsomniaYes"
                    checked={InsomniaYes === true}
                    onChange={() => setInsomniaYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="InsomniaYesno"
                    checked={InsomniaYes === false}
                    onChange={() => setInsomniaYes(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    className={`${!InsomniaComment && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof InsomniaComment === "string"
                        ? InsomniaComment.split("\n").length
                        : 1,
                      1,
                    )}
                    value={InsomniaComment || ""}
                    placeholder="___________"
                    onChange={(e) => setInsomniaComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setInsomniaComment((prevComment) => prevComment + "\n");
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${BipolarYes == undefined && "table-row-hinde-print"}`}
              >
                <td>Bipolar disorder</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="BipolarYes"
                    checked={BipolarYes === true}
                    onChange={() => setBipolarYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="BipolarYesno"
                    checked={BipolarYes === false}
                    onChange={() => setBipolarYes(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    className={`${!BipolarComment && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof BipolarComment === "string"
                        ? BipolarComment.split("\n").length
                        : 1,
                      1,
                    )}
                    value={BipolarComment || ""}
                    placeholder="___________"
                    onChange={(e) => setBipolarComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setBipolarComment((prevComment) => prevComment + "\n");
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${SchizophreniaYes == undefined && "table-row-hinde-print"}`}
              >
                <td>Schizophrenia</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="SchizophreniaYes"
                    checked={SchizophreniaYes === true}
                    onChange={() => setSchizophreniaYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="SchizophreniaYesno"
                    checked={SchizophreniaYes === false}
                    onChange={() => setSchizophreniaYes(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    className={`${!SchizophreniaComment && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof SchizophreniaComment === "string"
                        ? SchizophreniaComment.split("\n").length
                        : 1,
                      1,
                    )}
                    value={SchizophreniaComment || ""}
                    placeholder="___________"
                    onChange={(e) => setSchizophreniaComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setSchizophreniaComment(
                          (prevComment) => prevComment + "\n",
                        );
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${ObsessiveYes == undefined && "table-row-hinde-print"}`}
              >
                <td>Obsessive compulsive disorder</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="ObsessiveYes"
                    checked={ObsessiveYes === true}
                    onChange={() => setObsessiveYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="ObsessiveYesno"
                    checked={ObsessiveYes === false}
                    onChange={() => setObsessiveYes(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    className={`${!ObsessiveComment && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof ObsessiveComment === "string"
                        ? ObsessiveComment.split("\n").length
                        : 1,
                      1,
                    )}
                    value={ObsessiveComment || ""}
                    placeholder="___________"
                    onChange={(e) => setObsessiveComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setObsessiveComment(
                          (prevComment) => prevComment + "\n",
                        );
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${PersonalityYes == undefined && "table-row-hinde-print"}`}
              >
                <td>Personality disorder (please specify)</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="PersonalityYes"
                    checked={PersonalityYes === true}
                    onChange={() => setPersonalityYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="PersonalityYesno"
                    checked={PersonalityYes === false}
                    onChange={() => setPersonalityYes(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    className={`${!PersonalityComment && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof PersonalityComment === "string"
                        ? PersonalityComment.split("\n").length
                        : 1,
                      1,
                    )}
                    value={PersonalityComment || ""}
                    placeholder="___________"
                    onChange={(e) => setPersonalityComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setPersonalityComment(
                          (prevComment) => prevComment + "\n",
                        );
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${PhobiasYes == undefined && "table-row-hinde-print"}`}
              >
                <td>Phobias</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="PhobiasYes"
                    checked={PhobiasYes === true}
                    onChange={() => setPhobiasYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="PhobiasYesno"
                    checked={PhobiasYes === false}
                    onChange={() => setPhobiasYes(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    className={`${!PhobiasComment && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof PhobiasComment === "string"
                        ? PhobiasComment.split("\n").length
                        : 1,
                      1,
                    )}
                    value={PhobiasComment || ""}
                    placeholder="___________"
                    onChange={(e) => setPhobiasComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setPhobiasComment((prevComment) => prevComment + "\n");
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${healthConditionsYes == undefined && "table-row-hinde-print"}`}
              >
                <td>Any other health conditions</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="healthConditionsYes"
                    checked={healthConditionsYes === true}
                    onChange={() => setHealthConditionsYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="healthConditionsYesno"
                    checked={healthConditionsYes === false}
                    onChange={() => setHealthConditionsYes(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    as="textarea"
                    className={`${!healthConditionsYesComment && "hidePrint"}`}
                    rows={Math.max(
                      typeof healthConditionsYesComment === "string"
                        ? healthConditionsYesComment.split("\n").length
                        : 1,
                      1,
                    )}
                    value={healthConditionsYesComment || ""}
                    placeholder="___________"
                    onChange={(e) =>
                      sethealthConditionsYesComment(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sethealthConditionsYesComment(
                          (prevComment) => prevComment + "\n",
                        );
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${InfectionYes == undefined && "table-row-hinde-print"}`}
              >
                <td className="print-fw-300">Infection or Diseases</td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="InfectionYes"
                    checked={InfectionYes === true}
                    onChange={() => setInfectionYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    id="InfectionYesno"
                    checked={InfectionYes === false}
                    onChange={() => setInfectionYes(false)}
                  />
                </td>
                <td className={`${!infectionDiseases && "hidePrint"}`}>
                  <span className="show-print-inline hidden">
                    {infectionDiseases
                      ?.map((status) => status?.label)
                      .join(", ")}
                  </span>
                  <div className="hidePrint">
                    <CustomMultiSelectInput
                      className="w-100 border-none outline-none"
                      value={infectionDiseases}
                      onChange={infectionDiseasesHandler}
                      options={infectionDiseasesOptions}
                      isCreatable={true}
                      onKeyDown={handleKeyInfectionDiseases}
                    />
                  </div>
                </td>
              </tr>
              {otherConditionArray?.map((i, index) => (
                <tr
                  className={`${!i.condition && i.condition == undefined && "table-row-hinde-print"}`}
                  key={index}
                >
                  <td>{i.condition}</td>
                  <td className="text-center">
                    <Form.Check type="checkbox" checked={i.yes === true} />
                  </td>
                  <td className="text-center">
                    <Form.Check type="checkbox" checked={i.yes === false} />
                  </td>
                  <td
                    className={`${!i.comments && "hidePrint"} flex justify-between`}
                  >
                    <p>{i.comments}</p>
                    {canDelete && (
                      <div className="icon-joiner hidePrint">
                        <span
                          className="del-btn"
                          onClick={() => removehandleAddCondition(index)}
                        >
                          <AiFillDelete />
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              <tr
                className={`${!OtherConditionOther && "table-row-hinde-print"}`}
              >
                <td>
                  Other:{" "}
                  <input
                    type="text"
                    className={`${!OtherConditionOther && "hidePrint"}`}
                    value={OtherConditionOther}
                    onChange={(e) => setOtherConditionOther(e.target.value)}
                    placeholder="___________"
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    checked={otherConditionYesNO === true}
                    onChange={() => setOtherConditionYesNo(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    type="checkbox"
                    checked={otherConditionYesNO === false}
                    onChange={() => setOtherConditionYesNo(false)}
                  />
                </td>
                <td>
                  <Form.Control
                    as="textarea"
                    className={`${!otherConditionDiscription && "hidePrint"}`}
                    rows={Math.max(
                      typeof otherConditionDiscription === "string"
                        ? otherConditionDiscription.split("\n").length
                        : 1,
                      1,
                    )}
                    value={otherConditionDiscription || ""}
                    placeholder="___________"
                    onChange={(e) =>
                      setOtherConditionDiscription(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setOtherConditionDiscription(
                          (prevComment) => prevComment + "\n",
                        );
                      }
                    }}
                  ></Form.Control>
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
            onClick={handleAddCondition}
          >
            Add
          </Button>
        </Col>
      </Row>
    </>
  );
}

export const MEDICAL_CONDITIONS_SECTION_PROP_KEYS = [
  "AllergiesComment",
  "AllergiesYes",
  "AnxietyComment",
  "AnxietyYes",
  "BipolarComment",
  "BipolarYes",
  "DepressionComment",
  "DepressionYes",
  "InfectionYes",
  "InsomniaComment",
  "InsomniaYes",
  "ObsessiveComment",
  "ObsessiveYes",
  "OtherConditionOther",
  "PersonalityComment",
  "PersonalityYes",
  "PhobiasComment",
  "PhobiasYes",
  "SchizophreniaComment",
  "SchizophreniaYes",
  "SubstanceComment",
  "SubstanceYes",
  "SurgeriesComment",
  "SurgeriesYes",
  "chronicCommit",
  "commentCancer",
  "commentDiabety",
  "commentHeart",
  "commentHigh",
  "commentHistory",
  "commentLiver",
  "commentLung",
  "commentSeizures",
  "commentbrain",
  "canDelete",
  "handleAddCondition",
  "handleKeyInfectionDiseases",
  "handleKeyThyroidDisorder",
  "healthConditionsYes",
  "healthConditionsYesComment",
  "infectionDiseases",
  "infectionDiseasesHandler",
  "infectionDiseasesOptions",
  "otherConditionArray",
  "otherConditionDiscription",
  "otherConditionYesNO",
  "pregnanciesComment",
  "pregnanciesYes",
  "removehandleAddCondition",
  "setAllergiesComment",
  "setAllergiesYes",
  "setAnxietyComment",
  "setAnxietyYes",
  "setBipolarComment",
  "setBipolarYes",
  "setChronicCommit",
  "setCommentCancer",
  "setCommentDeabetes",
  "setCommentHeart",
  "setCommentHigh",
  "setCommentHistory",
  "setCommentLiver",
  "setCommentLung",
  "setCommentSeizures",
  "setYesBrain",
  "setbrain",
  "setThyroidDisorder",
  "setInfectionDiseases",
  "setDepressionComment",
  "setDepressionYes",
  "setHealthConditionsYes",
  "setInfectionYes",
  "setInsomniaComment",
  "setInsomniaYes",
  "setObsessiveComment",
  "setObsessiveYes",
  "setOtherConditionDiscription",
  "setOtherConditionOther",
  "setOtherConditionYesNo",
  "setPersonalityComment",
  "setPersonalityYes",
  "setPhobiasComment",
  "setPhobiasYes",
  "setPregnanciesComment",
  "setPregnanciesYes",
  "setSchizophreniaComment",
  "setSchizophreniaYes",
  "setSubstanceComment",
  "setSubstanceYes",
  "setSurgeriesComment",
  "setSurgeriessYes",
  "setYesCancer",
  "setYesChronic",
  "setYesDiabetes",
  "setYesHeart",
  "setYesHigh",
  "setYesHistory",
  "setYesLiver",
  "setYesLung",
  "setYesSeizures",
  "setYesThyroid",
  "sethealthConditionsYesComment",
  "thyroidDisorder",
  "thyroidOptions",
  "thyroiddisorderhnadler",
  "yesCancer",
  "yesChronic",
  "yesDiabetes",
  "yesHeart",
  "yesHigh",
  "yesHistory",
  "yesLiver",
  "yesLung",
  "yesSeizures",
  "yesThyroid",
  "yesbrain",
];
