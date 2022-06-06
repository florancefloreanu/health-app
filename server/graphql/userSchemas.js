var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var UserModel = require('../models/User');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const config = require('../config/config');
const jwtExpirySeconds = 300;
const key =config.secretKey;


//
// Create a GraphQL Object Type for User model

const userType = new GraphQLObjectType({
    name: 'user',
    fields: function () {
      return {
        _id: {
          type: GraphQLString
        },
        password: {
          type: GraphQLString
        },
        firstName: {
          type: GraphQLString
        },
        lastName: {
          type: GraphQLString
        },
        birthdate: {
          type: GraphQLString
        },
        address: {
          type: GraphQLString
        },
        city: {
          type: GraphQLString
        },
        phone: {
          type: GraphQLString
        },
        email: {
          type: GraphQLString
        },
        userType: {
          type: GraphQLString
        },
        token: {
          type: GraphQLString
        },
        userId: {
          type: GraphQLString
        },
        userCode: {
          type: GraphQLString
        }
      }
    }
  });
  //
  // create a GraphQL query type that returns all users or a user by id
  const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
      return {
        users: {
          type: new GraphQLList(userType),
          resolve: function () {
            const users = UserModel.find().exec()
            if (!users) {
              throw new Error('Error')
            }
            return users
          }
        },
        user: {
          type: userType,
          args: {
            id: {
              name: '_id',
              type: GraphQLString
            }
          },
          resolve: function (root, params) {
            const userInfo = UserModel.findById(params.id).exec()
            if (!userInfo) {
              throw new Error('Error')
            }
            return userInfo
          }
        },
        userByCode: {
            type: new GraphQLList(userType),
            args:{
                userCode:{
                    name: 'userCode',
                    type: GraphQLString
                }
            },
            async resolve(root, params) {
                const userCode = await UserModel.find({userCode: params.userCode})
                console.log(userCode);
                return userCode
            }
        },
        }
      }
  });
  //
  // add mutations for CRUD operations
  const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
      return {
        addUser: {
          type: userType,
          args: {
            password: {
              type: new GraphQLNonNull(GraphQLString)
            },
            firstName: {
              type: new GraphQLNonNull(GraphQLString)
            },
            lastName: {
              type: new GraphQLNonNull(GraphQLString)
            },
            birthdate: {
              type: new GraphQLNonNull(GraphQLString)
            },
            address: {
              type: new GraphQLNonNull(GraphQLString)
            },
            city: {
              type: new GraphQLNonNull(GraphQLString)
            },
            phone: {
              type: new GraphQLNonNull(GraphQLString)
            },
            email: {
              type: new GraphQLNonNull(GraphQLString)
            },
            userType: {
              type: new GraphQLNonNull(GraphQLString)
            },
            userCode: {
              type: new GraphQLNonNull(GraphQLString)
            }
          },
          resolve: function (root, params) {
            const userModel = new UserModel(params);
            const newUser = userModel.save();
            if (!newUser) {
              throw new Error('Error');
            }
            return newUser
          }
        },
        userInfo:{
          type: userType,
          args: {
            email: {
              name: 'email',
              type: GraphQLString
            },
            password: {
              name: 'password',
              type: GraphQLString
            }
          },
          resolve: ({userId},req) => {
            if (!req.isAuth) {
                throw new Error("Unauthorized");
            }
            const userInfo =  UserModel.findById(userId).exec()
            if (!userInfo) {
              throw new Error('Error')
            }
           return userInfo; 
      }},
        loginUser: {
          type: userType,
          args: {
            email: {
              name: 'email',
              type: GraphQLString
            },
            password: {
              name: 'password',
              type: GraphQLString
            }
          },
          resolve: async (root, params) => {
            const user = await UserModel.findOne({email: params.email}).lean()
            // check the user is exist
            if (!user)
            {
              throw new Error('Invalid Credentials! User is not exist')
            }
            console.log("userinput: " + params.password + " and the result: "+user.password)
            
            const isCorrectPassword = await bcrypt.compare(params.password, user.password);
            console.log(isCorrectPassword);
            if (!isCorrectPassword)
            {
                throw new Error('Invalid Credentials! Please check entered password is correct')
            }   
            console.log(" email: " + params.email + " _id: " + user._id);
            console.log("private_key: "+key)

            const token = jwt.sign({_id: user._id, email: user.email}, key , 
              {algorithm: 'HS256', expiresIn: jwtExpirySeconds });
              console.log('token:', token)
              console.log('user:', user)
              user.token = token;
            const userId = user._id;
            return {
              token,
              userId
            }
            
          }
        },
        updateUser: {
          type: userType,
          args: {
            id: {
              name: 'id',
              type: new GraphQLNonNull(GraphQLString)
            },
            firstName: {
              type: new GraphQLNonNull(GraphQLString)
            },
            lastName: {
              type: new GraphQLNonNull(GraphQLString)
            },
            birthdate: {
              type: new GraphQLNonNull(GraphQLString)
            },
            address: {
              type: new GraphQLNonNull(GraphQLString)
            },
            email: {
              type: new GraphQLNonNull(GraphQLString)
            },
            password: {
              type: new GraphQLNonNull(GraphQLString)
            },
            city: {
              type: new GraphQLNonNull(GraphQLString)
            },
            phone: {
              type: new GraphQLNonNull(GraphQLString)
            },
            userType: {
              type: new GraphQLNonNull(GraphQLString)
            },
            userCode: {
              type: new GraphQLNonNull(GraphQLString)
            }
            
          },
          resolve(root, params) {
            return UserModel.findByIdAndUpdate(params.id, { firstName: params.firstName, 
              lastName: params.lastName, email: params.email, birthdate: params.birthdate, 
              address: params.address, password: params.password, city: params.city, 
              phone: params.phone, userType: params.userType, userCode: params.userCode
               }, function (err) {
              if (err) return next(err);
            });
          }
        },
        deleteUser: {
          type: userType,
          args: {
            id: {
              type: new GraphQLNonNull(GraphQLString)
            }
          },
          resolve(root, params) {
            const deletedUser = UserModel.findByIdAndRemove(params.id).exec();
            if (!deletedUser) {
              throw new Error('Error')
            }
            return deletedUser;
          }
        },
      }
    }
  });
  
  //
  module.exports = new GraphQLSchema({query: queryType, mutation: mutation});