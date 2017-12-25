let Phases = [
    {},
    {
        // Intro level.
        Level: 1,
        checkLevelPeriod: 1001,
        SpawnScoutAfterSkippedPeriods: -1,
        SpawnPeriod: 25,
        minimumEnergyToSpawn: 250,
        checkGoal: (room) => {

            // Goal: build a container for each source and 5 extensions.
            let desiredExtensionCount = 5,
                desiredContainerCount = (room.find(FIND_SOURCES)||{}).length || 0,
                structures = room.find(FIND_STRUCTURES);
            
            for(let i=0;i<structures.length;i++) {
                let structure = structures[i];
                if(structure.structureType === 'extension') {
                    desiredExtensionCount--;
                } else if (structure.structureType === 'container') {
                    desiredContainerCount--;
                } else if (structure.structureType === 'storage') {
                    desiredContainerCount--;
                }

                console.log(`container: ${desiredContainerCount}. ext: ${desiredExtensionCount}`);
                if (desiredContainerCount <= 0 && desiredExtensionCount <= 0) {
                    return true;
                }
            }
            return false;
        },
        Harvester: {
            count: 2,
            parts: [WORK,CARRY,MOVE] // 250
        },
        Upgrader: {
            count: 4,
            parts: [WORK,CARRY,MOVE] // 250
        },
        Builder: {
            count: 4,
            parts: [WORK,CARRY,MOVE] // 250
        },
        Scout: {
            count: 0,
            parts: [ ]

        },
        Settler: {
            count: 0,
            parts: [ ]
        },
        RemoteHarvester: {
            count: 0,
            parts: [ ]
        },
        Miner: {
            count: 0,
            parts: [ ]
        }
    }, {
        // Extensions and containers built.
        Level: 2,
        checkLevelPeriod: 1001,
        SpawnScoutAfterSkippedPeriods: 10,
        SpawnPeriod: 50,
        minimumEnergyToSpawn: 550,
        checkGoal: (room) => {
            
            // Goal: Build one tower.
            let structures = room.find(FIND_MY_STRUCTURES);
            
            for(let i=0;i<structures.length;i++) {
                let structure = structures[i];
                if(structure.structureType === 'tower') {
                    return true;
                }
            }
            return false;
        },
        Harvester: {
            count: 1,
            parts: [WORK,CARRY,MOVE,MOVE,CARRY,WORK,MOVE,WORK,CARRY]
        },
        Upgrader: {
            count: 3,
            parts: [WORK,CARRY,MOVE,MOVE,CARRY,WORK,MOVE,WORK,CARRY]
        },
        Builder: {
            count: 2,
            parts: [WORK,CARRY,MOVE,MOVE,CARRY,WORK,MOVE,WORK,CARRY]
        },
        Scout: {
            count: 256,
            // scouts are expected to not go on roads
            parts: [TOUGH, MOVE, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK ]
        },
        Settler: {
            count: 1,
            parts: [MOVE, MOVE, CLAIM]
        },
        RemoteHarvester: {
            count: 0,
            parts: [WORK,CARRY,MOVE,MOVE,CARRY,WORK,MOVE,WORK,CARRY]
        },
        Miner: {
            count: LOOK_SOURCES,
            minimumEnergyToSpawn: 700,
            parts: [ WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE ] // 700
        },
    }, {
        // Build defenses
        Level: 3,
        RampartDesiredHealth: 30*1000,
        checkLevelPeriod: 1001,
        SpawnScoutAfterSkippedPeriods: 10,
        SpawnPeriod: 50,
        minimumEnergyToSpawn: 550,
        checkGoal: () => false,
        Harvester: {
            count: 2,
            parts: [WORK,CARRY,MOVE,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY]
        },
        Upgrader: {
            count: 2,
            parts: [WORK,CARRY,MOVE,MOVE,CARRY,WORK,MOVE,WORK,CARRY]
        },
        Builder: {
            count: 4,
            parts: [WORK,CARRY,MOVE,MOVE,CARRY,WORK,MOVE,WORK,CARRY]
        },
        Scout: {
            count: 256,
            // scouts are expected to not go on roads
            parts: [TOUGH, MOVE, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK ]
        },
        Settler: {
            count: 1,
            parts: [MOVE, MOVE, CLAIM]
        },
        RemoteHarvester: {
            count: 0,
            parts: [WORK,CARRY,MOVE,MOVE,CARRY,WORK,MOVE,WORK,CARRY]
        },
        Miner: {
            count: LOOK_SOURCES,
            minimumEnergyToSpawn: 700,
            parts: [ WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE ] // 700
        },
    }
];

Phases.getCurrentPhaseInfo = function (room) {
    let number = Phases.getCurrentPhaseNumber(room);
    while (!Phases[number]) {
        number--;
        if (number < 0) {
            throw new Error('Phases do not exist!');
        }
    }
    return Phases[number];
};
Phases.getCurrentPhaseNumber = function(room) {
    let roomName = room.name || room,
        phaseNo = Memory.rooms[roomName].phase; 
    return phaseNo || 1;
};
Phases.determineCurrentPhaseNumber = function (room) {
    let roomName = room.name || room,
        phaseNo = Memory.rooms[roomName].phase || 1,
        phase = Phases[phaseNo],
        period = phase.checkLevelPeriod,
        checkGoal = phase.checkGoal;

    // We don't need to check on every tick
    if (Game.time % period === 0 && checkGoal(room)) {
        Memory.rooms[roomName].phase++;
        console.log(`Updated ${room} phase to ${Memory.rooms[roomName].phase}`);
    }
    // TODO: Rooms that don't have a controller?
    return Memory.rooms[roomName].phase || 1;
};

module.exports = Phases;
