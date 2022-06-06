import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useAuthUserToken } from "../config/auth";
import getCurrentUserInfo from "./GetCurrentUserInfo";
import { Button, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faRefresh } from "@fortawesome/free-solid-svg-icons";
//
//
// To parse the GraphQL operations, we use a special function
// called a tagged template literal to allow us to express them
// as JavaScript strings. This function is named gql
//
// note the backquotes here
const GET_EMERGENCYALERT = gql`
  {
    emergencyAlerts {
      _id
      patientCode
      text
      phone
    }
  }
`;

//
const EmergencyAlerts = () => {
  const [authUserToken] = useAuthUserToken();
  const { currentUserType } = getCurrentUserInfo(authUserToken);

  const { loading, error, data, refetch } = useQuery(GET_EMERGENCYALERT);
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
              <th>Emergency Situation</th>
              <th>Contact Number</th>
            </tr>
          </thead>
          <tbody>
            {data.emergencyAlerts.map((emergencyAlert, index) => (
              <tr key={index}>
                <td>{emergencyAlert.patientCode}</td>
                <td>{emergencyAlert.text}</td>
                <td>{emergencyAlert.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Button className="center" onClick={() => refetch()}>
          Refetch <FontAwesomeIcon icon={faRefresh} />
        </Button>
      </Container>
    );
  }
};

export default EmergencyAlerts;
