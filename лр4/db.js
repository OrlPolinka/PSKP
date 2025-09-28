var util = require('util');
var ee = require('events');

var db_data = [
    {id: 1, name: 'Иванов И.И.', bday: '2001-01-01'},
    {id: 2, name: 'Петров П.П.', bday: '2001-01-02'},
    {id: 3, name: 'Сидоров С.С.', bday: '2001-01-03'}
];

function DB(){
    ee.EventEmitter.call(this);

    this.select = () => {  return db_data;};
    this.insert = (r) => { db_data.push(r);};
    this.update = (r) => {
        
        let index = db_data.findIndex(el => el.id == r.id);
        if (index != -1){
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
}

util.inherits(DB, ee.EventEmitter);

exports.DB = DB;