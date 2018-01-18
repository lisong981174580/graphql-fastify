'use strict'

const DataLoader = require('dataloader');
const db = require('../../connectors/mongo');

const equipmentLoader = new DataLoader(keys => {
    return db.find('Equipment', { 
        _id: {$in: keys}
    });
});

const equipmentTypeLoader = new DataLoader(keys => {
    return db.find('EquipmentType', { 
        _id: {$in: keys}
    });
});

module.exports = {

    Query: {
        equipment: (obj, args, context, info) => {
            // return db.findById('Equipment', args.id);
            return equipmentLoader.load(args.id);
        },
        equipments: (obj, args, context, info) => {
            context.id = 100;
            return db.find('Equipment', {});
            // return equipmentLoader.load();
        }
    },
    Equipment: {
        id: (equipment) => equipment._id || equipment.id,
        type: (equipment) => {
            return equipmentTypeLoader.load(equipment.eqId);
            // return db.findById('EquipmentType', equipment.eqId);
        },
        name: (equipment) => {
            return undefined;
        }
    },
    EquipmentType: {
        id: (type) => type._id || type.id
    }

};