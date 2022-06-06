import React from 'react';
import { gql, useMutation} from '@apollo/client';
import {useNavigate} from 'react-router-dom'
import { useAuthUserToken } from "../config/auth";
import getCurrentUserInfo from "./GetCurrentUserInfo";

const ADD_DAILYINFO = gql`
    mutation AddDailyInfo(
        $pulseRate: Float!,
        $bloodPressure: Float!,
        $weight: Float!,
        $temprature: Float!,
        $respiratoryRate: Float!,
        $date : String!,
        ) {
        addDailyInfo(
            pulseRate: $pulseRate,
            bloodPressure: $bloodPressure,
            weight: $weight,
            temprature: $temprature,
            respiratoryRate: $respiratoryRate,
            date: $date
            ) {
            _id
        }
    }
`;

const AddVitalSign = () => {
    let pulseRate, bloodPressure, weight, temprature, respiratoryRate,date;
    const [addDailyInfo, { loading, error }] = useMutation(ADD_DAILYINFO);
    const [authUserToken] = useAuthUserToken();
    const {currentUserType, currentUserCode} = getCurrentUserInfo(authUserToken);
    const navigate = useNavigate()

    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;
    if(currentUserType === 'Nurse'){
        return(
            <div className='container'>
               <h2>
                   Access denied
               </h2>
               <h5>
                    Sorry, but you don't have permission to access this page
               </h5>
               <a type='button' className="btn btn-primary" href="/">Go to Home</a>
            </div>
        )
    }
    else{
        return (
            <div>
                <form
                    onSubmit={e => {    
                        e.preventDefault();
                        addDailyInfo({ variables: 
                                { 
                                    pulseRate: parseFloat(pulseRate.value), 
                                    bloodPressure: parseFloat(bloodPressure.value), 
                                    weight: parseFloat(weight.value), 
                                    temprature: parseFloat(temprature.value),
                                    respiratoryRate: parseFloat(respiratoryRate.value),
                                    date: date.value
                            } });

                            pulseRate.value = '';
                            bloodPressure.value = '';
                            weight.value = '';
                            temprature.value='';
                            respiratoryRate.value='';
                            date.value = ''
                            navigate('/dailyinfo')
                          }
                        }
                >
                     <div style={{marginTop: '10px'}}>
                        <label>
                            <b>Date:</b>
                        </label>
                        <input type="date" className="fields" name="date" ref={node => {date = node; }} 
                        placeholder="Date" required/>
                    </div>
                    <div style={{marginTop: '10px'}}>
                        <label>
                            <b>Pluse Rate:</b>
                        </label>
                        <input type="float" className="fields" name="pulseRate" ref={node => {pulseRate = node; }} 
                        placeholder="Pluse Rate" required/>
                    </div>
                    <div style={{marginTop: '10px'}}>
                        <label>
                            <b>Blood Pressure:</b>
                        </label>
                        <input type="float" className="fields" name="bloodPressure" ref={node => {bloodPressure = node; }} 
                        placeholder="Blood Pressure" required/>
                    </div>
                    <div style={{marginTop: '10px'}}>
                        <label>
                            <b>Weight:</b>
                        </label>
                        <input type="float" className="fields" name="weight" ref={node => {weight = node; }} 
                        placeholder="Weight" required/>
                    </div>
                    <div style={{marginTop: '10px'}}>
                        <label>
                            <b>Temprature:</b>
                        </label>
                        <input type="float" className="fields" name="temprature" ref={node => {temprature = node; }}
                        placeholder="Temprature" required/>
                    </div>
                    <div style={{marginTop: '10px'}}>
                        <label>
                            <b>Respiratory Rate:</b>
                        </label>
                        <input type="float" className="fields" name="respiratoryRate" ref={node => {respiratoryRate = node; }}
                        placeholder="Respiratory Rate" required/>
                    </div>
                    <div style={{padding: '290px'}}>
                        <button type="submit" className="fields" >Save</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default AddVitalSign