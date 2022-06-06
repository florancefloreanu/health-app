var GraphQLSchema = require("graphql").GraphQLSchema;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLList = require("graphql").GraphQLList;
var GraphQLObjectType = require("graphql").GraphQLObjectType;
var GraphQLNonNull = require("graphql").GraphQLNonNull;
var GraphQLString = require("graphql").GraphQLString;
var EmergencyAlertModel = require("../models/EmergencyAlert");
//
//Create a GraphQL Object Type for EmergencyAlert Model
const emergencyAlertType = new GraphQLObjectType({
  name: "emergencyAlert",
  fields: function () {
    return {
      _id: {
        type: GraphQLString,
      },
      patientCode: {
        type: GraphQLString,
      },
      text: {
        type: GraphQLString,
      },
      phone: {
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
      emergencyAlerts: {
        type: new GraphQLList(emergencyAlertType),
        resolve: function () {
          const emergencyAlerts = EmergencyAlertModel.find().exec();
          if (!emergencyAlerts) {
            throw new Error("Error");
          }
          return emergencyAlerts;
        },
      },
      emergencyAlert: {
        type: emergencyAlertType,
        args: {
          id: {
            name: "_id",
            type: GraphQLString,
          },
        },
        resolve: function (root, params) {
          const emergencyAlertInfo = EmergencyAlertModel.findById(
            params.id
          ).exec();
          if (!emergencyAlertInfo) {
            throw new Error("Error");
          }
          return emergencyAlertInfo;
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
      addEmergencyAlert: {
        type: emergencyAlertType,
        args: {
          patientCode: {
            type: new GraphQLNonNull(GraphQLString),
          },
          text: {
            type: new GraphQLNonNull(GraphQLString),
          },
          phone: {
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: function (root, params) {
          const emergencyAlertModel = new EmergencyAlertModel(params);
          const newEmergencyAlert = emergencyAlertModel.save();
          if (!newEmergencyAlert) {
            throw new Error("Error");
          }
          return newEmergencyAlert;
        },
      },
    };
  },
});
//
module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });
