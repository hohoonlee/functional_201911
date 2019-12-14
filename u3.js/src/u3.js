const _ = {};

_.isObject = obj => {
	const type = typeof obj;
	return (type === 'function' || type === 'object') && !!obj;
};

_.if = (validator, success, fail=_.noop) => (...p)=>(validator(...p)?success(...p):fail(...p));

_.keys = obj => (_.isObject(obj))?Object.keys(obj):[];

_.idtt = _.identity = v => v;
_.not = v => !v;
_.constant = v => () => v;
_.args1 = (a, b) => b;
_.array = () => [];
_.push_to = (v, array) => {array.push(v), array};
_.push = (array, v) => {array.push(v), array};
_.noop = () => {};

// _.toArray = (list) => (Array.isArray(list))?list:_.values(list);
_.toArray = _.if(Array.isArray, _.identity, _.values);
_.rest = (list, num = 1) => _.toArray(list).slice(num);
_.reverse = (list) => _.toArray(list).reverse();
_.rester = (func, num) => (...p)=> func(..._.rest(p, num));

_._loop = (resultDataFunction, setResultFunction = _.noop, stopper)=>{
	return (list, iteretee)=>{
		const returnVal 	= resultDataFunction(list);
		const isIterator 	= !!list[Symbol.iterator];
		const iterable		= (isIterator)?list:Object.keys(list);

		let i = 0;
		for(const v of iterable) {
			const value = (isIterator)?v:list[v];
			const key 	= (isIterator)?i++:v;

			const memo = iteretee(value, key, list);
			if(!stopper) {
				setResultFunction(memo, returnVal, value, key);
			}else {
				if(stopper(memo)) return setResultFunction(memo, returnVal, value, key);
			}
		}
		return returnVal;
	};
};

_.each 	= _._loop(_.identity);
_.map  	= _._loop(_.array, _.push_to); 
_.filter = _._loop(_.array, _.if(_.identity, _.rester(_.push)));
_.reject = _._loop(_.array, _.if(_.not, _.rester(_.push)));
_.find 	= _._loop(_.noop, _.rester(_.identity, 2),_.identity);
_.findIndex = _._loop(_.constant(-1), _.rester(_.identity, 3),_.identity);
_.findKey = _._loop(_.noop, _.rester(_.identity, 3),_.identity);
_.some = _._loop(_.constant(false), _.constant(true), _.identity);
_.values = list => _.map(list, _.identity);
// _.values = list => Object.values(list);
// _.keys = list => _.map(list, _.args1);
// _.keys = list => Object.keys(list);

module.exports = _;