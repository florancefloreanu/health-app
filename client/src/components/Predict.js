import React, { useMemo, useState } from "react";
import { gql, useQuery } from "@apollo/client";

import "./Predict.css";

const GET_PREDICTION = gql`
    query getPrediction($symptoms: [String!]!) {
        predict(symptoms: $symptoms) {
            disease
            chance
            needsDoctor
        }
    }
`;

const GET_SYMPTOMS = gql`
    query getSymptoms {
        symptoms
    }
`;

const Predict = () => {
    const { data: symptomsList } = useQuery(GET_SYMPTOMS);
    const [symptoms, setSymptoms] = useState([]);
    const { data: prediction, loading } = useQuery(GET_PREDICTION, { variables: { symptoms } });

    const symptomChanged = symptom => e => {
        if (e.target.checked) {
            if (!symptoms.includes(symptom)) // prevent duplicates
                setSymptoms([...symptoms, symptom]);
            return;
        }

        const newSymptoms = [...symptoms];
        newSymptoms.splice(newSymptoms.indexOf(symptom), 1);
        setSymptoms(newSymptoms);
    };

    const hasPrediction = prediction?.predict && prediction.predict.length > 0;
    const hasGoodPrediction = hasPrediction && prediction.predict[0].chance >= .2;

    const orderedSymptomsList = useMemo(() => {
        const listLength = symptomsList?.symptoms.length ?? 0;

        let selectedIdx = 0;
        const list = [];
        for (let i = 0; i < listLength; i++) {
            if (symptoms.includes(symptomsList.symptoms[i]))
                list.splice(selectedIdx++, 0, symptomsList.symptoms[i]);
            else
                list.push(symptomsList.symptoms[i]);
        }
        return list;
    }, [symptomsList, symptoms]);

    return (
        <div className="predict-container">
            <h1>Disease prediction</h1>
            <p>This tool lets you predict what possible disease one might have given a list of symptoms.</p>
            <p>
                Please note that the prediction is purely informative and should not be seen as a diagnosis.
                This tool is not meant to replace a doctor or specialist, and if you have any worrisome symptoms, you
                should visit a doctor at your earliest convenience.
            </p>

            {hasPrediction && (
                <div className={`prediction-result ${loading ? "loading" : ""} alert ${hasGoodPrediction ? "alert-success" : "alert-warning"}`}>
                    {hasGoodPrediction ? (
                        <>
                            <p>The system predicted that the following diseases might match:</p>
                            <ul>
                                {prediction.predict.slice(0, 3).map(p => (
                                    <li key={p.disease} className={p.needsDoctor ? "prediction-bold" : ""}>
                                        {p.disease} ({Math.round(p.chance * 1000) / 10}%)
                                    </li>
                                ))}
                            </ul>
                            {prediction.predict.slice(0, 3).some(p => p.needsDoctor) && (
                                <p>
                                    Any <b>bolded</b> predictions require at least semi-urgent intervention by a doctor.
                                </p>
                            )}
                        </>
                    ) : (
                        <p>
                            Either no disease was found given the chosen symptoms, or you should
                            select more symptoms to make a good prediction.
                        </p>
                    )}
                </div>
            )}

            <div className="symptoms-container">
                <p>Please select all symptoms that apply to you in the list below.</p>
                <ul className="symptoms-list">
                    {orderedSymptomsList.map(s => (
                        <li key={s}>
                            <label>
                                <input type="checkbox"
                                    checked={symptoms.includes(s)}
                                    onChange={symptomChanged(s)} />
                                &nbsp;
                                {s}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Predict;
