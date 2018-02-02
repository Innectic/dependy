
export * from "./injector";

import { Injectable, Injector } from "./injector";

class Test {

	public test() {
		console.log("Testing");
	}
}

class Testing {

	constructor(public t: Test) {

	}

	public test() {
		this.t.test();
	}
}

const injector = new Injector(
	{
		injects: Test
	},
	{
		injects: Testing,
		depends: [Test]
	}
);

injector.get(Testing).test();
