import React from "react";
import { gql, useMutation } from '@apollo/client';
import { useAuthToken, useAuthUserToken } from "../config/auth";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";

const loginMutationGQL = gql`
mutation authenticationUser(
  $password: String!,
  $email: String!
){
  loginUser(
    email:$email,
    password:$password
  ){
    token,
    userId
  }
}
`;

const LoginForm = () => {
  let userEmail,password ;
  const [_, setAuthToken, removeAuthtoken] = useAuthToken();
  const [__, setAuthUserToken, removeAuthUsertoken] = useAuthUserToken();
 
  const [loginMutation, loginMutationResults] = useMutation(loginMutationGQL, {
    
    onCompleted: (data) => {
      console.log(data);
      setAuthToken(data.loginUser.token);
      setAuthUserToken(data.loginUser.userId);
      
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation({ variables: { 
    email: userEmail.value, 
    password: password.value 
      } }).then(() =>{
        window.location.href = "/"
      });

      userEmail.value = '';
      password.value='';
  }

  return (
    <div className="Login">
    <Form onSubmit={handleSubmit}>
      <Form.Group size="lg" controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          autoFocus
          type="email"
          name='userEmail'
          ref={node => {userEmail = node; }}
        />
      </Form.Group>
      <Form.Group size="lg" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password" 
          ref={node => {password = node; }}
        />
      </Form.Group>
      <Button block size="md" className="mt-2" type="submit">
        Login
      </Button>
      <Form.Group>
        <span>Don't have account? </span>
        <a href="/adduser">Sign Up</a>
      </Form.Group>
    </Form>
  </div>
  );
};

export default LoginForm;