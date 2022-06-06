import React from "react";
import { gql, useMutation } from "@apollo/client";
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import Form from "react-bootstrap/Form";

const ADD_USER = gql`
  mutation addUser(
    $userType: String!
    $birthdate: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $address: String!
    $city: String!
    $phone: String!
    $email: String!
    $userCode: String!
  ) {
    addUser(
      password: $password
      firstName: $firstName
      lastName: $lastName
      birthdate: $birthdate
      address: $address
      city: $city
      phone: $phone
      email: $email
      userType: $userType
      userCode: $userCode
    ) {
      _id
    }
  }
`;

function userCodeMaker(userType, userFName) {
  return (
    "G10" +
    String(userType).charAt(0) +
    String(userFName).charAt(0) +
    (Math.floor(Math.random() * (9999 - 1000)) + 1000).toString()
  );
}

const AddUser = () => {
  let userType,
    password,
    birthdate,
    firstName,
    lastName,
    address,
    city,
    phone,
    email,
    userCode;
  const [addUser, { loading, error }] = useMutation(ADD_USER);

  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;

  return (
    <Container>
      <Form className="col-5 mt-2"
        onSubmit={(e) => {
          e.preventDefault();
          addUser({
            variables: {
              userType: userType.value,
              password: password.value,
              birthdate: birthdate.value,
              firstName: firstName.value,
              lastName: lastName.value,
              address: address.value,
              city: city.value,
              phone: phone.value,
              email: email.value,
              userCode: userCodeMaker(userType.value, firstName.value),
            },
          });
          userType.value = "";
          password.value = "";
          birthdate.value = "";
          firstName.value = "";
          lastName.value = "";
          address.value = "";
          city.value = "";
          phone.value = "";
          email.value = "";
          userCode.value = "";
          window.location.href = "/";
        }}
      >
          <Form.Group>
            <Form.Label>
              <b>User Role:</b>
            </Form.Label>
            <select
              className="form-control"
              ref={(node) => {
                userType = node;
              }}
            >
              <option value="Patient" selected>
                Patient
              </option>
              <option value="Nurse">Nurse</option>
            </select>
          </Form.Group>
          <Form.Group >
            <Form.Label>
              <b>BirthDate:</b>
            </Form.Label>
            <Form.Control
              type="date"
              name="birthdate"
              ref={(node) => {
                birthdate = node;
              }}
            />
          </Form.Group>
          <Form.Group >
            <Form.Label>
              <b>Password:</b>
            </Form.Label>
            <Form.Control
              type="text"
              name="password"
              ref={(node) => {
                password = node;
              }}
              placeholder="Password:"
              required
            />
          </Form.Group>
          <Form.Group >
            <Form.Label>
              <b>First Name:</b>
            </Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              ref={(node) => {
                firstName = node;
              }}
              placeholder="First Name:"
              required
            />
          </Form.Group>
          <Form.Group >
            <Form.Label>
              <b>Last Name:</b>
            </Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              ref={(node) => {
                lastName = node;
              }}
              placeholder="Last Name:"
              required
            />
          </Form.Group>
          <Form.Group >
            <Form.Label>
              <b>Address:</b>
            </Form.Label>
            <Form.Control
              type="text"
              name="address"
              ref={(node) => {
                address = node;
              }}
              placeholder="Address:"
            />
          </Form.Group>
          <Form.Group >
            <Form.Label>
              <b>City:</b>
            </Form.Label>
            <Form.Control
              type="text"
              name="city"
              ref={(node) => {
                city = node;
              }}
              placeholder="City:"
            />
          </Form.Group>
          <Form.Group >
            <Form.Label>
              <b>Phone:</b>
            </Form.Label>
            <Form.Control
              type="text"
              name="phone"
              ref={(node) => {
                phone = node;
              }}
              placeholder="Phone:"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <b>Email:</b>
            </Form.Label>
            <Form.Control
              type="text"
              name="email"
              ref={(node) => {
                email = node;
              }}
              placeholder="Email:"
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Control
              type="hidden"
              name="userCode"
              ref={(node) => {
                userCode = node;
              }}
            />
          </Form.Group>

          <Form.Group>
            <button type="submit" className="btn btn-primary">
              Add User <FontAwesomeIcon icon={faAdd} />
            </button>
          </Form.Group>
      </Form>
    </Container>
  );
};

export default AddUser;
