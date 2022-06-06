const tf = require("@tensorflow/tfjs");
const fs = require("fs").promises;
const path = require("path");
const { encodeSymptom } = require("./parse-data");

const MODEL_PATH = path.join(__dirname, "model");

console.log("Loading Tensorflow...", require("@tensorflow/tfjs-node").version);

let diseases;
const getDiseases = exports.getDiseases = async () => {
    if (!diseases)
        diseases = JSON.parse(await fs.readFile(path.join(MODEL_PATH, "diseases.json"), { encoding: "utf-8" }));

    return diseases;
};

let symptoms;
const getSymptoms = exports.getSymptoms = async () => {
    if (!symptoms)
        symptoms = JSON.parse(await fs.readFile(path.join(MODEL_PATH, "symptoms.json"), { encoding: "utf-8" }));

    return symptoms;
};

/** @type {tf.Sequential} */
let model;

/**
 * @param {string[]} symptoms
 */
const predict = exports.predict = async (symptoms) => {
    if (!model) {
        const modelPath = `file://${path.join(MODEL_PATH, "model.json")}`;
        console.log(`Loading model: ${modelPath}`);
        model = await tf.loadLayersModel(modelPath);
    }

    const predictionTensor = tf.tensor2d([encodeSymptom(symptoms, await getSymptoms())]);
    const [prediction] = await model.predict(predictionTensor).array();

    return await decodeDisease(prediction);
};

const sortIndices = array =>
    [...array.keys()].sort((a, b) => array[a] < array[b] ? -1 : Number(array[a] > array[b]));

const decodeDisease = exports.decodeDisease = async (disease) => {
    const diseases = await getDiseases();
    const sorted = sortIndices(disease);

    return sorted.map(idx => ({
        disease: diseases[idx],
        chance: disease[idx],
        needsDoctor: NEEDS_DOCTOR.includes(diseases[idx]),
    })).reverse();
};

const NEEDS_DOCTOR = [
    "aids", "alcoholic hepatitis", "cervical spondylosis", "chronic cholestasis", "dengue", "diabetes",
    "dimorphic hemmorhoids", "drug reaction", "fungal infection", "heart attack", "hepatitis a",
    "hepatitis b", "hepatitis c", "hepatitis d", "hepatitis e", "hypertension", "hyperthyroidism",
    "hypoglycemia", "hypothyroidism", "impetigo", "jaundice", "malaria", "paralysis",
    "paroymsal positional vertigo", "peptic ulcer diseae", "pneumonia", "psoriasis", "tuberculosis",
    "typhoid", "urinary tract infection", "varicose veins",
];
