import React from "react";
import {
  BrowserRouter as Router,
  Link,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";
import { useLogout } from "../src/config/auth";
import "bootstrap/dist/css/bootstrap.min.css";

import { useAuthUserToken } from "../src/config/auth";
import getCurrentUserInfo from "./components/GetCurrentUserInfo";
//
import AddUser from "./components/AddUser";
//
import Home from "./components/Home";
import Login from "./components/LoginForm";
//
import AddVitalSign from "./components/AddVitalSign";
import VitalSigns from "./components/VitalSigns";
import Game from "./components/Game/Game";
import TicTacToe from "./components/Game/tictactoe-v2";
import TicTacToeAI from "./components/Game/tictactoe-v3";
import Practice from "./components/Game/Physical/Practice";
import DailyInfo from "./components/DailyInfo";
import AddDailyInfo from "./components/AddDailyInfo";
//
import AddDailyTips from "./components/addDailyMotivations";
import DailyMotivations from "./components/DailyMotivations";
import AddEmergencyAlert from "./components/AddEmergencyAltert";
import EmergenyAlert from "./components/EmergencyAlert";
//
import Predict from "./components/Predict";
//

function App() {
  const logout = useLogout();
  const [authUserToken] = useAuthUserToken();
  const { currentUserCode, currentUserType } =
    getCurrentUserInfo(authUserToken);

  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href='/'>COMP308 - Assignment 5</a>

          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            {currentUserType === "Nurse" ? (
              <div>
                <ul className="nav navbar-nav">
                  <li className="nav-item active">
                    <a className="nav-link" href="/">
                      Home <span className="sr-only"></span>
                    </a>
                  </li>
                  <li>
                    <a className="nav-link" href="/vitalsigns">
                      View Vital Signs <span className="sr-only"></span>
                    </a>
                  </li>
                  <li>
                    <a className="nav-link" href="/add-vitalsign">
                      Add Vital Sign <span className="sr-only"></span>
                    </a>
                  </li>
                  <li>
                    <a className="nav-link" href="/add-daily-motivations">
                      Add Daily Motivation <span className="sr-only"></span>
                    </a>
                  </li>
                  <li>
                    <a className="nav-link" href="/emergency-alert">
                      View Emergency Alerts <span className="sr-only"></span>
                    </a>
                  </li>
                  <li>
                    <a type="button" className="nav-link" href="/predict">
                      Predict disease based on symptoms
                      <span className="sr-only"></span>
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              <div>
                <ul className="nav navbar-nav">
                  <li>
                    <a className="nav-link" href="/daily-motivations">
                      View Daily Motivation <span className="sr-only"></span>
                    </a>
                  </li>
                  <li>
                    <a className="nav-link" href="/add-emergency-alert">
                      Add Emergency Alerts <span className="sr-only"></span>
                    </a>
                  </li>
                  <li className="nav-item active">
                    <NavLink className="nav-link" to="/game">
                      Game
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/practice">
                      Physical Practice
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/dailyinfo">
                      Daily Information Practice
                    </NavLink>
                  </li>
                </ul>
              </div>
            )}
            <div id="id" className="nav-right">
              <button
                className="btn btn-secondary"
                onClick={logout}
                style={{ margin: "10px 20px 10px 10em ", width: "100px" }}
              >
                Logout
              </button>
              <a>{currentUserCode}</a>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Login />} />
          <Route path="/logout" element={<Login />} />
          <Route path="/adduser" element={<AddUser />} />
          <Route path="/add-vitalsign" element={<AddVitalSign />} />
          <Route path="/vitalsigns" element={<VitalSigns />} />
          <Route path="/add-daily-motivations" element={<AddDailyTips />} />
          <Route path="/daily-motivations" element={<DailyMotivations />} />
          <Route path="/add-emergency-alert" element={<AddEmergencyAlert />} />
          <Route path="/emergency-alert" element={<EmergenyAlert />} />

          <Route path="/game" element={<Game />} />
          <Route path="/impossible/" exact element={<TicTacToeAI />} />
          <Route path="/2players/" exact element={<TicTacToe />} />
          <Route path="/easy" element={<TicTacToeAI />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/dailyinfo" element={<DailyInfo />} />
          <Route path="/adddailyinfo" element={<AddDailyInfo />} />
          <Route path="/predict" element={<Predict />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
