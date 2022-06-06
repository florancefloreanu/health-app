const fs = require("fs").promises;
const path = require("path");
const { parseCsv } = require("./parse-data");
const { createAndTrainModel } = require("./train-model");

const readFile = async path => {
    try {
        return await fs.readFile(path, { encoding: "utf-8" });
    } catch (err) {
        throw new Error(`could not read dataset at path ${path}\n${err.stack}`);
    }
};

const createModel = exports.createModel = async () => {
    // Ensure tfjs-node is registered to speed up training the model
    console.log(require("@tensorflow/tfjs-node").version);

    const rawData = await readFile(path.join(__dirname, "dataset.csv"));
    const data = parseCsv(rawData);
    //console.log(require("util").inspect(data, { depth: Infinity }))
    return {
        ...data,
        ...await createAndTrainModel(data),
    };
};

const saveModel = exports.saveModel = async (model) => {
    const savePath = path.join(__dirname, "model");
    await model.save(`file://${savePath}`);

    return savePath;
};

if (require.main === module) {
    // File was directly called
    void (async () => {
        const { loss, model, diseases, symptoms } = await createModel();
        console.log(`\n\nFinal loss: ${loss}`);

        const modelPath = await saveModel(model);
        console.log(`Model saved to: ${modelPath}`);

        await fs.writeFile(path.join(modelPath, "symptoms.json"), JSON.stringify(symptoms));
        await fs.writeFile(path.join(modelPath, "diseases.json"), JSON.stringify(diseases));
        console.log(`Saved symptoms and diseases data to: ${modelPath}`);
    })();
}
