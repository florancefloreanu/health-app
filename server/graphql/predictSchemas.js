const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLFloat,
    GraphQLBoolean,
} = require("graphql");
const { getSymptoms, predict } = require("../ai/predict");

const predictionEntryType = new GraphQLObjectType({
    name: "predictionEntry",
    fields: () => ({
        disease: {
            type: GraphQLNonNull(GraphQLString)
        },
        chance: {
            type: GraphQLNonNull(GraphQLFloat),
        },
        needsDoctor: {
            type: GraphQLNonNull(GraphQLBoolean),
        },
    }),
});

const queryType = new GraphQLObjectType({
    name: "Query",
    fields: () => ({
        predict: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(predictionEntryType))),
            args: {
                symptoms: {
                    name: "symptoms",
                    type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString))),
                },
            },
            resolve: async (_, args) => await predict(args.symptoms),
        },
        symptoms: {
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString))),
            resolve: async () => await getSymptoms()
        },
    }),
});

module.exports = new GraphQLSchema({
    query: queryType,
});
