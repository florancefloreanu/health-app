import React, { useState } from 'react';
import { gql, useMutation, useQuery} from '@apollo/client';
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import Form from "react-bootstrap/Form";
import { useAuthUserToken } from "../config/auth";
import getCurrentUserInfo from "./GetCurrentUserInfo";

const ADD_VITALSIGN = gql`
    mutation AddVitalSign(
        $patientCode: String!,
        $bodyTemperature: Float!,
        $heartRate: Float!,
        $bloodPressure: Float!,
        $respiratoryRate: Float!
        $nurseCode: String!
        ) {
        addVitalSign(
            patientCode: $patientCode,
            bodyTemperature: $bodyTemperature,
            heartRate: $heartRate,
            bloodPressure: $bloodPressure,
            respiratoryRate: $respiratoryRate
            nurseCode: $nurseCode
            ) {
            _id
        }
    }
`;

const FIND_USER = gql`
query FindUserByCode($userCode: String!){
    userByCode(userCode: $userCode){
          _id,
          userType
    }
  }  
`

const AddVitalSign = () => {
    let patientCode, bodyTemperature, heartRate, bloodPressure, respiratoryRate, nurseCode;
    const [addVitalSign, { loading, error }] = useMutation(ADD_VITALSIGN);
    const [inputPatientCode, setInputPatientCode] = useState({});
    const [authUserToken] = useAuthUserToken();
    const {currentUserType, currentUserCode} = getCurrentUserInfo(authUserToken);

    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;
    if(currentUserType !== 'Nurse'){
        return(
            <Container>
               <h2>
                   Access denied
               </h2>
               <h5>
                    Sorry, but you don't have permission to access this page
               </h5>
               <a type='button' className="btn btn-primary" href="/">Go to Home</a>
            </Container>
        )
    }
    else{
        return (
            <Container>
                <Form className='col-5 mt-1'
                    onSubmit={e => {    
                        e.preventDefault();
                        setInputPatientCode(patientCode.value);
                        
                            addVitalSign({ variables: 
                                { 
                                    patientCode: patientCode.value, 
                                    bodyTemperature: parseFloat(bodyTemperature.value), 
                                    heartRate: parseFloat(heartRate.value), 
                                    bloodPressure: parseFloat(bloodPressure.value), 
                                    respiratoryRate: parseFloat(respiratoryRate.value),
                                    nurseCode: currentUserCode
                            } });

                            patientCode.value = '';
                            bodyTemperature.value = '';
                            heartRate.value = '';
                            bloodPressure.value = '';
                            respiratoryRate.value='';
                            nurseCode.value='';
                          }
                        }
                >

                    <Form.Group>
                        <Form.Label>
                            <b>Patient Code:</b>
                        </Form.Label>
                        <Form.Control type="float" name="patientCode" ref={node => {patientCode = node; }} 
                        placeholder="9 digits (e.g. G10PA0001)" required/>
                    </Form.Group>                    
                    <Form.Group>
                        <Form.Label>
                            <b>Body Temperature (°C):</b>
                        </Form.Label>
                        <Form.Control type="float" name="bodyTemperature" ref={node => {bodyTemperature = node; }} 
                        placeholder="Body Temperature" required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            <b>Heart Rate (bpm):</b>
                        </Form.Label>
                        <Form.Control type="float" name="heartRate" ref={node => {heartRate = node; }} 
                        placeholder="Heart Rate" required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            <b>Blood Pressure :</b>
                        </Form.Label>
                        <Form.Control type="float" name="bloodPressure" ref={node => {bloodPressure = node; }} 
                        placeholder="Blood Pressure" required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            <b>Respiratory Rate (breadths/minute):</b>
                        </Form.Label>
                        <Form.Control type="float" name="respiratoryRate" ref={node => {respiratoryRate = node; }}
                        placeholder="Respiratory Rate" required/>
                    </Form.Group>
                    <Form.Group className='mt-2'>
                        <button type="submit" className="btn btn-primary" >Add Vital Sign <FontAwesomeIcon icon={faAdd} /></button>
                    </Form.Group>
                </Form>
            </Container>
        );
    }
}

export default AddVitalSign