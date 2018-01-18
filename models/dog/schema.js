'use strict'

module.exports = `
    type Dog {
        id: Int!
        name: String!
    }

    extend type Query {
        dog(id: Int!): Dog
        allDogs: [Dog]
        #all: [Dog]
    }

    extend type Mutation {
        createDog(name: String!): Dog
    }
`;