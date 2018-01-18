'use strict'

module.exports = `
    type Cat {
        id: Int!
        name: String!
    }

    extend type Query {
        cat(id: Int!): Cat
        allCats: [Cat]
        all: [Cat]
    }

    extend type Mutation {
        createCat(name: String!): Cat
    }
`;