const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

// remove all as per condition, returns objects contains information
Todo.remove({completed: true}).then((result) => {
    console.log(`successfully removed`);
}).catch((err) => {
    console.log(`err in removing ==> ${err.message}`);
}); 

// find one and remove OR find by id or remove ==> 
// both remove first occurance and returns removed document

Todo.findByIdAndRemove('5c98f75b61437e37ac275dea').then((doc) => {
    console.log(`removed ==> ${doc}`);
}).catch((err) => {
    console.log(`err in removing ==> ${err.message}`);
});


