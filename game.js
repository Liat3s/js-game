'use strict';

class Vector {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	plus(vector) {

		if( vector instanceof Vector ) {
			return new Vector(vector.x + this.x, vector.y + this.y);
		} else {
			throw new Error('Arg vector isn\'t defined as class Vector');
		}
	}

	times(n) {
		return new Vector(this.x * n, this.y * n);
	}

}

//const vec = new Vector(0, 5);

//console.log( vec.plus(new Vector(3, 4)) );



/*
class Level {
	class LevelParser {
		class Fireball {
			constructor(fireball) {

				getNextPosition() {

				}

				handleObstacle() {

				}

				act() {

				}
			}
		}

		class HorizontalFireball {
			constructor() {

			}
		}

		class VerticalFireball {
			constructor() {

			}
		}

		class FireRain() {
			constructor() {

			}

			handleObstacle() {

			}
		}

		class Coin {
			constructor() {

			}

			updateSpring() {

			}

			getSpringVector() {

			}

			getNextPosition() {

			}

			act() {

			}
		}
	}
}

class Player {
	constructor() {

	}
}




*/

class Actor {
	constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0) ) {

		if( !(pos instanceof Vector ) || !(size instanceof Vector) || !(speed instanceof Vector) ) {
			throw Error `Можно передать только объект типа Vector`;
		}

		this.pos = pos;
		this.size = size;
		this.speed = speed;
	}
	act() {
	}

	get left() {
		return this.pos.x;
	}

	get right() {
		return this.pos.x + this.size.x;
	}

	get top() {
		return this.pos.y;
	}

	get bottom() {
		return this.pos.y + this.size.y;
	}

	get type() {
		return 'actor';
	}

	isIntersect(actor) {
		if ( (!actor instanceof Actor) || (actor === undefined) ) {
			throw Error `Можно передать только объект типа Actor`;
		}

		if( actor === this || actor.size.x < 0 || actor.size.y < 0) {
			return false;
		}

		return !(actor.left >= this.right || actor.right <= this.left || actor.top >= this.bottom || actor.bottom <= this.top);
	}

}

const pos = new Vector(30, 50), size = new Vector(5, 5), speed = new Vector(10, 10);
const person = new Actor( pos, size, speed );
console.log('Person is ', person.top);



// class Level {
// 	constructor() {
//
// 	}
// }
//
// class Player {
// 	constructor() {
//
// 	}
// }



/*

const schema = [
  '         ',
  '         ',
  '    =    ',
  '       o ',
  '     !xxx',
  ' @       ',
  'xxx!     ',
  '         '
];
const actorDict = {
  '@': Player,
  '=': HorizontalFireball
}
const parser = new LevelParser(actorDict);
const level = parser.parse(schema);
runLevel(level, DOMDisplay)
  .then(status => console.log(`Игрок ${status}`));
*/
