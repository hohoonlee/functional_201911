const assert = require('assert');
const assertLog = (result, r) => {
	assert(result == r);
	console.log(r);
}

const addMaker = a => b => a + b;

const add5 = addMaker(5);
console.log('addMaker ----------------------');
assertLog(15, add5(10));
////////////////////////////////////////////////////////////////////////////////////////////

const each = (list, iteratee) => {
	for(let i = 0, len = list.length; i < len; i++) {
		iteratee(list[i]);
	}
}

const filter = (list, predicate) => {
	const newList = [];
	each(list, d=> {
		if(predicate(d)) newList.push(d);
	});
	return newList;
}

const map = (list, iteratee) => {
	const newList = [];
	each(list, d=> {
		newList.push(iteratee(d));
	});
	return newList;
}

const find = (list, condition) => {
	for(let i = 0, len = list.length; i < len; i++) {
		if(condition(list[i])) return list[i];
	}
}

const findIndex = (list, condition) => {
	for(let i = 0, len = list.length; i < len; i++) {
		if(condition(list[i])) return i;
	}
	return -1;
}

const match = (target, conditions) => {
	for(const key in conditions) {
		if(bnq(target[key])(conditions[key])) return false;
	}
	return true;
}

const bmatch = (keyOrObj, val) => {
	if(val) keyOrObj = {[keyOrObj]:val};
	return target => match(target, keyOrObj);
}

const identity = v => v;
const not = v => !v;
const beq = a => b => a === b;
const bnq = a => b => not(a === b);
const positive = list => find(list, identity);
const negativeIndex = list => findIndex(list, not);
const some = list => compose(not, not, positive)(list);
const every = list => compose(beq(-1), negativeIndex)(list);
const compose = (...params)=>{
	return (...r) => {
		const stack = [...params];
		let f = stack.pop();
		r = f(...r);
		while(f = stack.pop()) {
			r = f(r);
		}
		return r;
	}
};
const _ = Symbol('_');
const partial =  (f, ...params) => {
	return function (...p) {
		const newParams = map(params, v=>(v === _)?p.shift():v);
		if(p) newParams.push(...p);
		return f.bind(this)(...newParams);
	};
};
////////////////////////////////////////////////////////////////////////////////////////////////////

const users = [
	{ id: 1, name: "ID", age: 32 },
	{ id: 2, name: "HA", age: 25 },
	{ id: 3, name: "BJ", age: 32 },
	{ id: 4, name: "PJ", age: 28 },
	{ id: 5, name: "JE", age: 27 },
	{ id: 6, name: "JM", age: 33 },
	{ id: 7, name: "HI", age: 24 }
];
console.log('filter ----------------------');
console.log(filter(users, u=>u.age > 30));
console.log(map(users, u=>u.age));
console.log(map(filter(users, u=>u.age < 30), u=>u.age));
console.log(find(users, u=> u.name == 'BJ'));

console.log('bmatch ----------------------');
assertLog(find(users, bmatch({name:'JM', age:33})), find(users, bmatch('age', 33)));

console.log('some every ----------------------');
assertLog(true, some([0, null, 2])); // true
assertLog(false, some([0, null, false])); // false
assertLog(false, every([0, null, 2])); // false
assertLog(true, every([{}, true, 2])); // true

console.log('compose ----------------------');
var greet = function(name) {
	return "hi: " + name;
};
var exclaim = function(statement, a='!') { 
	return statement.toUpperCase() + a;
};
var welcome = compose(greet, exclaim);
assertLog('hi: MOE!', welcome("moe"));
assertLog('hi: JAVASCRIPT!', welcome("javaScript", "!"));
 
console.log('partial ----------------------');
function add() {
	var result = 0;
	for (var i = 0; i < arguments.length; i++) {
	  result += arguments[i];
	}
	return result;
}

const add1 = partial(add, 1, _, 3, 4, 5);
assertLog(add(1, 2, 3, 4, 5), add1(2));
assertLog(21, add1(2, 6));
  