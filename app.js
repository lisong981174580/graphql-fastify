'use strict'

const fastify = require('fastify')();
const { makeExecutableSchema,addMockFunctionsToSchema, addResolveFunctionsToSchema, addSchemaLevelResolveFunction } = require('graphql-tools');
const graphqlStep = require('fastify-apollo-step');
const db = require('./connectors/mongo');

// const typeDefs = `
//     type Query {
//         cat(id: Int!): Cat
//         allCats: [Cat]
//     }

//     type Mutation {
//         createCat(name: String!): Cat
//     }

//     type Cat {
//         id: Int!
//         name: String!
//     }
// `;

// const typeDefs_dog = `
//     extend type Query {
//         dag(id: Int!): Dog
//         allDogs: [Dog]
//     }

//     type Dog {
//         id: Int!
//         name: String!
//     }
// `;

// const cats = [
//     {
//         id: 1,
//         name: '1'
//     },
//     {
//         id: 2,
//         name: '2',
//     },
//     {
//         id: 3,
//         name: '33'
//     }        
// ];

// const resolvers = {
//     Query: {
//         cat: (root, args) => {
//             for (let i = 0; i < cats.length; ++ i) {
//               if (args.id === cats[i].id) {
//                   return cats[i];
//                 }
//             }
//           return null;
//         },
//         allCats: () => {
//             return cats;
//         }
//     },
//     Mutation: {
//         createCat: (_, data) => {
//             const cat = Object.assign({id: cats.length + 1}, data);
//             cats.push(cat);
//             return cat;
//         }
//     },
//     Cat: {
//         id: (cat) => cat.id,
//         name: (cat) => cat.name
//     },
    
// };



// const schema = makeExecutableSchema({
//   typeDefs: [      
//     `type Query {
//         version: String!
//     }
//     type Mutation {
//         create(id: String): String
//     }
//     schema {
//         query: Query
//         mutation: Mutation
//     }`,   
//     // require('./schema/cat'),
//     // require('./schema/dog'),
//     // `schema {
//     //     query: Query
//     //     mutation: Mutation
//     // }`
//   ],
// //   resolvers:require('./resolvers/cat'),
// //   context: {
// //       a:1
// //   }
// });

// const s = `type Query {
//         version: String!
//     }
//     type Mutation {
//         create(id: String): String
//     }
//     schema: {
//         query: Query
//         mutation: Mutation
//     }
// `;


// const schema = makeExecutableSchema({ 
//     typeDefs: [
//         s,
//         require('./schema/cat')
//     ],
// });

// const defs = [
//     `type Query {
//         version: String!
//     }
//     type Mutation {
//         create(id: String): String
//     }
//     schema {
//         query: Query
//         mutation: Mutation
//     }`,   
//     require('./schema/cat'),
//     require('./schema/dog'),
//     // `schema {
//     //     query: Query
//     //     mutation: Mutation
//     // }`
// ]

// const schema = makeExecutableSchema({
//       typeDefs: defs
// });
    

// addResolveFunctionsToSchema(schema, require('./resolvers/cat'));
// addResolveFunctionsToSchema(schema, require('./resolvers/dog'));


db.init({
    "url": "mongodb://localhost:27017/",
    "database": "ArmyAnt"
}).then(() => {
    console.log('db init.');
});

const defs = [
    `type Query {
        version: String!
    }
    type Mutation {
        create(id: String): String
    }
    schema {
        query: Query
        mutation: Mutation
    }`
];
const models = require('./models/models');

for (let i = 0; i < models.models.length; ++ i) {
    defs.push(require(models.models[i].path + '/schema'));
}

const schema = makeExecutableSchema({
      typeDefs: defs
});

for (let i = 0; i < models.models.length; ++ i) {
    addResolveFunctionsToSchema(schema, require(models.models[i].path + '/resolver'));
}

// addSchemaLevelResolveFunction(schema, {
//     Query: {
//         equipment: (obj, args, context, info) => {
//             return 'version';
//         } 
//     }
// });


const context = {};

const options = {
    graphql: {
        path: '/ql',
        beforeHandler: function (reqest, reply, done) {
            console.log('beforeHandler');
            done();
        },
        apollo: {
            schema,
            context: context,
            // validationRules: () => {
            //     console.log(arguments);
            // }
        }
    },
    graphiql: {
        path: '/graphiql',
        apollo: {
            endpointURL: '/ql'
        }
    }
};

fastify.register(graphqlStep, options);

// const options1 = {
//     graphql: {
//         path: '/ql1',
//         beforeHandler: function (reqest, reply, done) {
//             console.log('beforeHandler');
//             done();
//         },
//         apollo: {
//             schema,
//             context: context,
//             // validationRules: () => {
//             //     console.log(arguments);
//             // }
//         }
//     },
//     graphiql: {
//         path: '/graphiql1',
//         apollo: {
//             endpointURL: '/ql1'
//         }
//     }
// };
// fastify.register(graphqlStep, options1);

fastify.addHook('preHandler', (request, reply, next) => {
    if (request.body) {
        context.userId = 1;
        request.body.userId = 10;
        console.log('preHandler - (reqId:%d) body:%j\n', request.req.id, request.body);
    }
    next();                
});

fastify.addHook('onSend', (request, reply, payload, next) =>
 {
    if (payload) {
        console.log('onSend - (reqId:%d) payload:%j\n', request.req.id, payload);
    }
    next();                
});

fastify.addHook('onRequest', (req, res, next) => {
    console.log('onRequest - ', req.url);
    next();
});

fastify.listen(3001);

