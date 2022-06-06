import { gql, useQuery } from "@apollo/client";

const GET_USER = gql`
query User($userId:String!)
{
  user(id: $userId)
  {
	  _id,
    email,
    userType,
    userCode,
  }
}
`;

export default function GetCurrentUserInfo(authUserToken)  {

  const { data } = useQuery(GET_USER,
  {
    variables:{userId: authUserToken}
  });
  
  return {
    currentUserType : data.user.userType,
    currentUserCode : data.user.userCode
  }
}
  