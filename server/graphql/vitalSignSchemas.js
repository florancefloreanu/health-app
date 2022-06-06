var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLFloat = require('graphql').GraphQLFloat;
var VitalSignModel = require('../models/VitalSign');
//
//Create a GraphQL Object Type for VitalSign Model
const vitalSignType = new GraphQLObjectType({
    name: 'vitalSign',
    fields: function(){
        return{
            _id: {
                type: GraphQLString
            },
            bodyTemperature: {
                type: GraphQLFloat
            },
            heartRate: {
                type: GraphQLFloat
            },
            bloodPressure: {
                type: GraphQLFloat
            },
            respiratoryRate: {
                type: GraphQLFloat
            },
            patientCode: {
                type: GraphQLString
            },
            nurseCode: {
                type: GraphQLString
            },
        }
    }
});
// 
// Create a GraphQl Query type that returns all data of the vital signs or data by id
const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function() {
        return{
            vitalSigns: {
                type: new GraphQLList(vitalSignType),
                resolve: function (){
                    const vitalSigns = VitalSignModel.find().exec()
                    if(!vitalSigns) {
                        throw new Error('Error')
                    }
                    return vitalSigns
                }
            },
            vitalSign: {
                type: vitalSignType,
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const vitalSignInfo = VitalSignModel.findById(params.id).exec()
                    if(!vitalSignInfo){
                        throw new Error('Error')
                    }
                    return vitalSignInfo
                }
            }
        }
    }
});

//
// add mutations for CRUD operations

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
        return {
            addVitalSign: {
                type: vitalSignType,
                args:{
                    bodyTemperature: {
                        type: new GraphQLNonNull(GraphQLFloat)
                    },
                    heartRate: {
                        type : new GraphQLNonNull(GraphQLFloat)
                    },
                    bloodPressure: {
                        type : new GraphQLNonNull(GraphQLFloat)
                    },
                    respiratoryRate: {
                        type : new GraphQLNonNull(GraphQLFloat)
                    },
                    patientCode: {
                        type : new GraphQLNonNull(GraphQLString)
                    },
                    nurseCode: {
                        type : new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: function (root, params) {
                    const vitalSignModel = new VitalSignModel(params);
                    const newVitalSign = vitalSignModel.save();
                    if(!newVitalSign){
                        throw new Error('Error');
                    }
                    return newVitalSign
                }
            },
        }
    }
});
//
module.exports = new GraphQLSchema({query: queryType, mutation: mutation});