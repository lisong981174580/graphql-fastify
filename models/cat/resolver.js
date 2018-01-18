'use strict'

const cats = require('./source');

module.exports = {
    Query: {
        cat: (obj, args, context, info) => {
            context.cat = 1;
            for (let i = 0; i < cats.length; ++ i) {
            if (args.id === cats[i].id) {
                return cats[i];
                }
            }
        return null;
        },
        allCats: (obj, args, context, info) => {
            return cats;
        },
        all: () => {
            return cats;
        }
    },
    Mutation: {
        createCat: (_, data) => {
            const cat = Object.assign({id: cats.length + 1}, data);
            cats.push(cat);
            return cat;
        }
    },
    Cat: {
        id: (cat) => cat.id,
        name: (cat) => cat.name
    },
    
};

// module.exports = {
//     Cat: {
//         id: {
//             resolve(parent, args, context, info) {
//                 return cats[1];
//             }
//         }
//     }
    
// };