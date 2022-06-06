const tf = require("@tensorflow/tfjs");

/** @typedef {import("./parse-data").Data} Data */

/** @param {Data} data */
const getDataTensors = data => {
    return [tf.tensor2d(data.data[0]), tf.tensor2d(data.data[1])];
};

/** @param {Data} data */
const createModel = data => {
    const model = tf.sequential();

    // Input layer
    model.add(tf.layers.dense({
        inputShape: [data.data[1][0].length],
        activation: "sigmoid",
        units: data.data[1][0].length + 1,
    }));

    // Hidden layer
    model.add(tf.layers.dense({
        activation: "sigmoid",
        units: data.data[0][0].length,
    }));

    // Output layer
    model.add(tf.layers.dense({
        activation: "sigmoid",
        units: data.data[0][0].length,
    }));

    // Compile
    model.compile({
        loss: "meanSquaredError",
        optimizer: tf.train.adam(.008),
    });

    return model;
};

/**
 * @param {Data} data
 * @param {tf.Sequential} model
 */
const trainModel = async (data, model) => {
    const [labels, features] = getDataTensors(data);

    let loss = Infinity;
    await model.fit(features, labels, {
        epochs: 100,
        callbacks: {
            onEpochEnd(epoch, log) {
                loss = log.loss;
            },
        },
    });

    return { loss, model };
};

/** @param {Data} data */
const createAndTrainModel = exports.createAndTrainModel = async data =>
    await trainModel(data, createModel(data));
