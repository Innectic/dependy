
# Dependy

Dependy is a simple way to have fast, easy dependency injection for your project.

How simple is it? Let me show you!

# Examples

```typescript

import { Injectable, Injector } from "dependy";

class CoolService {

	public async connect(): Promise<boolean> {
		// TODO: Super cool connection login
		return true;
	}
}

class Core {
	constructor(private service: CoolService) {

	}

	public async start() {
		console.log("Connecting...");
		const connected = await this.service.connect();
		console.log(`Connection was ${connected ? "" : "un"}successful!`);
	}
}

const injector = new Injector(
	{
		injects: CoolService
	},
	{
		injects: Core,
		depends: [CoolService]
	}
);

injector.get(Core).start();
```
