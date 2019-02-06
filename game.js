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
class Actor {
	constructor(pos) {
				
		
	}
	
	isIntersect() {
		
	}
}

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
	constructor() {
		
	}
}

class Level {
	constructor() {
		
	}
}

class Player {
	constructor() {
		
	}
}



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














