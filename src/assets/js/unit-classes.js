
import { Helpers } from "./Helpers";

class Unit {
    constructor(x, y, text, objectStr) {
        if (objectStr) {
            let obj = objectStr;
            this._id = obj._id;
            this._xpos = obj._xpos;
            this._ypos = obj._ypos;
            this._text = obj._text;
            this._type = obj._type;
            return;
        }
        this._id = Helpers.generateUID();
        this._xpos = parseInt(x, 10);
        this._ypos = parseInt(y, 10);
        this._text = text;
        this._type = null;
    }

    // Gets other Unit object and draws LeaderLine to it
    drawLineTo(unit, options) {
        let LeaderLine = window.LeaderLine;
        let start = this.getRenderedElement();
        let end = unit.getRenderedElement();

        let line = new LeaderLine(
            start,
            end,
            options
        );
        // document.querySelector('#board').appendChild('.leader-line:last-of-type')
        this._lineElements.push(document.querySelector('.leader-line:last-of-type'));

        // Add the LeaderLine object to source & target 
        unit.pushLine(line);
        this.pushLine(line);
    }

    xpos() {
        return parseInt(this._xpos, 10);
    }
    ypos() {
        return parseInt(this._ypos, 10);
    }
    setX(x) {
        this._xpos = parseInt(x);
    }
    setY(y) {
        this._ypos = parseInt(y);
    }
    setText(text) {
        this._text = text;
    }
    getType() {
        return this._type;
    }
    setType(type) {
        this._type = type;
    }

    // Return unique id of the unit
    getUID() {
        return this._id;
    }
    newUID() {

    }
    getText() {
        return this._text;
    }
}

class Relation extends Unit {
    constructor(src, dest, relationType, text, objectStr) {
        super( 0, 0, text, objectStr);
        if (objectStr) {
            let obj = objectStr;
            this._src = obj._src;
            this._dest = obj._dest;
            this._relationType = obj._relationType;
            this._type = 'Relation'
            return;
        }
        this._src = src;
        this._dest = dest;
        this._relationType = relationType; // 1->1, 1->N, N->N
        this._type = 'Relation';
    }

    getSrcId() {
        return this._src;
    }
    getDestId() {
        return this._dest;
    }
    getRelationType() {
        return this._relationType;
    }
    getType() {
        return this._type;
    }
 }

class Info extends Unit {
    constructor( x, y, text, objectStr) {
        super( x, y, text, objectStr);
        if (objectStr) {
            let obj = objectStr;
            this._enumId = obj._enumId;
            return;
        }
        this._enumId = null;
        this._type = "Info";
    }

    setEnumId(unit) {
        this._enumId = unit;
    }
    getEnumId() {
        return this._enumId;
    }
}

class Type extends Unit {
    constructor( x,y, text, objectStr) {
        super( x, y, text, objectStr);

        if (objectStr) {
            let obj = objectStr;
            this._containerId = obj._containerId;
            return;
        }
        /* string that represents Enum container id */
        this._containerId = null;
        this._type = "Type"
    }

    // Set container
    setEnumContainerId(enumId) {
        this._containerId = enumId;
    }
    // Get container
    getEnumContainerId() {
        return this._containerId;
    }
}

class Enum extends Unit {
    constructor( x,y, text, objectStr) {
        super( x, y, text, objectStr);
        
        if (objectStr) {
            let obj = objectStr;
            this._contains = obj._contains;
            return;
        }
        this._type = "Enum";
        this._contains = []; // list of units id
    }
    // Get contained units id
    getContainedUnits() {
        return this._contains;
    }
    addUnitToEnum(unitId) {
        this._contains = Array.from(new Set([...this._contains, unitId]));
    }
    
    removeUnitFromEnum(unitId) {
        this._contains = this._contains.filter(item => item !== unitId);
    }
}

class Group extends Unit {
    constructor( contains, text, objectStr) {
        super(0,0,text, objectStr);
        if (objectStr) {
            let obj = objectStr;
            this._contains = obj._contains;
            return;
        }
        this._type = 'Group';
        this._contains = contains;
    }

    getContainedUnits() {
        return this._contains;
    }

    addItem(itemId) {
        this._contains.push(itemId);
    }

    removeItem(itemId) {
        this._contains = this._contains.filter((i)=> i!==itemId);
    }
}

// TODO: consider using it
/**
 * Static class to serialize and deserialize units by type
 */
class UnitSerializer {
    static serialize(unit) {    
        let serilized = {...unit};
        return JSON.stringify(serilized);
    }
    static deserialize(unit) {
        if (unit._type === "Info") {
            return new Info(0,0,0, unit);
        }
        if (unit._type === "Enum") {
            return new Enum(0,0,0,unit);
        }
        if (unit._type === "Type") {
            return new Type(0,0,0,unit);
        }
        if (unit._type === "Relation") {
            return new Relation(0,0,0,0, unit);
        }
        if (unit._type === "Group") {
            return new Group(0,0,unit);
        }
        return null;
    }
}

export { Unit, Info, Type, Enum, Relation, Group, UnitSerializer };