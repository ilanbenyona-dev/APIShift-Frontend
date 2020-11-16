import { PersistentStore } from './index';
import { BOARD_STORE_NAME } from './store-names';
import { Info, Enum, Type ,UnitSerializer} from '../assets/js/unit-classes';

class BoardStore extends PersistentStore {
    data() {
        return {
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



