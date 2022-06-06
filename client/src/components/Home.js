import React from "react";
import { useAuthUserToken } from "../config/auth";
import getCurrentUserInfo from "./GetCurrentUserInfo";

function Home(props) {
  const [authUserToken] = useAuthUserToken();
  const { currentUserType } = getCurrentUserInfo(authUserToken);

  return (
    <div>
      <h1>COMP308 - Group 10 - assignment 5</h1>
      <h4>Hello, {currentUserType} </h4>

      {currentUserType === "Nurse" ? (
        <div>
          <p />
          <a type="button" className="btn btn-info" href="/add-vitalsign">
            Add Vital Sign
          </a>
          <p />
          <a type="button" className="btn btn-secondary" href="/vitalsigns">
            View Vital Signs
          </a>
          <p />
          <a
            type="button"
            className="btn btn-secondary"
            href="/add-daily-motivations"
          >
            Add Daily Tips
          </a>
          <p />
          <a type="button" className="btn btn-danger" href="/emergency-alert">
            View Emerency alert
          </a>
        </div>
      ) : (
        <div>
          <p />
          <a type="button" className="btn btn-secondary" href="/predict">
            Predict disease based on symptoms
          </a>
          <p />
          <a
            type="button"
            className="btn btn-secondary"
            href="/daily-motivations"
          >
            View Daily Tips
          </a>
          <p />
          <a
            type="button"
            className="btn btn-danger"
            href="/add-emergency-alert"
          >
            Add Emergency Alert
          </a>
        </div>
      )}
    </div>
  );
}

export default Home;
