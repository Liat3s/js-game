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

class Actor {
	constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0) ) {

		if( !(pos instanceof Vector ) || !(size instanceof Vector) || !(speed instanceof Vector) ) {
			throw Error `Можно передать только объект типа Vector`;
		}

		this.pos = pos;
		this.speed = speed;
		this.size = size;
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

class Level {
	constructor(grid = [], actors = []) {
		this.grid = grid;
		this.actors = actors;
		this.height = grid.length;
		this.width = grid.reduce( (cell, row) => row.length > cell ? row.length: cell, 0);
		this.status = null;
		this.finishDelay = 1;
		this.player = actors.find( elem => elem.type === 'player');
	}

	isFinished() {
		return this.status !== null && this.finishDelay < 0 ? true: false;
	}

	actorAt(actor) {
		if(!actor || !(actor instanceof Actor)) {
			throw Error('Объект не является типом объекта Actor');
		}
		return this.actors.find(elem => elem.isIntersect(actor) );
	}

	obstacleAt(position, size) {
		if(!(position instanceof Vector && size instanceof Vector)) {
			throw Error('Объект не является объектом типа Vector');
		}

		const item = new Actor(position, size);

		if(item.top < 0 || item.left < 0 || item.right > this.width) {
			return 'wall';
		}
		if(item.bottom > this.height) {
			return 'lava';
		}

		const top = Math.floor(item.top),
					bottom = Math.ceil(item.bottom),
					left = Math.floor(item.left),
					right = Math.ceil(item.right);

		for(let i = top; i < bottom; i++) {
			for(let j = left; left < right; j++) {
				const grid = this.grid[i][j];
				if(grid) {
					//console.log('grid', grid);
					return grid;
				} else {
					return undefined;
				}
			}
		}

	}

	removeActor(item) {
		const index = this.actors.indexOf(item);
		if(index !== -1) {
			this.actors.splice(index, 1);
		}
	}

	noMoreActors(item) {
		return !(this.actors.some(actor => actor.type === item));
	}

	playerTouched(obstacle, actorTouch = {}) {
		if(obstacle === 'lava' || obstacle === 'fireball') {
			this.status = 'lost';
		} else if (obstacle === 'coin' && actorTouch.type === 'coin') {
			this.removeActor(actorTouch);
			if(this.noMoreActors('coin')) {
				this.status = 'won';
			}
		}
	}
}

class Player extends Actor{
	constructor( pos = new Vector(0, 0) ) {

		const position = new Vector(pos.x, pos.y - 0.5),
					size = new Vector(0.8, 1.5),
					speed = new Vector(0, 0);

		super( position, size, speed );
		//super( new Vector(pos.x, pos.y - 0.5 ), new Vector(0.8, 1.5), new Vector(0, 0) );
	}
	get type() {
		return 'player';
	}
}

class LevelParser {
	constructor(dict = {}) {
		this.dict = {...dict};
	}

	actorFromSymbol(symbol) {
		return this.dict[symbol];
	}

	obstacleFromSymbol(symbol) {
		return symbol == 'x' ? 'wall': symbol == '!' ? 'lava': undefined;
	}

	createGrid(plan = []) {
		return plan.map( (item) => item.split('').map( (i) => this.obstacleFromSymbol(i)));
	}

	createActors(plan = []) {
		const result = [];

		for(let i = 0; i < plan.length; i++) {
			for(let j = 0; j < plan[i].length; j++) {
				const item = this.dict[plan[i][j]];
				if(typeof(item) !== 'function') {
					continue;
				}
				const obj = new item(new Vector(j, i));
				if( obj instanceof Actor) {
					result.push(obj);
				}
			}
		}
		return result;
	}

	parse(plan) {
		const actors = this.createActors(plan);
		const grid = this.createGrid(plan);
		return new Level(grid, actors);
	}
}

class Fireball extends Actor {
  constructor(pos = new Vector(0,0), speed = new Vector(0,0) ) {
		const size = new Vector(1,1);
		super(pos, size, speed);
  }
	get type() {
		return 'fireball';
	}

	getNextPosition(time = 1) {
		return new Vector(this.pos.x + this.speed.x * time, this.pos.y + this.speed.y * time);
	}

	handleObstacle() {
		this.speed = this.speed.times(-1);
	}

	act(time = 1, plan = new Level() ) {
		const newPos = this.getNextPosition(time);
		if(!(plan.obstacleAt(newPos, this.size) ) ) {
			this.pos = newPos;
		} else {
			this.handleObstacle();
		}
	}
}

class HorizontalFireball extends Fireball {
	constructor(pos = new Vector(0, 0) ) {
		const speed = new Vector(2, 0),
					size = new Vector(1, 1);
		super(pos, speed, size);
	}
}

class VerticalFireball extends Fireball {
	constructor(pos = new Vector(0, 0) ) {
		const speed = new Vector(0, 2),
					size = new Vector(1, 1);
		super(pos, speed, size);
	}
}

class FireRain extends Fireball {
	constructor(pos = new Vector(0, 0) ) {
		const speed = new Vector(0, 3),
					size = new Vector(1, 1);
		super(pos, speed, size);
		this.newPos = pos;
	}
	handleObstacle() {
		this.pos = this.newPos;
	}
}

class Coin  extends Actor {
	constructor(pos = new Vector(0,0) ) {
		const size = new Vector(0.6, 0.6);
		super( new Vector(pos.x + 0.2, pos.y + 0.1), size );
		this.springSpeed = 8;
		this.springDist = 0.07;
		this.spring = Math.random() * 2 * Math.PI;
		this.newPos = new Vector(pos.x + 0.2, pos.y + 0.1);
	}

	get type() {
		return 'coin';
	}

	updateSpring(time = 1) {
		this.spring = this.spring + this.springSpeed * time;
	}

	getSpringVector() {
		return new Vector(0, Math.sin(this.spring) * this.springDist);
	}
	getNextPosition(time = 1) {
		const pos = new Vector(this.newPos.x, this.newPos.y);
		this.updateSpring(time);
		return pos.plus(this.getSpringVector() );
	}
	act(time) {
		this.pos = this.getNextPosition(time);
	}
}














const schemas = [
  [
    '         ',
    '         ',
    '    =    ',
    '       o ',
    '     !xxx',
    ' @       ',
    'xxx!     ',
    '         '
  ],
  [
    '      v  ',
    '    v    ',
    '  v      ',
    '        o',
    '        x',
    '@   x    ',
    'x        ',
    '         '
  ]
];
const actorDict = {
  '@': Player,
  'v': FireRain
}
const parser = new LevelParser(actorDict);
runGame(schemas, parser, DOMDisplay)
  .then(() => console.log('Вы выиграли приз!'));
