var GraphQLSchema = require("graphql").GraphQLSchema;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLList = require("graphql").GraphQLList;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLNonNull = require("graphql").GraphQLNonNull;
var GraphQLString = require("graphql").GraphQLString;
var VitalSignModel = require("../models/VitalSign");
var DailyTipModel = require("../models/DailyTip");
//
//Create a GraphQL Object Type for DailyTip Model
const dailyTipType = new GraphQLObjectType({
  name: "dailyTip",
  fields: function () {
    return {
      _id: {
        type: GraphQLString,
      },
      nurseCode: {
        type: GraphQLString,
      },
      patientCode: {
        type: GraphQLString,
      },
      text: {
        type: GraphQLString,
      },
      date: {
        type: GraphQLString,
      },
    };
  },
});
//
// Create a GraphQl Query type that returns all data of the vital signs or data by id
const queryType = new GraphQLObjectType({
  name: "Query",
  fields: function () {
    return {
      dailyTips: {
        type: new GraphQLList(dailyTipType),
        resolve: function () {
          const dailyTips = DailyTipModel.find().exec();
          if (!dailyTips) {
            throw new Error("Error");
          }
          return dailyTips;
        },
      },
      dailyTip: {
        type: dailyTipType,
        args: {
          id: {
            name: "_id",
            type: GraphQLString,
          },
        },
        resolve: function (root, params) {
          const dailyTipInfo = DailyTipModel.findById(params.id).exec();
          if (!dailyTipInfo) {
            throw new Error("Error");
          }
          return dailyTipInfo;
        },
      },
    };
  },
});

//
// add mutations for CRUD operations

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: function () {
    return {
      addDailyTip: {
        type: dailyTipType,
        args: {
          nurseCode: {
            type: new GraphQLNonNull(GraphQLString),
          },
          patientCode: {
            type: new GraphQLNonNull(GraphQLString),
          },
          text: {
            type: new GraphQLNonNull(GraphQLString),
          },
          date: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: function (root, params) {
          const dailyTipModel = new DailyTipModel(params);
          const newDailyTip = dailyTipModel.save();
          if (!newDailyTip) {
            throw new Error("Error");
          }
          return newDailyTip;
        },
      },
    };
  },
});
//
module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });
