'use strict'

const dogs = require('./source');

module.exports = {
    Query: {
        dog: (obj, args, context, info) => {
            for (let i = 0; i < dogs.length; ++ i) {
            if (args.id === dogs[i].id) {
                return dogs[i];
                }
            }
        return null;
        },
        allDogs: () => {
            return dogs;
        },
        // all: () => {
        //     return cats;
        // }        
    },
    Mutation: {
        createDog: (_, data) => {
            const dog = Object.assign({id: dogs.length + 1}, data);
            dogs.push(dog);
            return dog;
        }
    },
    Dog: {
        id: (dog) => dog.id,
        name: (dog) => dog.name
    },
    
};

// module.exports = {
//     Dog: {
//         id: {
//             resolve(parent, args, context, info) {
//                 return dogs[1];
//             }
//         }
//     }
    
// };