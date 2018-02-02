
export interface Injectable {
	injects: any;
	create?: Function;
	depends?: any[];
}

interface InjectedDependencies {
	[name: string]: any
}

export class Injector {
	private injected: InjectedDependencies = {};

	constructor(...injectables: Injectable[]) {
		this.setup(injectables);
	}

	private areAllDependenciesResolved(injectable: Injectable): boolean {
		for (let dep of injectable.depends || []) {
			if (!this.injected[(dep.name || "")]) return false;
		}
		return true;
	}

	private getDependenciesInOrder(injectable: Injectable): any[] {
		let deps = [];

		for (let dep of injectable.depends || []) {
			deps.push(this.injected[dep.name]);
		}
		return deps;
	}

	private createInstanceOfInjectable(injectable: Injectable, args: any[]): any {
		return new (injectable.injects.bind(this, ...args));
	}

	private handleDependencies(injectables: Injectable[]): Injectable[] {
		let flagged: Injectable[] = [];
		for (let injectable of injectables) {
			// Make sure we've resolved all the dependencies
			if (!this.areAllDependenciesResolved(injectable)) {
				// Flag this dependency to be looked at later.
				flagged.push(injectable);
				continue;
			}
			// Since all the deps are resolved, then we can proceed.
			const constructedDependencies = this.getDependenciesInOrder(injectable);
			let instance: any = null;
			if (!!injectable.create) {
				instance = injectable.create(...constructedDependencies);
			} else {
				instance = this.createInstanceOfInjectable(injectable, constructedDependencies);				
			}
			// Store the constructed object
			this.injected[injectable.injects.name] = instance;
		}
		return flagged;
	}

	private setup(injectables: Injectable[]) {
		let flagged = this.handleDependencies(injectables);
		if (flagged.length >= 1) {
			this.setup(flagged);
		}
	}

	public get(type: any): any | null {
		return this.injected[type.name] || null;
	}
}
