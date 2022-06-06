import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import Form from "react-bootstrap/Form";
import { useAuthUserToken } from "../config/auth";
import getCurrentUserInfo from "./GetCurrentUserInfo";

const ADD_DAILYTIP = gql`
  mutation AddDailyTip(
    $nurseCode: String!
    $patientCode: String!
    $text: String!
    $date: String!
  ) {
    addDailyTip(
      nurseCode: $nurseCode
      patientCode: $patientCode
      text: $text
      date: $date
    ) {
      _id
    }
  }
`;

const FIND_USER = gql`
  query FindUserByCode($userCode: String!) {
    userByCode(userCode: $userCode) {
      _id
      userType
    }
  }
`;

const AddDailyTip = () => {
  let nurseCode, patientCode, text, date;
  const [addDailyTip, { loading, error }] = useMutation(ADD_DAILYTIP);
  const [inputNurseCode, setInputNurseCode] = useState({});
  const [inputPatientCode, setInputPatientCode] = useState({});
  const [inputText, setInputText] = useState({});
  const [inputDate, setInputDate] = useState("");
  const [authUserToken] = useAuthUserToken();
  const { currentUserType, currentUserCode } =
    getCurrentUserInfo(authUserToken);

  useEffect(() => {
    // Today
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    var todayDateTemp = yyyy + "/" + mm + "/" + dd;
    setInputDate(todayDateTemp);
  }, []);

  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  if (currentUserType !== "Nurse") {
    return (
      <Container>
        <h2>Access denied</h2>
        <h5>Sorry, but you don't have permission to access this page</h5>
        <a type="button" className="btn btn-primary" href="/">
          Go to Home
        </a>
      </Container>
    );
  } else {
    return (
      <Container>
        <Form className="col-5 mt-2"
          onSubmit={(e) => {
            e.preventDefault();
            setInputNurseCode(currentUserCode);
            setInputPatientCode(patientCode.value);
            setInputText(inputText.value);

            addDailyTip({
              variables: {
                nurseCode: currentUserCode,
                patientCode: patientCode.value,
                text: text.value,
                date: inputDate,
              },
            });

            nurseCode.value = "";
            patientCode.value = "";
            text.value = "";
          }}
        >
            <Form.Group>
              <Form.Label>
                <b>Nurse Code:</b>
              </Form.Label>
              <Form.Control
                type="float"
              
                name="nurseCode"
                ref={(node) => {
                  nurseCode = node;
                }}
                placeholder={currentUserCode}
                disabled
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                <b>Patient Code:</b>
              </Form.Label>
              <Form.Control
                type="float"
              
                name="patientCode"
                ref={(node) => {
                  patientCode = node;
                }}
                placeholder="Patient Code"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                <b>Daily Tips</b>
              </Form.Label>
              <Form.Control
                type="float"
              
                name="text"
                ref={(node) => {
                  text = node;
                }}
                placeholder="Enter daily tips...."
                required
              />
            </Form.Group>
            <Form.Group>
              <Button type="submit" className="mt-2">
                Add Daily Tip <FontAwesomeIcon icon={faAdd} />
              </Button>
            </Form.Group>
        </Form>
      </Container>
    );
  }
};

export default AddDailyTip;
