import React, { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { useAuthUserToken } from "../config/auth";
import getCurrentUserInfo from "./GetCurrentUserInfo";
import { NavLink } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faRefresh } from "@fortawesome/free-solid-svg-icons";

const GET_DailyInfo = gql`
  {
    dailyInfos {
      _id
      pulseRate
      bloodPressure
      weight
      temprature
      respiratoryRate
      date
    }
  }
`;

const DailyInfo = () => {
  const [authUserToken] = useAuthUserToken();
  const { currentUserType } = getCurrentUserInfo(authUserToken);

  const { loading, error, data, refetch } = useQuery(GET_DailyInfo);

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
      <React.Fragment>
          <Container>
          <NavLink className="btn btn-primary mt-1" to="/adddailyinfo">
              Add Daily Information <FontAwesomeIcon icon={faAdd} />
            </NavLink>
            <table className="table table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>Date</th>
                  <th>Pulse Rate</th>
                  <th>Blood Pressure</th>
                  <th>Weight</th>
                  <th>Temprature</th>
                  <th>Respiratory Rate</th>
                </tr>
              </thead>
              <tbody>
                {data.dailyInfos.map((dailyInfo, index) => (
                  <tr key={index}>
                    <td>{dailyInfo.date}</td>
                    <td>{dailyInfo.pulseRate}</td>
                    <td>{dailyInfo.bloodPressure}</td>
                    <td>{dailyInfo.weight}</td>
                    <td>{dailyInfo.temprature}</td>
                    <td>{dailyInfo.respiratoryRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="center">
              <button className="btn btn-primary" onClick={() => refetch()}>
                Refetch <FontAwesomeIcon icon={faRefresh} />
              </button>
            </div>
          </Container>
      </React.Fragment>
    );
  }
};

export default DailyInfo;
