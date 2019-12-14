{
const run = (f, cb) => {
	return (...p) => {
		setTimeout(()=>cb(f(...p)), 1000);
	};
}
const add = run((a, b) => a + b, console.log);

add(10, 5);
}

{
const add = (a, b, cb) => {
	setTimeout(()=>cb(a + b), 1000);
};

const sub = (a, b, cb) => {
	setTimeout(()=>cb(a - b), 1000);
};

const div = (a, b, cb) => {
	setTimeout(()=>cb(a / b), 1000);
};

add(10, 15, a => {
	sub(a, 5, a => {
		div(a, 10, console.log);
	});
});
}
//////////////////////////////////////////////////////////////////////////////
{
const _async = f => {
	return (...p) => {
		var _cb;
		(function wait(p) {
			for(let i = 0; i < p.length; i++) {
				if(p[i] && p[i].name == '_async_cb_receiver') {
					return p[i](v => {p[i] = v; wait(p);});
				}
			}
			f(...p, v => _cb(v));
		})(p);
		function _async_cb_receiver(cb) {
			_cb = cb;
		}
		return _async_cb_receiver;
	};
};

const add = _async((a, b, cb) => {
	console.log(a, b, cb);
	setTimeout(()=>cb(a + b), 1000);
});

const sub = _async((a, b, cb) => {
	console.log(a, b, cb);
	setTimeout(()=>cb(a - b), 1000);
});

add(10, sub(5, 1))(console.log);
}