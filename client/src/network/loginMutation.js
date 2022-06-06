import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useAuthToken, useAuthUserToken } from "../config/auth";

export const loginMutationGQL = gql`
  mutation Login($email: String!, $password: String!){
    login(email: $email, password: $password){
      token
      userId
    }
  }
`;

export const useLoginMutation = () => {
  const [setAuthToken, removeAuthtoken] = useAuthToken();
  const [setAuthUserToken, removeAuthUsertoken] = useAuthUserToken();

  const [mutation, mutationResults] = useMutation(loginMutationGQL, {
    onCompleted: (data) => {
      setAuthToken(data.login.token);
      setAuthUserToken(data.login.userId);
    },
  });

  // full login function
  const login = (email, password) => {
    removeAuthtoken(); 
    removeAuthUsertoken();
    
    return mutation({
      variables: {
        email: email,
        password,
      }
    });
  }
  return [login, mutationResults]
};
