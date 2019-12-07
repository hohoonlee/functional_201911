const assert = require('assert');
////////////////////////////////////////////////////////////////////////////////////////////
const isObject 	= o => (typeof o == 'object' && o.constructor == Object);
const isArray 	= o => (typeof o == 'object' && o.constructor == Array);

const each = (_list, iteratee, breakCondition) => {
	const list = [..._list];
	let idx = 0;
	const _each = (_list, iteratee) => {
		if(!_list || _list.length === 0) return;
		const data = _list.shift();
		if(breakCondition) {
			if(breakCondition(data, idx, list)) return iteratee(data, idx, list);
		}else {
			iteratee(data, idx, list);
		}
		return _each(_list, iteratee, idx++);
	}
	return _each(list, iteratee, idx);
}

const filter = (list, predicate) => {
	const newList = [];
	each(list, (d, i, l) => {
		if(predicate(d, i, l)) newList.push(d);
	});
	return newList;
}

const map = (list, iteratee) => {
	const newList = [];
	each(list, (d, i, l)=> {
		newList.push(iteratee(d, i, l));
	});
	return newList;
}

const find = (list, condition) => {
	return each(list, identity, condition);
}

const findIndex = (list, condition) => {
	const result =  each(list, (_,i)=>i, condition);
	return (result >= 0)?result:-1;
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
const assertLog = (result, r) => {
	const subAssert = (result, r) => {
		if(isObject(result)) {
			assert(match(result, r));
		}else if(isArray(result)) {
			every(result, (v, i)=>{
				subAssert(v, r[i]);
			});
		}else {
			assert(result == r);
		}
	};
	subAssert(result, r);
	console.log(r);
}

const addMaker = a => b => a + b;

const add5 = addMaker(5);
console.log('addMaker ----------------------');
assertLog(15, add5(10));



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
assertLog([
			{ id: 1, name: 'ID', age: 32 },
			{ id: 3, name: 'BJ', age: 32 },
			{ id: 6, name: 'JM', age: 33 }
		], 
		filter(users, u=>u.age > 30));
assertLog(	[32, 25, 32, 28, 27, 33, 24],
			map(users, u=>u.age));
assertLog(	[ 25, 28, 27, 24 ], 
			map(filter(users, u=>u.age < 30), u=>u.age));
assertLog(	{ id: 3, name: 'BJ', age: 32 }, 
			find(users, u=> u.name == 'BJ'));

console.log('find --------------------------');
assertLog(users[5], 	find(users, bmatch({name:'JM', age:33})));
assertLog(5, 			findIndex(users, bmatch({name:'JM', age:33})));
assertLog(undefined, 	find(users, bmatch({name:'JM', age:133})));
assertLog(-1, 			findIndex(users, bmatch({name:'JM', age:133})));

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

const add3 = partial(add, _, _, 3, _, _);
assertLog(15, add3(1, 2, 4, 5));
assertLog(203, add3(50, 50, 50, 50));
assertLog(403, add3(100, 100, 100, 100));

const abc = (a, b, c) => {
	console.log(a, b, c);
}
partial(abc, _, 'b', _)('a', 'c');
partial(abc, _, 'b')('a', 'c');

const bj = {
	name: 'BJ',
	greet: partial(function(a, b) {
		return a + this.name + b;
	}, '저는 ', '입니다')
};
console.log(bj.greet());
console.log(bj.greet.bind({name:'PJ'})());