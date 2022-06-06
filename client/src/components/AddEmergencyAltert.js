import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useAuthUserToken } from "../config/auth";
import getCurrentUserInfo from "./GetCurrentUserInfo";
import { Button, Container, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

const ADD_EMERGENCYALERT = gql`
  mutation AddEmergencyAlert(
    $patientCode: String!
    $text: String!
    $phone: String!
  ) {
    addEmergencyAlert(patientCode: $patientCode, text: $text, phone: $phone) {
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

const AddEmergencyAlert = () => {
  let patientCode, text, phone;
  const [addEmergencyAlert, { loading, error }] =
    useMutation(ADD_EMERGENCYALERT);
  const [inputPatientCode, setInputPatientCode] = useState({});
  const [authUserToken] = useAuthUserToken();
  const { currentUserType, currentUserCode } =
    getCurrentUserInfo(authUserToken);

  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  if (currentUserType === "Nurse") {
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
        <Form className="col-5"
          onSubmit={(e) => {
            e.preventDefault();
            setInputPatientCode(patientCode.value);

            addEmergencyAlert({
              variables: {
                patientCode: patientCode.value,
                text: text.value,
                phone: phone.value,
              },
            });

            patientCode.value = "";
            text.value = "";
            phone.value = "";
          }}
        >
          <Form.Group>
            <Form.Label>Patient Code:</Form.Label>
            <Form.Control type="float"
                className="fields"
                name="patientCode"
                ref={(node) => {
                  patientCode = node;
                }}
                placeholder="Patient Code"
                required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Emergency situation:</Form.Label>
            <Form.Control type="text"
                className="fields"
                name="text"
                ref={(node) => {
                  text = node;
                }}
                placeholder="Tell nures how your symptoms feel..."
                required />
          </Form.Group>
           
          <Form.Group>
            <Form.Label>Contact Number:</Form.Label>
            <Form.Control type="text"
                className="fields"
                name="phone"
                ref={(node) => {
                  phone = node;
                }}
                placeholder="Contact number"
                required />
          </Form.Group>
          <Form.Group>
          <Button block size="md" className="mt-2" type="submit">
              Add Emergency Alert <FontAwesomeIcon icon={faAdd} />
          </Button>
          </Form.Group>
        </Form>
      </Container>
    );
  }
};

export default AddEmergencyAlert;
