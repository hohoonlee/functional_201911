const assert = require('assert');

const _ = {};
const MAX_ARRAY_INDEX = Math.pow(2, 53) -1;
const isArrayLike = list => {
	const len = (list == null)?void 0:list.length;
	return typeof len == 'number' && len >= 0 && len <= MAX_ARRAY_INDEX; 
};
const bloop = (new_data, body) => {
	return (data, iteratee) => {
		const result = new_data(data);
		if (isArrayLike(data)) {
			for (var i = 0, len = data.length; i < len; i++) {
			  	body(iteratee(data[i], i, data), result, data[i]);
			}
	  	}else {
			for (var key in data) {
			  	if (data.hasOwnProperty(key)) body(iteratee(data[key], key, data), result, data[key]);
			}
		}  
		return result;
	};
};

_.identity = v => v;
_.not = v => !v;
_.isFunction = o => (o && o.toString()) === '[object Function]';
_.each 	= bloop(_.identity, ()=>{});  
_.map 	= bloop(()=>[], (val, result)=>result.push(val));
_.filter= bloop(()=>[], (condition, result, val) => {
	if(condition) result.push(val);
});
_.if = (validator, func, alter) => (...p) => validator(...p)?func(...p):alter && alter(...p);
_.safety = _.with_validator = _.if;
///////////////////////////////////////////////////////////////////////////////////
const result = _.map([1, 2, 3], function(v) {
	return v * this;
}.bind(5));
console.log(result);
_.each({id: 5, name: "JE", age: 27}, console.log);
bloop(
	function(v) { return v; },
	function() {}
  )(
	[5, 6, 7],
	function(v) { console.log(v) }
  );
  
  var obj = {
	a: 1,
	b: 2,
	c: 3,
	d: 4
  };
 console.log(_.filter(obj, function(val) {
	return val > 2;
  }));
  // [3, 4]
console.log(_.filter([1, 2, 3, 4], function(val) {
	return val < 3;
  }));
  // [1, 2]
  
  ////if
const sub = (a, b) => a - b;
const sub2 = _.if((a, b) => a >= b, sub, () => new Error(`a가 b보다 작습니다.`));
console.log(sub2(10, 5));
// console.log(sub2(2, 5));
const diff = _.if((a, b) => a >= b, sub, (a, b)=> sub(b, a));
console.log(diff(2, 5));