'use strict'

module.exports = `
    type Equipment {
        id: String!
        gwBeat: String!
        eqId: Int!
        ports: [Port] 
        type: EquipmentType
        name: String
    }
    type Port {
        index: Int!
        port: Int!
    }
    type EquipmentType {
        id: Int!
        interval: Int!
        readEntries: [Entry]
        writeEntries: [Entry]
    }
    type Entry {
        index: Int!
        slaveId: Int!
        address: Int!
        register: Int!
    }
    extend type Query {
        equipment(id: String!): Equipment
        equipments: [Equipment]
    }
    
`;