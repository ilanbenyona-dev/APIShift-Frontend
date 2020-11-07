import { reactive, readonly, ref, watch } from 'vue';
import { set, get } from 'idb-keyval';


export class Store {
    constructor(storeName) {
        this.storeName = storeName;
        let data = this.data()
        this.state = reactive(data);
    }
    getState() {
        return readonly(this.state);
    }
}

export class PersistentStore extends Store {
    constructor(storeName) {
        super(storeName);
        this.storeName = storeName;
        this.isInitialized = ref(false);
    }
    async init() {
        if (this.isInitialized) {
            let stateFromIndexedDB = await get(this.storeName);
            console.log(stateFromIndexedDB);
            if (stateFromIndexedDB) {
                Object.assign(this.state, JSON.parse(stateFromIndexedDB));
                console.log(this.state);
            }
            else {
                console.log(JSON.stringify(this.state));
                set(this.storeName, JSON.stringify(this.state));
            }
            watch(() => this.state, (val) => {
                set(this.storeName, JSON.stringify(val))
            }, { deep: true });
            this.isInitialized.value = true;
        }
    }
    getIsInitialized() {
        return this.isInitialized;
    }
}


// export default {
//     state: {
//         unitList: [ new Info(200,50, "User"),
//         new Info(500,500, "Post"),
//         new Enum(200,200, "Accounts"),
//         new Type(500,100, "Regular"),
//         new Type(600,600, "Premium"),
//         new Enum(400,200, "Accounts 2")]
//     },
//     getters: {
//         getUnitList: state => {
//             return state.unitList;
//         }
//     },
//     mutations: {
//         reloadUnitList(state) {

//         },
//         addUnit(state, unit) {
//             state.unitList.push(unit);
//         },
//         removeUnit(state, unit) {
//             state.unitList = state.unitList.map((u) => u.getUID() !== unit.getUID());
//         }
//     },
//     actions: {
//         reloadUnitList(context) {
//             context.commit('reloadUnitList');
//         },
//         addUnit(context) {
//             context.commit('addUnit');
//         },
//         removeUnit(context) {
//             context.commit('removeUnit');
//         }
//     }
// }