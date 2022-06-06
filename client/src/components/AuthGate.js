import React from "react";
import App from "../App";
import LoginForm from "../components/LoginForm";
import { useAuthToken, useAuthUserToken } from "../config/auth";
import {gql, useQuery} from "@apollo/client";
import AddUser from './AddUser';

const userQueryGQL = gql`
query user($userId:String!)
{
  user(id: $userId)
  {
		_id,
    email,
    userType,
    userCode
  }
}
`;


const AuthGate = () => {
  
  const [authToken] = useAuthToken()
  const [authUserToken] = useAuthUserToken()

  const {loading, data} = useQuery(userQueryGQL,
  {
  variables:{userId:authUserToken},
  onCompleted:()=>{console.log("--- Currently Logged in User ---",
                               "\n_id        : ", data.user._id,
                               "\n Email     : ", data.user.email,
                               "\n User Type : ", data.user.userType,
                               "\n User Code : ", data.user.userCode); 
}})

  if (data) {
    console.log("Current user Role: " + data.user.userType);
  }
  
  if (data && authToken) {
      return <App/>;
  }
  
  if(!data){
    if(window.location.pathname === '/adduser')
    {
      return <AddUser loading = {loading} />
    }
     
  }
  return <LoginForm loading={loading} />;
  
}

export default AuthGate;