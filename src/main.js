import {createApp} from 'vue'
import App from './App.vue'

// window.useLocalStorageValue = (key, defaultValue) => {
//     const value = Vue.ref(localStorage.getItem(key) ?? defaultValue)
//     watch(value, (newValue) => {
//       localStorage.setItem(key, newValue)
//     })
//     return value
//   }
createApp(App).mount('#app');





// const store = createStore({
//     state () {
//       return {
//         unitList: [ new Info(200,50, "User"),
//         new Info(500,500, "Post"),
//         new Enum(200,200, "Accounts"),
//         new Type(500,100, "Regular"),
//         new Type(600,600, "Premium"),
//         new Enum(400,200, "Accounts 2")]
//       }
//     },
//     getters: {
//         getUnitList: state => {
//             return state.unitList;
//         }
//     },
//     mutations: {
//         reloadUnitList(state) {
//             state.unitList = state.unitList.map((u)=> {
//                 if(u.constructor.name === "Info") {
//                     return new Info(u.xpos(), u.ypos(), u.getText());
//                 }
//                 if(u.constructor.name === "Type") {
//                     return new Type(u.xpos(), u.ypos(), u.getText());
//                 }
//                 if(u.constructor.name === "Enum") {
//                     return new Enum(u.xpos(), u.ypos(), u.getText());
//                 }
//                 if(u.constructor.name === "Relation") {
//                     return new Relation(u.xpos(), u.ypos(), u.getText());
//                 }
//                 if(u.constructor.name === "Group") {
//                     return new Group(u.xpos(), u.ypos(), u.getText());
//                 }
//             });
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
// })
// app.use(store);

