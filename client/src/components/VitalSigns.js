import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useAuthUserToken } from "../config/auth";
import getCurrentUserInfo from "./GetCurrentUserInfo";
import { Button, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
//
//
// To parse the GraphQL operations, we use a special function
// called a tagged template literal to allow us to express them
// as JavaScript strings. This function is named gql
//
// note the backquotes here
const GET_VITALSIGNS = gql`
  {
    vitalSigns {
      _id
      patientCode
      bodyTemperature
      heartRate
      bloodPressure
      respiratoryRate
      nurseCode
    }
  }
`;

//
const VitalSigns = () => {
  const [authUserToken] = useAuthUserToken();
  const { currentUserType } = getCurrentUserInfo(authUserToken);

  const { loading, error, data, refetch } = useQuery(GET_VITALSIGNS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
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
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Patient Code</th>
              <th>Body Temperature</th>
              <th>Heart Rate</th>
              <th>Blood Pressure</th>
              <th>Respiratory Rate</th>
              <th>Recorded by</th>
            </tr>
          </thead>
          {data.vitalSigns.map((vitalSign, index) => (
            <tr key={index}>
              <td>{vitalSign.patientCode}</td>
              <td>{vitalSign.bodyTemperature}</td>
              <td>{vitalSign.heartRate}</td>
              <td>{vitalSign.bloodPressure}</td>
              <td>{vitalSign.respiratoryRate}</td>
              <td>{vitalSign.nurseCode}</td>
            </tr>
          ))}
        </table>

        <Button onClick={() => refetch()}>
          Refetch <FontAwesomeIcon icon={faRefresh} />
        </Button>
      </Container>
    );
  }
};

export default VitalSigns;
