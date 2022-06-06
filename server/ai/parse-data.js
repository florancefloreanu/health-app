/**
 * @typedef {{ diseases: string[]; symptoms: string[]; data: [number[][], number[][]] }} Data
 */

const trimHeader = content =>
    content.slice(content.indexOf("\n") + 1);
const splitRows = content =>
    content.split("\n");
const splitColumns = content =>
    content.map(row => row.split(","));
const trimColumns = content =>
    content.map(row => row.map(col => col.trim()));
const cleanName = name =>
    name.replace(/\(.*?\)/g, "").replace(/_/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
const cleanColumnNames = content =>
    content.map(row => row.map(col => cleanName(col)));
const filterColumns = content =>
    content.map(row => row.filter(Boolean));
const transformData = content =>
    content.map(row => ({ disease: row[0], symptoms: row.slice(1) }));
const filterEmptyData = content =>
    content.filter(row => row.disease && row.symptoms.length);
const getAllSymptoms = content => {
    const symptoms = new Set();
    content.forEach(row => row.symptoms.map(symptom => symptoms.add(symptom)));
    return [...symptoms].sort();
};
const getAllDiseases = content => {
    const diseases = new Set();
    content.forEach(row => diseases.add(row.disease));
    return [...diseases].sort();
};
const encodeDisease = exports.encodeDisease = (disease, diseases) => {
    const result = Array(diseases.length).fill(0);
    result[diseases.indexOf(disease)] = 1;
    return result;
};
const encodeDiseases = (content, diseases) =>
    content.map(row => encodeDisease(row.disease, diseases));
const encodeSymptom = exports.encodeSymptom = (symptom, symptoms) => {
    const result = Array(symptoms.length).fill(0);
    symptom.forEach(s => result[symptoms.indexOf(s)] = 1);
    return result;
};
const encodeSymptoms = (content, symptoms) =>
    content.map(row => encodeSymptom(row.symptoms, symptoms));
const encode = (content, diseases, symptoms) =>
    [encodeDiseases(content, diseases), encodeSymptoms(content, symptoms)];

/**
 * @param {string} data
 * @returns {Data}
 */
const parseCsv = exports.parseCsv = data => {
    data = trimHeader(data);
    data = splitRows(data);
    data = splitColumns(data);
    data = trimColumns(data);
    data = cleanColumnNames(data);
    data = filterColumns(data);
    data = transformData(data);
    data = filterEmptyData(data);

    const diseases = getAllDiseases(data);
    const symptoms = getAllSymptoms(data);
    data = encode(data, diseases, symptoms);

    return { diseases, symptoms, data };
};
