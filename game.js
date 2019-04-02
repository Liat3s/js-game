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
	constructor( x, y ) {

		super( new Vector(x, y - 0.5), new Vector(0.8, 1.5), new Vector(0,0) );
		//super(pos.plus(new Vector(0, -0.5)), new Vector(0.8, 1.5), new Vector(0, 0));
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










































/*
const pl = new Player(10, 5);
console.log('player is ', pl.pos);


const schema = [
  '         ',
  '         ',
  '    =    ',
  '       o ',
  '     !xxx',
  '!@       ',
  'xxx!     ',
  '         '
];

const actorDict = {
  '@': Player,
}

const parser = new LevelParser(actorDict);
const level = parser.parse(schema);
runLevel(level, DOMDisplay)
  .then(status => console.log(`Игрок ${status}`));
*/

const schema = [
  '         ',
  '         ',
  '         ',
  '         ',
  '     !xxx',
  ' @       ',
  'xxx!     ',
  '         '
];
const actorDict = {
  '@': Player
}
const parser = new LevelParser(actorDict);
const level = parser.parse(schema);
runLevel(level, DOMDisplay);

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
