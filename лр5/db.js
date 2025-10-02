var util = require('util');
var ee = require('events');

var db_data = [
    {id: 1, name: 'Иванов И.И.', bday: '2001-01-01'},
    {id: 2, name: 'Петров П.П.', bday: '2001-01-02'},
    {id: 3, name: 'Сидоров С.С.', bday: '2001-01-03'}
];

function isEmpty(value){
    return value === undefined || value === null || value === '';
}

function DB(){
    ee.EventEmitter.call(this);

    this.select = () => {  return db_data;};
    this.insert = (r) => { 
        let index = db_data.findIndex(el => el.id == r.id);
        if (index == -1 && !isEmpty(r.id) && !isEmpty(r.name) && !isEmpty(r.bday) && new Date(r.bday) <= Date.now()){db_data.push(r);}
        
    };
    this.update = (r) => {
        
        let index = db_data.findIndex(el => el.id == r.id);
        if (index != -1 && !isEmpty(r.id) && !isEmpty(r.name) && !isEmpty(r.bday) && new Date(r.bday) <= Date.now()){
            db_data[index] = r;
            return r;
        }
        return null;
    };
    this.delete = (id) => {
        
        let index = db_data.findIndex(el => el.id == id);
        if (index != -1){
            let removed = db_data.splice(index, 1)[0];
            return removed;
        }
        return null;
    };
    this.commit = () => {
        console.log('DB.COMMIT');
        this.emit('COMMIT');
    };
}

util.inherits(DB, ee.EventEmitter);

exports.DB = DB;