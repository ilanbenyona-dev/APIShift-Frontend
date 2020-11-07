import { PersistentStore } from './index';
import { BOARD_STORE_NAME } from './store-names';
import { Info, Type, Enum ,UnitSerializer} from '../assets/js/unit-classes';

class BoardStore extends PersistentStore {
    data() {
        return {
            // items: [{id: 1, name: 'User'}, {id:2, name: 'Post'}],
            // relations: [{item_id: 2, name: 'PostComments', from_id: 'item1', to_id: 'group1', type: 2}], // Line data
            // relations_types:[{id: 1}, {id: 2}, {id: 3}],
            // enums: [{id: 1, name: "Account Type"}],
            // item_enums: [{item_id:1, enum_id: 1}], // Line data
            // enum_types: [{id: 0, name: "a type"}, 
            //             {id: 1, name: "Regular"},
            //             {id: 1, name: "Premium"},
            //             {id: 1, name: "Admin"}],
            // groups: [{id: 1, name: "PostGroup"}], // Array of item id's which are groups
            // group_items: [{group_id: 1, item_id: 2}],

            // charts: [{id: 1, name: 'First_chart', scale: 0.2}],
            // charts_components: [
            //     {'id': 1, 'chart_id': 1, 'component_id': 1, 'type': 1, 'pos_x': 100, 'pos_y': 100},
            //     {'id': 2, 'chart_id': 1, 'component_id': 2, 'type': 1, 'pos_x': 70, 'pos_y': 100},
            //     {'id': 3, 'chart_id': 1, 'component_id': 3, 'type': 2, 'pos_x': 50, 'pos_y': 50},
            //     {'id': 4, 'chart_id': 1, 'component_id': 1, 'type': 3, 'pos_x': 50, 'pos_y': 20}],
            // chart_component_types: [
            //     {'id': 1, name: "Item"},
            //     {'id': 2, name: "Relation"},
            //     {'id': 3, name: "Enum"},
            //     {'id': 4, name: "Type"},
            //     {'id': 5, name: "Group"}],

            unitList: [new Info(100,100, "lol"), new Enum(200,200, "lol"),new Type(400,100, "lol") ,new Info(100, 500, "lol")],
            scale: 1
        }
    }

    getUnitList() {
        let unitList = [];
        if (this.state.unitList.length) {
            let arr = this.state.unitList || [];
            for (let index = 0; arr[index]; index++) {
                let unit = arr[index];
                console.log(unit);
                unitList.push(UnitSerializer.deserialize(unit));
            }
        }
        return unitList;
    }

    getScale() {
        return this.state.scale;
    }
    setUnitList(unitList) {
        this.state.unitList = unitList;
    }
    setScale(scale) {
        this.state.scale = scale;
    }
    addUnit(unit) {
        this.state.unitList.push(unit);
    }
    getPanData() {
        let x = this.state.panLeft;
        let y = this.state.panTop;
        return {x,y,scale:this.state.scale};
    }

    // Transforamtions 
    setTransformation(scale, panTop, panLeft) {
        this.state.panLeft = panLeft;
        this.state.panTop = panTop;
        this.state.scale = scale;
    }

    scaleBy(scaleBy) {
        this.state.scale *= scaleBy;
    }
}

export const boardStore = new BoardStore(BOARD_STORE_NAME);



