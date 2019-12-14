const assert = require('assert');
const _ = require('../src/u3');

const users = [
	{id:2, name:'HA', age:25},
	{id:4, name:'PJ', age:28},
	{id:5, name:'JE', age:27}
];

describe('_.each', ()=> {
	it('_.each (array)', ()=>{
		const result = [];
		_.each([1, 2, 3], v=>{
			result.push(v * 3);
		});
		assert.deepEqual([3, 6, 9], result);
	});

	it('_.each (object)', ()=>{
		const result = [];
		_.each({a:1, b:2, c:3}, v=>{
			result.push(v * 3);
		});
		assert.deepEqual([3, 6, 9], result);
	});

	it('_.map (array)', ()=>{
		const result = _.map([1, 2, 3], v=>v * 2);
		assert.deepEqual([2, 4, 6], result);
	});

	it('_.map (object)', ()=>{
		const result = _.map({a:3, b:2, c:1}, v=>v*2);
		assert.deepEqual([6, 4, 2], result);
	});

	it('_.values', ()=> {
		const result = _.values(users[2]);
		assert.deepEqual([5, 'JE', 27], result);
	});

	it('_.values', ()=> {
		const result = _.keys(users[2]);
		assert.deepEqual(['id', 'name', 'age'], result);
	});

	it('_.filter', ()=>{
		const result = _.filter([1,2,3,4,5], v=>v>3);
		assert.deepEqual([4, 5], result);
	});

	it('_.rest', ()=> {
		assert.deepEqual([2, 3], _.rest([1,2,3]));
		assert.deepEqual([3], _.rest([1,2,3], 2));
	});

	it('_.rester', ()=>{
		const sum = (a=0, b=0, c=0, d=0) => a + b + c + d;
		assert.equal(9, _.rester(sum)(1, 2, 3, 4));
		assert.equal(7, _.rester(sum, 2)(1, 2, 3, 4));
		assert.equal(4, _.rester(sum, 3)(1, 2, 3, 4));
	});

	it('_.if', ()=>{
		const sub = (a, b) => a - b;
		const safeSub = _.if(
			(a, b) => a >= b,
			sub,
			()=> 0
		);

		assert.equal(7, safeSub(10, 3));
		assert.equal(0, safeSub(10, 13));
	});

	it('_.reject', ()=>{
		assert.deepEqual([1,2,3], _.reject([1,2,3,4,5], v=>v>3));
	});

	it('_.find', ()=>{
		assert.equal(100, _.find([1, 10, 100, 1000], v => v > 50));
	});

	it('_.find (object}', ()=>{
		assert.equal(users[2], _.find(users, user => user.age == 27));
	});

	it('_.findIndex', ()=>{
		assert.equal(2, _.findIndex([1, 10, 100, 1000], v => v > 50));
	});

	it('_.findKey (object}', ()=>{
		assert.equal('name', _.findKey(users[2], value => typeof value === 'string'));
	});
});