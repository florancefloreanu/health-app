var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLFloat = require('graphql').GraphQLFloat;
var DailyInfoModel = require('../models/DailyInfo');

const dailyInfoType = new GraphQLObjectType({
    name: 'dailyInfo',
    fields: function(){
        return{
            _id: {
                type: GraphQLString
            },
            pulseRate: {
                type: GraphQLFloat
            },
            bloodPressure: {
                type: GraphQLFloat
            },
            weight: {
                type: GraphQLFloat
            },
            temprature: {
                type: GraphQLFloat
            },
            respiratoryRate: {
                type: GraphQLFloat
            },
            date: {
                type: GraphQLString
            }
        }
    }
});

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function() {
        return{
            dailyInfos: {
                type: new GraphQLList(dailyInfoType),
                resolve: function (){
                    const dailyInfos = DailyInfoModel.find().exec()
                    if(!dailyInfos) {
                        throw new Error('Error')
                    }
                    return dailyInfos
                }
            },
            dailyInfo: {
                type: dailyInfoType,
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const dailyInfo = DailyInfoModel.findById(params.id).exec()
                    if(!dailyInfo){
                        throw new Error('Error')
                    }
                    return dailyInfo
                }
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
        return {
            addDailyInfo: {
                type: dailyInfoType,
                args:{
                    pulseRate: {
                        type: new GraphQLNonNull(GraphQLFloat)
                    },
                    bloodPressure: {
                        type : new GraphQLNonNull(GraphQLFloat)
                    },
                    weight: {
                        type : new GraphQLNonNull(GraphQLFloat)
                    },
                    temprature: {
                        type : new GraphQLNonNull(GraphQLFloat)
                    },
                    respiratoryRate: {
                        type : new GraphQLNonNull(GraphQLFloat)
                    },
                    date: {
                        type : new GraphQLNonNull(GraphQLString)
                    }
                    
                },
                resolve: function (root, params) {
                    const dailyInfoModel = new DailyInfoModel(params);
                    const dailyInfo = dailyInfoModel.save();
                    if(!dailyInfo){
                        throw new Error('Error');
                    }
                    return dailyInfo
                }
            },
        }
    }
});
//
module.exports = new GraphQLSchema({query: queryType, mutation: mutation});