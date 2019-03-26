
const pos = new Vector(30, 50), size = new Vector(5, 5), speed = new Vector(10, 10);
const person = new Actor( pos, size, speed );
console.log('Person is ', person.top);


class Level {
	constructor(grid = [null, null], actors) {
		this.grid = grid;
		this.actors = actors;
	}

	get player() {
		return 'player';
	}

	get height() {
		return this.grid.length;
	}

	get width() {
		return this.grid[0].length;
	}

	status() {
		return null;
	}

	finishDelay() {
		return 1;
	}

	isFinished() {
		if( this.status != null) {
			if ( this.finishDelay < 0) {
				return true;
			} else {
				return false;
			}
		}

		return false;
	}

	actorAt(actor) {

		if( !actor instanceof Actor) {
			throw Error `Объект не является объектом типа Actor`;
		}
		
		if( this.grid == null) {
			return undefined;
		}
		return new Vector();
	}
}
