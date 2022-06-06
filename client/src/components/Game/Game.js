import { Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./game.module.css";

const Game = () => {
  return (
    <Container className="mt-2">
      <div className="menu">
        <ul>
          <li>
            <NavLink to="/easy" state="default">
              Easy
            </NavLink>
          </li>
          <li>
          <NavLink to="/impossible" state="impossible">
          Impossible
        </NavLink>
          </li>
          <li>
          <NavLink  to="/2players/">
          Two Players
        </NavLink>
          </li>
        </ul>
      </div>
    </Container>
  );
};

export default Game;
