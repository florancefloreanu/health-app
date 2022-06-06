import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useAuthUserToken } from "../config/auth";
import getCurrentUserInfo from "./GetCurrentUserInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { Container } from "react-bootstrap";

//
//
// To parse the GraphQL operations, we use a special function
// called a tagged template literal to allow us to express them
// as JavaScript strings. This function is named gql
//
// note the backquotes here
const GET_DAILYTIP = gql`
  {
    dailyTips {
      _id
      nurseCode
      patientCode
      text
      date
    }
  }
`;

//
const DailyTips = () => {
  const [authUserToken] = useAuthUserToken();
  const { currentUserType, currentUserCode } =
    getCurrentUserInfo(authUserToken);

  const { loading, error, data, refetch } = useQuery(GET_DAILYTIP);
  const [userCode, setUserCode] = useState(" " + currentUserCode);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
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
        <br />
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
              <th>Daily Motivation Tips</th>
            </tr>
          </thead>
          <tbody>
            {data.dailyTips
              .filter((tip) => {
                return tip.patientCode == userCode;
              })
              .map((tip, index) => (
                <tr key={index}>
                  <td>{tip.date}</td>
                  <td>Nurse ({tip.nurseCode})</td>
                  <td>You ({tip.patientCode})</td>
                  <td>{tip.text}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="center">
          <br />
          <button className="btn btn-primary" onClick={() => refetch()}>
            Refetch <FontAwesomeIcon icon={faRefresh} />
          </button>
        </div>
      </Container>
    );
  }
};

export default DailyTips;
