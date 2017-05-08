/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 78);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class TextStyle {
    getColorStyle(color) {
        const styleNormal = { font: "14px Share Tech Mono", fill: color, boundsAlignH: "center", boundsAlignV: "top" };
        return styleNormal;
    }
    getNormalStyle(size = 16) {
        const colorNormal = '#8cd6ff';
        const styleNormal = { font: size + "px Share Tech Mono", fill: colorNormal };
        return styleNormal;
    }
    getOverStyle() {
        const colorOver = '#5a7086';
        const styleOver = { font: "16px Share Tech Mono", fill: colorOver };
        return styleOver;
    }
}
exports.TextStyle = TextStyle;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const SteeringComputer_1 = __webpack_require__(6);
const Vehicle_1 = __webpack_require__(2);
const PathFinder_1 = __webpack_require__(12);
const MinerCollectBrain_1 = __webpack_require__(69);
const BrainText_1 = __webpack_require__(11);
class Miner extends Vehicle_1.Vehicle {
    constructor(group, x, y, army, radar, camera, key, frame, map) {
        super(group, x, y, army, radar, camera, key, frame);
        this.buildingScope = 40;
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.maxVelocity = 60;
        this.anchor.setTo(.5, .5);
        group.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.maxVelocity.set(this.maxVelocity, this.maxVelocity);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;
        this.body.setCircle(10, 0, 0);
        this.inputEnabled = true;
        this.animations.add('right', [4, 34], 2, true);
        this.animations.play('right');
        group.add(this);
        this.behavior = new SteeringComputer_1.SteeringComputer(this);
        this.oilLoad = 0;
        this.oilCapacity = 10;
        this.brain = new MinerCollectBrain_1.MinerCollectBrain(this, new PathFinder_1.PathFinder(map.getTiles(), map.getWalkableIndexes(), map.getTileSize()));
        this.brainText = new BrainText_1.BrainText(group, this.x, this.y, '', {}, this, this.brain);
    }
    buildMine(oil) {
        this.health = 0;
        const position = oil.getPosition();
        oil.collect();
        this.army.buildMine(position.x, position.y - 20, oil);
    }
    loadOil(exploitableMine) {
        const expectedQuantity = this.oilCapacity - this.oilLoad;
        const collectedQuantity = exploitableMine.collect(expectedQuantity);
        this.oilLoad = collectedQuantity;
    }
    unloadOil(base) {
        base.stock(this.oilLoad);
        this.oilLoad = 0;
    }
    getOilLoad() {
        return this.oilLoad;
    }
    getBuildingScope() {
        return this.buildingScope;
    }
    getSteeringComputer() {
        return this.behavior;
    }
    getBody() {
        return this.body;
    }
}
exports.Miner = Miner;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const HealthBar_1 = __webpack_require__(17);
const Radio_1 = __webpack_require__(77);
class Vehicle extends Phaser.Sprite {
    constructor(group, x, y, army, radar, camera, key, frame) {
        super(group.game, x, y, key, frame);
        this.army = army;
        this.radar = radar;
        this.camera = camera;
        this.radio = new Radio_1.Radio(camera, radar, army.getSharedMemory());
        this.tint = army.getColor();
        this.maxHealth = 100;
        this.health = 100;
        this.healthBar = new HealthBar_1.HealthBar(group, this);
    }
    update() {
        this.brain.think();
        this.behavior.compute();
        this.brainText.update();
        this.healthBar.update();
        this.radio.communicate(this.getPosition());
    }
    isAlive() {
        return this.health > 0;
    }
    isHurted() {
        return this.health < this.maxHealth;
    }
    hit(damage) {
        this.damage(damage);
        if (this.isAlive()) {
            const hitSprite = this.game.add.sprite(this.x - this.width, this.y - this.height, 'SmallExplosion');
            hitSprite.animations.add('hit');
            hitSprite.animations.play('hit', 20, false, true);
        }
        else {
            const dieSprite = this.game.add.sprite(this.x - this.width, this.y - this.height, 'MediumExplosion');
            dieSprite.animations.add('die');
            dieSprite.animations.play('die', 20, false, true);
        }
    }
    getArmy() {
        return this.army;
    }
    getStatus() {
        return this.brain.getStateName();
    }
    destroy(destroyChildren) {
        this.brainText.destroy();
        this.healthBar.destroy();
        super.destroy(destroyChildren);
    }
    getVelocity() {
        return this.body.velocity;
    }
    getMaxVelocity() {
        return this.body.maxVelocity;
    }
    getPosition() {
        return this.body.center;
    }
    getMass() {
        return this.body.mass;
    }
    getRadar() {
        return this.radar;
    }
    getCamera() {
        return this.camera;
    }
}
exports.Vehicle = Vehicle;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class State {
    constructor(name, func) {
        this.name = name;
        this.func = func;
    }
    getName() {
        return this.name;
    }
    getFunc() {
        return this.func;
    }
}
exports.State = State;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const StackFSM_1 = __webpack_require__(28);
class VehicleBrain {
    constructor() {
        this.fsm = new StackFSM_1.StackFSM();
    }
    think() {
        this.fsm.update();
    }
    getStateName() {
        return this.fsm.getCurrentState().getName();
    }
}
exports.VehicleBrain = VehicleBrain;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Constants to describe the type of ground on the tiles
exports.GRASS = 1;
exports.MNT = 2;
exports.LAVA = 3;
exports.SNOW = 4;
class Tile {
    constructor(index, topLeft, topRight, bottomRight, bottomLeft) {
        this.index = index;
        this.topLeft = topLeft;
        this.topRight = topRight;
        this.bottomRight = bottomRight;
        this.bottomLeft = bottomLeft;
    }
    static get GRASS() {
        return exports.GRASS;
    }
    static get MNT() {
        return exports.MNT;
    }
    static get LAVA() {
        return exports.LAVA;
    }
    static get SNOW() {
        return exports.SNOW;
    }
    static get GROUNDS() {
        return [exports.GRASS, exports.MNT, exports.LAVA, exports.SNOW];
    }
}
exports.Tile = Tile;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const SeekBehavior_1 = __webpack_require__(44);
const WanderBehavior_1 = __webpack_require__(45);
const FleeBehavior_1 = __webpack_require__(40);
const PursuingBehavior_1 = __webpack_require__(43);
const EvadingBehavior_1 = __webpack_require__(39);
const PathFollowingBehavior_1 = __webpack_require__(41);
const PathPatrollingBehavior_1 = __webpack_require__(42);
const CollisionReactionBehavior_1 = __webpack_require__(38);
const CollisionAvoidanceBehavior_1 = __webpack_require__(37);
/**
 * Inspired by following posts
 *
 * @see https://gamedevelopment.tutsplus.com/tutorials/understanding-steering-behaviors-movement-manager--gamedev-4278
 * @see http://www.emanueleferonato.com/2016/02/01/understanding-steering-behavior-html5-example-using-phaser/
 */
class SteeringComputer {
    constructor(host) {
        this.host = host;
        this.steering = new Phaser.Point(0, 0);
        this.seekBehavior = new SeekBehavior_1.SeekBehavior(host);
        this.wanderBehavior = new WanderBehavior_1.WanderBehavior(host);
        this.fleeBehavior = new FleeBehavior_1.FleeBehavior(host);
        this.pursuingBehavior = new PursuingBehavior_1.PursuingBehavior(host, this.seekBehavior);
        this.evadingBehavior = new EvadingBehavior_1.EvadingBehavior(host, this.fleeBehavior);
        this.pathFollowingBehavior = new PathFollowingBehavior_1.PathFollowingBehavior(host, this.seekBehavior);
        this.pathPatrollingBehavior = new PathPatrollingBehavior_1.PathPatrollingBehavior(host, this.seekBehavior);
        this.collisionReactionBehavior = new CollisionReactionBehavior_1.CollisionReactionBehavior(host);
        this.collisionAvoidanceBehavior = new CollisionAvoidanceBehavior_1.CollisionAvoidanceBehavior(host);
    }
    seek(target, slowingRadius = 20) {
        const force = this.seekBehavior.seek(target, slowingRadius);
        this.steering.add(force.x, force.y);
    }
    wander() {
        const force = this.wanderBehavior.wander();
        this.steering.add(force.x, force.y);
    }
    flee(target) {
        const force = this.fleeBehavior.flee(target);
        this.steering.add(force.x, force.y);
    }
    pursuing(target) {
        const force = this.pursuingBehavior.pursuing(target);
        this.steering.add(force.x, force.y);
    }
    evading(target) {
        const force = this.evadingBehavior.evading(target);
        this.steering.add(force.x, force.y);
    }
    pathFollowing(path, slowingRadius = 20) {
        const force = this.pathFollowingBehavior.followPath(path, slowingRadius);
        this.steering.add(force.x, force.y);
    }
    pathPatrolling(path, slowingRadius = 20) {
        const force = this.pathPatrollingBehavior.patrolPath(path, slowingRadius);
        this.steering.add(force.x, force.y);
    }
    reactToCollision(body) {
        const force = this.collisionReactionBehavior.reactToCollision(body);
        this.steering.add(force.x, force.y);
    }
    // TODO ai steering behavior should not now game objects
    avoidCollision(radar) {
        const force = this.collisionAvoidanceBehavior.avoidCollision(radar);
        this.steering.add(force.x, force.y);
    }
    compute() {
        // Now we add boid direction to current boid velocity
        this.host.getVelocity().add(this.steering.x, this.steering.y);
        // we normalize the velocity
        this.host.getVelocity().normalize();
        // we set the magnitude to boid speed
        this.host.getVelocity().setMagnitude(this.host.getMaxVelocity().x);
        // TODO: fix the slow down for seek behavior but break velocity for the rest
        //this.host.getVelocity().setMagnitude(this.steering.getMagnitude());
        // turn the vehicle to the velocity, don't change the angle if the velocity is null (the vehicle is attacking)
        const vehicle = this.host;
        if (vehicle.getVelocity().x != 0 && vehicle.getVelocity().y != 0) {
            vehicle.angle = 180 + Phaser.Math.radToDeg(Phaser.Point.angle(vehicle.getPosition(), new Phaser.Point(vehicle.getPosition().x + vehicle.getVelocity().x, vehicle.getPosition().y + vehicle.getVelocity().y)));
        }
    }
    reset() {
        this.steering = new Phaser.Point(0, 0);
    }
}
exports.SteeringComputer = SteeringComputer;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const HealthBar_1 = __webpack_require__(17);
class Building extends Phaser.Sprite {
    constructor(group, x, y, army, key, frame) {
        super(group.game, x, y, key, frame);
        this.army = army;
        this.tint = army.getColor();
        this.maxHealth = 100;
        this.health = 100;
        this.healthBar = new HealthBar_1.HealthBar(group, this);
    }
    update() {
        this.healthBar.update();
    }
    isDestroyed() {
        return this.health <= 20;
    }
    hit(damage) {
        this.damage(damage);
        if (!this.isDestroyed()) {
            const hitSprite = this.game.add.sprite(this.x, this.y, 'MediumExplosion');
            hitSprite.animations.add('hit');
            hitSprite.animations.play('hit', 20, false, true);
        }
        else {
            const dieSprite = this.game.add.sprite(this.x - this.width / 4, this.y - this.height / 4, 'BigExplosion');
            dieSprite.animations.add('die');
            dieSprite.animations.play('die', 20, false, true);
        }
    }
    isDamaged() {
        return this.health < this.maxHealth;
    }
    destroy(destroyChildren) {
        this.healthBar.destroy();
        super.destroy(destroyChildren);
    }
    getPosition() {
        return this.body.center;
    }
    getArmy() {
        return this.army;
    }
}
exports.Building = Building;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const SteeringComputer_1 = __webpack_require__(6);
const Vehicle_1 = __webpack_require__(2);
const PathFinder_1 = __webpack_require__(12);
const BrainText_1 = __webpack_require__(11);
const EngineerDefendBrain_1 = __webpack_require__(68);
class Engineer extends Vehicle_1.Vehicle {
    constructor(group, x, y, army, radar, camera, key, frame, map) {
        super(group, x, y, army, radar, camera, key, frame);
        this.maxHealth = 80;
        this.health = this.maxHealth;
        this.maxVelocity = 60;
        this.repairScope = 30;
        this.repairRythm = 1;
        this.anchor.setTo(.5, .5);
        group.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.maxVelocity.set(this.maxVelocity, this.maxVelocity);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;
        this.body.setCircle(10, 0, 0);
        this.inputEnabled = true;
        this.animations.add('right', [5], 10, true);
        this.animations.play('right');
        group.add(this);
        this.behavior = new SteeringComputer_1.SteeringComputer(this);
        this.brain = new EngineerDefendBrain_1.EngineerDefendBrain(this, new PathFinder_1.PathFinder(map.getTiles(), map.getWalkableIndexes(), map.getTileSize()));
        this.brainText = new BrainText_1.BrainText(group, this.x, this.y, '', {}, this, this.brain);
    }
    repairVehicle(friend) {
        if (friend.isHurted()) {
            this.repairSprite(friend);
        }
    }
    repairBuilding(friend) {
        if (friend.isDamaged()) {
            this.repairSprite(friend);
        }
    }
    repairSprite(sprite) {
        const distance = this.getPosition().distance(sprite.position);
        if (distance <= this.repairScope) {
            const repairRythm = this.repairRythm;
            const damages = sprite.maxHealth - sprite.health;
            const toRepair = damages > repairRythm ? repairRythm : damages;
            sprite.heal(toRepair);
        }
    }
    getRepairScope() {
        return this.repairScope;
    }
    getSteeringComputer() {
        return this.behavior;
    }
    getBody() {
        return this.body;
    }
}
exports.Engineer = Engineer;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const SteeringComputer_1 = __webpack_require__(6);
const Vehicle_1 = __webpack_require__(2);
const BrainText_1 = __webpack_require__(11);
const ScoutExploreBrain_1 = __webpack_require__(70);
class Scout extends Vehicle_1.Vehicle {
    constructor(group, x, y, army, radar, camera, key, frame) {
        super(group, x, y, army, radar, camera, key, frame);
        this.maxHealth = 30;
        this.health = this.maxHealth;
        this.maxVelocity = 90;
        this.anchor.setTo(.5, .5);
        group.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.maxVelocity.set(this.maxVelocity, this.maxVelocity);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;
        this.body.setCircle(10, 0, 0);
        this.inputEnabled = true;
        this.animations.add('right', [5], 10, true);
        this.animations.play('right');
        group.add(this);
        this.behavior = new SteeringComputer_1.SteeringComputer(this);
        this.brain = new ScoutExploreBrain_1.ScoutExploreBrain(this);
        this.brainText = new BrainText_1.BrainText(group, this.x, this.y, '', {}, this, this.brain);
    }
    getSteeringComputer() {
        return this.behavior;
    }
    getBody() {
        return this.body;
    }
}
exports.Scout = Scout;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const SteeringComputer_1 = __webpack_require__(6);
const Vehicle_1 = __webpack_require__(2);
const PathFinder_1 = __webpack_require__(12);
const TankDefendBrain_1 = __webpack_require__(72);
const TankAttackBrain_1 = __webpack_require__(71);
const BrainText_1 = __webpack_require__(11);
class Tank extends Vehicle_1.Vehicle {
    constructor(group, x, y, army, radar, camera, key, frame, map, jukebox) {
        super(group, x, y, army, radar, camera, key, frame);
        this.maxHealth = 150;
        this.health = this.maxHealth;
        this.maxVelocity = 40;
        this.attackScope = 100;
        this.attackDamage = 8;
        this.anchor.setTo(.5, .5);
        group.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.maxVelocity.set(this.maxVelocity, this.maxVelocity);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;
        this.body.setCircle(10, 0, 0);
        this.inputEnabled = true;
        this.animations.add('right', [5], 10, true);
        this.animations.play('right');
        group.add(this);
        this.behavior = new SteeringComputer_1.SteeringComputer(this);
        this.weapon = group.game.add.weapon(-1, 'Bullet', 14);
        this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.weapon.bulletSpeed = 600;
        this.weapon.fireRate = 500;
        this.weapon.trackSprite(this, 0, 0, true);
        this.brainAttack = new TankAttackBrain_1.TankAttackBrain(this, new PathFinder_1.PathFinder(map.getTiles(), map.getWalkableIndexes(), map.getTileSize()));
        this.brainDefend = new TankDefendBrain_1.TankDefendBrain(this, new PathFinder_1.PathFinder(map.getTiles(), map.getWalkableIndexes(), map.getTileSize()));
        this.brain = this.brainDefend;
        this.brainText = new BrainText_1.BrainText(group, this.x, this.y, '', {}, this, this.brain);
        this.jukebox = jukebox;
    }
    update() {
        if (this.army.getStrategy().isAttacking()) {
            this.brain = this.brainAttack;
            this.brainText.changeBrain(this.brain);
        }
        else if (this.army.getStrategy().isDefending()) {
            this.brain = this.brainDefend;
            this.brainText.changeBrain(this.brain);
        }
        super.update();
    }
    attackVehicle(enemy) {
        this.attackSprite(enemy);
        if (enemy.isAlive() == false) {
            this.jukebox.playExplosion();
        }
    }
    attackBuilding(enemy) {
        this.attackSprite(enemy);
        if (enemy.isDestroyed()) {
            this.jukebox.playExplosion();
        }
    }
    attackSprite(sprite) {
        const distance = this.getPosition().distance(sprite.position);
        if (distance <= this.attackScope) {
            const attackDamage = this.attackDamage;
            const bullets = this.weapon.bullets;
            this.game.physics.arcade.collide(bullets, sprite, function (touchedEnemy, firedBullet) {
                touchedEnemy.hit(attackDamage);
                firedBullet.destroy();
            });
            this.weapon.fireAtSprite(sprite);
            this.jukebox.playBlaster();
        }
    }
    getSteeringComputer() {
        return this.behavior;
    }
    getBody() {
        return this.body;
    }
    getAttackScope() {
        return this.attackScope;
    }
}
exports.Tank = Tank;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const StateColor_1 = __webpack_require__(73);
const TextStyle_1 = __webpack_require__(0);
class BrainText extends Phaser.Text {
    constructor(group, x, y, text, style, vehicle, brain) {
        super(group.game, x, y, text, style);
        this.brain = brain;
        this.vehicle = vehicle;
        this.stateColors = new StateColor_1.StateColors();
        group.game.physics.enable(this, Phaser.Physics.ARCADE);
        group.add(this);
    }
    update() {
        this.setText(this.brain.getStateName());
        let color = this.stateColors.getColor(this.brain.getStateName());
        const textStyle = new TextStyle_1.TextStyle();
        this.setStyle(textStyle.getColorStyle(color));
        this.game.physics.arcade.moveToObject(this, this.vehicle, this.vehicle.body.speed);
    }
    changeBrain(brain) {
        this.brain = brain;
    }
}
exports.BrainText = BrainText;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const TilePositionPath_1 = __webpack_require__(36);
// TODO: how to fix or not fix the following?
const EasyStar = __webpack_require__(23);
const TilePosition_1 = __webpack_require__(16);
const PhaserPointPath_1 = __webpack_require__(35);
class PathFinder {
    constructor(tiles, walkableIndexes, tilesize) {
        this.tiles = tiles;
        this.tilesize = tilesize;
        // cf https://github.com/prettymuchbryce/easystarjs
        this.easystar = new EasyStar.js();
        let grid = [];
        for (let i = 0; i < tiles.length; i++) {
            grid[i] = [];
            for (let j = 0; j < tiles[i].length; j++) {
                grid[i][j] = tiles[i][j].index;
            }
        }
        this.easystar.setGrid(grid);
        this.easystar.setAcceptableTiles(walkableIndexes);
        this.easystar.enableSync();
        this.easystar.enableDiagonals();
    }
    findTilePositionPath(start, end) {
        let foundPath = null;
        let pathCallback = function (path) {
            if (path === null) {
                console.log("path not found");
            }
            else {
                foundPath = new TilePositionPath_1.TilePositionPath(path);
            }
        };
        this.easystar.findPath(start.getX(), start.getY(), end.getX(), end.getY(), pathCallback);
        this.easystar.calculate();
        return foundPath;
    }
    findPhaserPointPath(start, end) {
        let foundPath = this.findTilePositionPath(this.convertToTilePosition(start), this.convertToTilePosition(end));
        if (foundPath) {
            const points = new Array();
            const nodes = foundPath.getNodes();
            for (let index = 0; index < nodes.length; index++) {
                let point = this.convertToPhaserPoint(nodes[index]);
                points.push(point);
            }
            return new PhaserPointPath_1.PhaserPointPath(points);
        }
        return null;
    }
    convertToTilePosition(point) {
        return new TilePosition_1.TilePosition(Math.ceil(point.x / this.tilesize) - 1, Math.ceil(point.y / this.tilesize) - 1);
    }
    convertToPhaserPoint(position) {
        // round to the center of the tile
        return new Phaser.Point(position.getX() * this.tilesize + this.tilesize / 2, position.getY() * this.tilesize + this.tilesize / 2);
    }
}
exports.PathFinder = PathFinder;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const TextStyle_1 = __webpack_require__(0);
class ButtonAndText {
    constructor(button, text) {
        this.button = button;
        this.text = text;
    }
    getButton() {
        return this.button;
    }
    getText() {
        return this.text;
    }
}
exports.ButtonAndText = ButtonAndText;
class ButtonBuilder {
    addButton(group, positionX, positionY, buttonFrame, buttonText, callback) {
        let buttonX = positionX;
        let buttonY = positionY;
        const button = group.game.add.button(buttonX, buttonY, 'OrderButton', callback, this, buttonFrame + 1, buttonFrame, buttonFrame + 1, buttonFrame, group);
        const textStyle = new TextStyle_1.TextStyle();
        const textMarginY = 3;
        const textMarginX = 15;
        const styleNormal = textStyle.getNormalStyle();
        const styleHover = textStyle.getOverStyle();
        const text = group.game.add.text(buttonX + textMarginX, buttonY + textMarginY, buttonText, styleNormal, group);
        button.onInputOut.add(function () {
            text.setStyle(styleNormal);
            text.y = text.y - 1;
        });
        button.onInputOver.add(function () {
            text.setStyle(styleHover);
            text.y = text.y + 1;
        });
        return new ButtonAndText(button, text);
    }
}
exports.ButtonBuilder = ButtonBuilder;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Building_1 = __webpack_require__(7);
const VehicleCosts_1 = __webpack_require__(21);
const Miner_1 = __webpack_require__(1);
const Scout_1 = __webpack_require__(9);
const Engineer_1 = __webpack_require__(8);
const Tank_1 = __webpack_require__(10);
class Base extends Building_1.Building {
    constructor(group, x, y, army, key, frame) {
        super(group, x, y, army, key, frame);
        this.stockedQuantity = 0;
        this.maxHealth = 300;
        this.heal(this.maxHealth);
        this.vehicleCosts = new VehicleCosts_1.VehicleCosts();
        this.anchor.setTo(.5, .5);
        group.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.immovable = true;
        this.body.allowGravity = false;
        this.body.setCircle(28, -6, 6);
        this.inputEnabled = true;
        this.animations.add('idle', [0, 1, 2], 3, true);
        this.animations.add('build', [0, 1, 2, 3, 5, 6, 7], 5, false);
        this.animations.add('destroyed', [4], 5, true);
        this.animations.play('idle');
        group.add(this);
    }
    update() {
        super.update();
        if (this.isDestroyed()) {
            this.animations.play("destroyed");
        }
    }
    buildMiner() {
        const baseRecruitX = this.getBuildVehicleX();
        const baseRecruitY = this.getBuildVehicleY();
        const cost = this.vehicleCosts.getCost(Miner_1.Miner);
        if (this.getStock() >= cost) {
            this.unstock(cost);
            this.animations.play('build');
            const army = this.army;
            const animations = this.animations;
            this.game.time.events.add(this.getBuildTime(), function () {
                army.recruitMiner(baseRecruitX, baseRecruitY);
                animations.play('idle');
            }, this);
        }
    }
    buildScout() {
        const baseRecruitX = this.getBuildVehicleX();
        const baseRecruitY = this.getBuildVehicleY();
        const cost = this.vehicleCosts.getCost(Scout_1.Scout);
        if (this.getStock() >= cost) {
            this.unstock(cost);
            this.animations.play('build');
            const army = this.army;
            const animations = this.animations;
            this.game.time.events.add(this.getBuildTime(), function () {
                army.recruitScout(baseRecruitX, baseRecruitY);
                animations.play('idle');
            }, this);
        }
    }
    buildBuilder() {
        const baseRecruitX = this.getBuildVehicleX();
        const baseRecruitY = this.getBuildVehicleY();
        const cost = this.vehicleCosts.getCost(Engineer_1.Engineer);
        if (this.getStock() >= cost) {
            this.unstock(cost);
            this.animations.play('build');
            const army = this.army;
            const animations = this.animations;
            this.game.time.events.add(this.getBuildTime(), function () {
                army.recruitEngineer(baseRecruitX, baseRecruitY);
                animations.play('idle');
            }, this);
        }
    }
    buildTank() {
        const baseRecruitX = this.getBuildVehicleX();
        const baseRecruitY = this.getBuildVehicleY();
        const cost = this.vehicleCosts.getCost(Tank_1.Tank);
        if (this.getStock() >= cost) {
            this.unstock(cost);
            this.animations.play('build');
            const army = this.army;
            const animations = this.animations;
            this.game.time.events.add(this.getBuildTime(), function () {
                army.recruitTank(baseRecruitX, baseRecruitY);
                animations.play('idle');
            }, this);
        }
    }
    getStatus() {
        return this.animations.currentAnim.name;
    }
    stock(quantity) {
        this.stockedQuantity += quantity;
    }
    unstock(quantity) {
        this.stockedQuantity -= quantity;
    }
    getStock() {
        return this.stockedQuantity;
    }
    getBuildVehicleX() {
        return this.getPosition().x + 30;
    }
    getBuildVehicleY() {
        return this.getPosition().y + 10;
    }
    getBuildTime() {
        return Phaser.Timer.SECOND * 1.8;
    }
}
exports.Base = Base;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Building_1 = __webpack_require__(7);
class Mine extends Building_1.Building {
    constructor(group, x, y, army, key, frame, quantity) {
        super(group, x, y, army, key, frame);
        this.maxHealth = 200;
        this.health = this.maxHealth;
        this.remainingQuantity = quantity;
        this.anchor.setTo(.5, .5);
        group.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.immovable = true;
        this.body.allowGravity = false;
        this.body.setCircle(28, -10, 6);
        this.inputEnabled = true;
        this.animations.add('build', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 5, false);
        this.animations.add('extracting', [17, 18, 19], 5, true);
        this.animations.add('idle', [17], 5, true);
        this.animations.add('destroyed', [20], 5, true);
        this.animations.play('build');
        group.add(this);
    }
    update() {
        super.update();
        if (this.animations.currentAnim.name == "build" && this.animations.currentAnim.isFinished) {
            this.animations.play("extracting");
        }
        if (this.isDestroyed()) {
            this.animations.play("destroyed");
        }
        else if (this.remainingQuantity == 0) {
            this.animations.play("idle"); // TODO: unbuild and get back the miner
        }
    }
    isExtracting() {
        return this.animations.currentAnim.name == "extracting";
    }
    getStatus() {
        return this.animations.currentAnim.name;
    }
    getRemainingQuantity() {
        return this.remainingQuantity;
    }
    collect(quantity) {
        let collected = quantity;
        if (this.remainingQuantity < quantity) {
            collected = this.remainingQuantity;
            this.remainingQuantity = 0;
        }
        else {
            collected = quantity;
            this.remainingQuantity -= quantity;
        }
        return collected;
    }
}
exports.Mine = Mine;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Position in the tilemap
 */
class TilePosition {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
}
exports.TilePosition = TilePosition;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vehicle_1 = __webpack_require__(2);
const HealthBarDrawer_1 = __webpack_require__(18);
class HealthBar {
    constructor(group, host) {
        this.game = group.game;
        this.host = host;
        const marginX = this.host.width / 2;
        const marginY = this.host.height / 2 + 10;
        this.bitmap = group.game.make.bitmapData(this.host.width, 4);
        this.bar = group.game.add.sprite(this.host.x - marginX, this.host.y + marginY, this.bitmap, 0, group);
        this.bar.anchor.set(0, 0);
        this.game.physics.enable(this.bar, Phaser.Physics.ARCADE);
        this.drawer = new HealthBarDrawer_1.HealthBarDrawer();
    }
    update() {
        this.drawer.draw(this.host, this.bitmap, this.host.width);
        if (this.host instanceof Vehicle_1.Vehicle) {
            this.game.physics.arcade.moveToObject(this.bar, this.host, this.host.body.speed);
        }
    }
    destroy() {
        this.bar.destroy();
        this.bitmap.destroy();
    }
}
exports.HealthBar = HealthBar;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class HealthBarDrawer {
    draw(host, bitmap, totalWidth) {
        const healthRatio = host.health / host.maxHealth;
        const healthWidth = totalWidth * healthRatio;
        const background = { red: 0, green: 0, blue: 0 };
        const good = { red: 0, green: 255, blue: 0 };
        const medium = { red: 255, green: 100, blue: 0 };
        const bad = { red: 255, green: 0, blue: 0 };
        for (let indX = 0; indX < totalWidth; indX++) {
            if (indX <= healthWidth) {
                if (healthRatio > 0.6) {
                    this.drawColumn(bitmap, indX, good);
                }
                else if (healthRatio > 0.3) {
                    this.drawColumn(bitmap, indX, medium);
                }
                else {
                    this.drawColumn(bitmap, indX, bad);
                }
            }
            else {
                this.drawColumn(bitmap, indX, background);
            }
        }
    }
    drawColumn(bitmap, indX, color) {
        const height = bitmap.height;
        for (let y = 0; y < height; y++) {
            bitmap.setPixel(indX, y, color.red, color.green, color.blue);
        }
    }
}
exports.HealthBarDrawer = HealthBarDrawer;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Item extends Phaser.Sprite {
    constructor() {
        super(...arguments);
        this.collected = false;
    }
    getPosition() {
        return this.body.center;
    }
    collect() {
        this.collected = true;
    }
    hasBeenCollected() {
        return this.collected;
    }
}
exports.Item = Item;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __webpack_require__(19);
class Oil extends Item_1.Item {
    constructor(group, x, y, key, frame, quantity) {
        super(group.game, x, y, key, frame);
        this.quantity = quantity;
        this.anchor.setTo(.5, .5);
        group.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.allowGravity = false;
        this.body.setCircle(5, 5, 5);
        this.inputEnabled = true;
        this.animations.add('idle', [33], 1, true);
        this.animations.play('idle');
        group.add(this);
    }
    getQuantity() {
        return this.quantity;
    }
    getStatus() {
        return (this.hasBeenCollected() ? 'collected' : 'to collect') + ' (oil:' + this.quantity + ')';
    }
}
exports.Oil = Oil;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Miner_1 = __webpack_require__(1);
const Engineer_1 = __webpack_require__(8);
const Scout_1 = __webpack_require__(9);
const Tank_1 = __webpack_require__(10);
class VehicleCosts {
    getCost(vehicle) {
        if (vehicle == Miner_1.Miner) {
            return 100;
        }
        else if (vehicle == Engineer_1.Engineer) {
            return 80;
        }
        else if (vehicle == Scout_1.Scout) {
            return 60;
        }
        else if (vehicle == Tank_1.Tank) {
            return 180;
        }
        else {
            throw new Error;
        }
    }
}
exports.VehicleCosts = VehicleCosts;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/// <reference path="../lib/phaser.d.ts"/>

Object.defineProperty(exports, "__esModule", { value: true });
const Boot_1 = __webpack_require__(48);
const Preload_1 = __webpack_require__(51);
const Menu_1 = __webpack_require__(49);
const Play_1 = __webpack_require__(50);
class SimpleGame extends Phaser.Game {
    constructor() {
        super(1280, 800, Phaser.CANVAS, "content", null);
        this.antialias = false;
        this.state.add('Boot', Boot_1.default);
        this.state.add('Preload', Preload_1.default);
        this.state.add('Menu', Menu_1.default);
        this.state.add('Play', Play_1.default);
        this.state.start('Boot');
    }
}
window.onload = () => {
    new SimpleGame();
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

/**
*   EasyStar.js
*   github.com/prettymuchbryce/EasyStarJS
*   Licensed under the MIT license.
*
*   Implementation By Bryce Neal (@prettymuchbryce)
**/

var EasyStar = {}
var Instance = __webpack_require__(24);
var Node = __webpack_require__(25);
var Heap = __webpack_require__(26);

const CLOSED_LIST = 0;
const OPEN_LIST = 1;

module.exports = EasyStar;

var nextInstanceId = 1;

EasyStar.js = function() {
    var STRAIGHT_COST = 1.0;
    var DIAGONAL_COST = 1.4;
    var syncEnabled = false;
    var pointsToAvoid = {};
    var collisionGrid;
    var costMap = {};
    var pointsToCost = {};
    var directionalConditions = {};
    var allowCornerCutting = true;
    var iterationsSoFar;
    var instances = {};
    var instanceQueue = [];
    var iterationsPerCalculation = Number.MAX_VALUE;
    var acceptableTiles;
    var diagonalsEnabled = false;

    /**
    * Sets the collision grid that EasyStar uses.
    *
    * @param {Array|Number} tiles An array of numbers that represent
    * which tiles in your grid should be considered
    * acceptable, or "walkable".
    **/
    this.setAcceptableTiles = function(tiles) {
        if (tiles instanceof Array) {
            // Array
            acceptableTiles = tiles;
        } else if (!isNaN(parseFloat(tiles)) && isFinite(tiles)) {
            // Number
            acceptableTiles = [tiles];
        }
    };

    /**
    * Enables sync mode for this EasyStar instance..
    * if you're into that sort of thing.
    **/
    this.enableSync = function() {
        syncEnabled = true;
    };

    /**
    * Disables sync mode for this EasyStar instance.
    **/
    this.disableSync = function() {
        syncEnabled = false;
    };

    /**
     * Enable diagonal pathfinding.
     */
    this.enableDiagonals = function() {
        diagonalsEnabled = true;
    }

    /**
     * Disable diagonal pathfinding.
     */
    this.disableDiagonals = function() {
        diagonalsEnabled = false;
    }

    /**
    * Sets the collision grid that EasyStar uses.
    *
    * @param {Array} grid The collision grid that this EasyStar instance will read from.
    * This should be a 2D Array of Numbers.
    **/
    this.setGrid = function(grid) {
        collisionGrid = grid;

        //Setup cost map
        for (var y = 0; y < collisionGrid.length; y++) {
            for (var x = 0; x < collisionGrid[0].length; x++) {
                if (!costMap[collisionGrid[y][x]]) {
                    costMap[collisionGrid[y][x]] = 1
                }
            }
        }
    };

    /**
    * Sets the tile cost for a particular tile type.
    *
    * @param {Number} The tile type to set the cost for.
    * @param {Number} The multiplicative cost associated with the given tile.
    **/
    this.setTileCost = function(tileType, cost) {
        costMap[tileType] = cost;
    };

    /**
    * Sets the an additional cost for a particular point.
    * Overrides the cost from setTileCost.
    *
    * @param {Number} x The x value of the point to cost.
    * @param {Number} y The y value of the point to cost.
    * @param {Number} The multiplicative cost associated with the given point.
    **/
    this.setAdditionalPointCost = function(x, y, cost) {
        if (pointsToCost[y] === undefined) {
            pointsToCost[y] = {};
        }
        pointsToCost[y][x] = cost;
    };

    /**
    * Remove the additional cost for a particular point.
    *
    * @param {Number} x The x value of the point to stop costing.
    * @param {Number} y The y value of the point to stop costing.
    **/
    this.removeAdditionalPointCost = function(x, y) {
        if (pointsToCost[y] !== undefined) {
            delete pointsToCost[y][x];
        }
    }

    /**
    * Remove all additional point costs.
    **/
    this.removeAllAdditionalPointCosts = function() {
        pointsToCost = {};
    }

    /**
    * Sets a directional condition on a tile
    *
    * @param {Number} x The x value of the point.
    * @param {Number} y The y value of the point.
    * @param {Array.<String>} allowedDirections A list of all the allowed directions that can access
    * the tile.
    **/
    this.setDirectionalCondition = function(x, y, allowedDirections) {
        if (directionalConditions[y] === undefined) {
            directionalConditions[y] = {};
        }
        directionalConditions[y][x] = allowedDirections;
    };

    /**
    * Remove all directional conditions
    **/
    this.removeAllDirectionalConditions = function() {
        directionalConditions = {};
    };

    /**
    * Sets the number of search iterations per calculation.
    * A lower number provides a slower result, but more practical if you
    * have a large tile-map and don't want to block your thread while
    * finding a path.
    *
    * @param {Number} iterations The number of searches to prefrom per calculate() call.
    **/
    this.setIterationsPerCalculation = function(iterations) {
        iterationsPerCalculation = iterations;
    };

    /**
    * Avoid a particular point on the grid,
    * regardless of whether or not it is an acceptable tile.
    *
    * @param {Number} x The x value of the point to avoid.
    * @param {Number} y The y value of the point to avoid.
    **/
    this.avoidAdditionalPoint = function(x, y) {
        if (pointsToAvoid[y] === undefined) {
            pointsToAvoid[y] = {};
        }
        pointsToAvoid[y][x] = 1;
    };

    /**
    * Stop avoiding a particular point on the grid.
    *
    * @param {Number} x The x value of the point to stop avoiding.
    * @param {Number} y The y value of the point to stop avoiding.
    **/
    this.stopAvoidingAdditionalPoint = function(x, y) {
        if (pointsToAvoid[y] !== undefined) {
            delete pointsToAvoid[y][x];
        }
    };

    /**
    * Enables corner cutting in diagonal movement.
    **/
    this.enableCornerCutting = function() {
        allowCornerCutting = true;
    };

    /**
    * Disables corner cutting in diagonal movement.
    **/
    this.disableCornerCutting = function() {
        allowCornerCutting = false;
    };

    /**
    * Stop avoiding all additional points on the grid.
    **/
    this.stopAvoidingAllAdditionalPoints = function() {
        pointsToAvoid = {};
    };

    /**
    * Find a path.
    *
    * @param {Number} startX The X position of the starting point.
    * @param {Number} startY The Y position of the starting point.
    * @param {Number} endX The X position of the ending point.
    * @param {Number} endY The Y position of the ending point.
    * @param {Function} callback A function that is called when your path
    * is found, or no path is found.
    * @return {Number} A numeric, non-zero value which identifies the created instance. This value can be passed to cancelPath to cancel the path calculation.
    *
    **/
    this.findPath = function(startX, startY, endX, endY, callback) {
        // Wraps the callback for sync vs async logic
        var callbackWrapper = function(result) {
            if (syncEnabled) {
                callback(result);
            } else {
                setTimeout(function() {
                    callback(result);
                });
            }
        }

        // No acceptable tiles were set
        if (acceptableTiles === undefined) {
            throw new Error("You can't set a path without first calling setAcceptableTiles() on EasyStar.");
        }
        // No grid was set
        if (collisionGrid === undefined) {
            throw new Error("You can't set a path without first calling setGrid() on EasyStar.");
        }

        // Start or endpoint outside of scope.
        if (startX < 0 || startY < 0 || endX < 0 || endY < 0 ||
        startX > collisionGrid[0].length-1 || startY > collisionGrid.length-1 ||
        endX > collisionGrid[0].length-1 || endY > collisionGrid.length-1) {
            throw new Error("Your start or end point is outside the scope of your grid.");
        }

        // Start and end are the same tile.
        if (startX===endX && startY===endY) {
            callbackWrapper([]);
            return;
        }

        // End point is not an acceptable tile.
        var endTile = collisionGrid[endY][endX];
        var isAcceptable = false;
        for (var i = 0; i < acceptableTiles.length; i++) {
            if (endTile === acceptableTiles[i]) {
                isAcceptable = true;
                break;
            }
        }

        if (isAcceptable === false) {
            callbackWrapper(null);
            return;
        }

        // Create the instance
        var instance = new Instance();
        instance.openList = new Heap(function(nodeA, nodeB) {
            return nodeA.bestGuessDistance() - nodeB.bestGuessDistance();
        });
        instance.isDoneCalculating = false;
        instance.nodeHash = {};
        instance.startX = startX;
        instance.startY = startY;
        instance.endX = endX;
        instance.endY = endY;
        instance.callback = callbackWrapper;

        instance.openList.push(coordinateToNode(instance, instance.startX,
            instance.startY, null, STRAIGHT_COST));

        var instanceId = nextInstanceId ++;
        instances[instanceId] = instance;
        instanceQueue.push(instanceId);
        return instanceId;
    };

    /**
     * Cancel a path calculation.
     *
     * @param {Number} instanceId The instance ID of the path being calculated
     * @return {Boolean} True if an instance was found and cancelled.
     *
     **/
    this.cancelPath = function(instanceId) {
        if (instanceId in instances) {
            delete instances[instanceId];
            // No need to remove it from instanceQueue
            return true;
        }
        return false;
    };

    /**
    * This method steps through the A* Algorithm in an attempt to
    * find your path(s). It will search 4-8 tiles (depending on diagonals) for every calculation.
    * You can change the number of calculations done in a call by using
    * easystar.setIteratonsPerCalculation().
    **/
    this.calculate = function() {
        if (instanceQueue.length === 0 || collisionGrid === undefined || acceptableTiles === undefined) {
            return;
        }
        for (iterationsSoFar = 0; iterationsSoFar < iterationsPerCalculation; iterationsSoFar++) {
            if (instanceQueue.length === 0) {
                return;
            }

            if (syncEnabled) {
                // If this is a sync instance, we want to make sure that it calculates synchronously.
                iterationsSoFar = 0;
            }

            var instanceId = instanceQueue[0];
            var instance = instances[instanceId];
            if (typeof instance == 'undefined') {
                // This instance was cancelled
                instanceQueue.shift();
                continue;
            }

            // Couldn't find a path.
            if (instance.openList.size() === 0) {
                instance.callback(null);
                delete instances[instanceId];
                instanceQueue.shift();
                continue;
            }

            var searchNode = instance.openList.pop();

            // Handles the case where we have found the destination
            if (instance.endX === searchNode.x && instance.endY === searchNode.y) {
                var path = [];
                path.push({x: searchNode.x, y: searchNode.y});
                var parent = searchNode.parent;
                while (parent!=null) {
                    path.push({x: parent.x, y:parent.y});
                    parent = parent.parent;
                }
                path.reverse();
                var ip = path;
                instance.callback(ip);
                delete instances[instanceId];
                instanceQueue.shift();
                continue;
            }

            searchNode.list = CLOSED_LIST;

            if (searchNode.y > 0) {
                checkAdjacentNode(instance, searchNode,
                    0, -1, STRAIGHT_COST * getTileCost(searchNode.x, searchNode.y-1));
            }
            if (searchNode.x < collisionGrid[0].length-1) {
                checkAdjacentNode(instance, searchNode,
                    1, 0, STRAIGHT_COST * getTileCost(searchNode.x+1, searchNode.y));
            }
            if (searchNode.y < collisionGrid.length-1) {
                checkAdjacentNode(instance, searchNode,
                    0, 1, STRAIGHT_COST * getTileCost(searchNode.x, searchNode.y+1));
            }
            if (searchNode.x > 0) {
                checkAdjacentNode(instance, searchNode,
                    -1, 0, STRAIGHT_COST * getTileCost(searchNode.x-1, searchNode.y));
            }
            if (diagonalsEnabled) {
                if (searchNode.x > 0 && searchNode.y > 0) {

                    if (allowCornerCutting ||
                        (isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y-1) &&
                        isTileWalkable(collisionGrid, acceptableTiles, searchNode.x-1, searchNode.y))) {

                        checkAdjacentNode(instance, searchNode,
                            -1, -1, DIAGONAL_COST * getTileCost(searchNode.x-1, searchNode.y-1));
                    }
                }
                if (searchNode.x < collisionGrid[0].length-1 && searchNode.y < collisionGrid.length-1) {

                    if (allowCornerCutting ||
                        (isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y+1) &&
                        isTileWalkable(collisionGrid, acceptableTiles, searchNode.x+1, searchNode.y))) {

                        checkAdjacentNode(instance, searchNode,
                            1, 1, DIAGONAL_COST * getTileCost(searchNode.x+1, searchNode.y+1));
                    }
                }
                if (searchNode.x < collisionGrid[0].length-1 && searchNode.y > 0) {

                    if (allowCornerCutting ||
                        (isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y-1) &&
                        isTileWalkable(collisionGrid, acceptableTiles, searchNode.x+1, searchNode.y))) {

                        checkAdjacentNode(instance, searchNode,
                            1, -1, DIAGONAL_COST * getTileCost(searchNode.x+1, searchNode.y-1));
                    }
                }
                if (searchNode.x > 0 && searchNode.y < collisionGrid.length-1) {

                    if (allowCornerCutting ||
                        (isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y+1) &&
                        isTileWalkable(collisionGrid, acceptableTiles, searchNode.x-1, searchNode.y))) {

                        checkAdjacentNode(instance, searchNode,
                            -1, 1, DIAGONAL_COST * getTileCost(searchNode.x-1, searchNode.y+1));
                    }
                }
            }

        }
    };

    // Private methods follow
    var checkAdjacentNode = function(instance, searchNode, x, y, cost) {
        var adjacentCoordinateX = searchNode.x+x;
        var adjacentCoordinateY = searchNode.y+y;

        if ((pointsToAvoid[adjacentCoordinateY] === undefined ||
             pointsToAvoid[adjacentCoordinateY][adjacentCoordinateX] === undefined) &&
            isTileWalkable(collisionGrid, acceptableTiles, adjacentCoordinateX, adjacentCoordinateY, searchNode)) {
            var node = coordinateToNode(instance, adjacentCoordinateX,
                adjacentCoordinateY, searchNode, cost);

            if (node.list === undefined) {
                node.list = OPEN_LIST;
                instance.openList.push(node);
            } else if (searchNode.costSoFar + cost < node.costSoFar) {
                node.costSoFar = searchNode.costSoFar + cost;
                node.parent = searchNode;
                instance.openList.updateItem(node);
            }
        }
    };

    // Helpers
    var isTileWalkable = function(collisionGrid, acceptableTiles, x, y, sourceNode) {
        var directionalCondition = directionalConditions[y] && directionalConditions[y][x];
        if (directionalCondition) {
            var direction = calculateDirection(sourceNode.x - x, sourceNode.y - y)
            var directionIncluded = function () {
                for (var i = 0; i < directionalCondition.length; i++) {
                    if (directionalCondition[i] === direction) return true
                }
                return false
            }
            if (!directionIncluded()) return false
        }
        for (var i = 0; i < acceptableTiles.length; i++) {
            if (collisionGrid[y][x] === acceptableTiles[i]) {
                return true;
            }
        }

        return false;
    };

    /**
     * -1, -1 | 0, -1  | 1, -1
     * -1,  0 | SOURCE | 1,  0
     * -1,  1 | 0,  1  | 1,  1
     */
    var calculateDirection = function (diffX, diffY) {
        if (diffX === 0 && diffY === -1) return EasyStar.TOP
        else if (diffX === 1 && diffY === -1) return EasyStar.TOP_RIGHT
        else if (diffX === 1 && diffY === 0) return EasyStar.RIGHT
        else if (diffX === 1 && diffY === 1) return EasyStar.BOTTOM_RIGHT
        else if (diffX === 0 && diffY === 1) return EasyStar.BOTTOM
        else if (diffX === -1 && diffY === 1) return EasyStar.BOTTOM_LEFT
        else if (diffX === -1 && diffY === 0) return EasyStar.LEFT
        else if (diffX === -1 && diffY === -1) return EasyStar.TOP_LEFT
        throw new Error('These differences are not valid: ' + diffX + ', ' + diffY)
    };

    var getTileCost = function(x, y) {
        return (pointsToCost[y] && pointsToCost[y][x]) || costMap[collisionGrid[y][x]]
    };

    var coordinateToNode = function(instance, x, y, parent, cost) {
        if (instance.nodeHash[y] !== undefined) {
            if (instance.nodeHash[y][x] !== undefined) {
                return instance.nodeHash[y][x];
            }
        } else {
            instance.nodeHash[y] = {};
        }
        var simpleDistanceToTarget = getDistance(x, y, instance.endX, instance.endY);
        if (parent!==null) {
            var costSoFar = parent.costSoFar + cost;
        } else {
            costSoFar = 0;
        }
        var node = new Node(parent,x,y,costSoFar,simpleDistanceToTarget);
        instance.nodeHash[y][x] = node;
        return node;
    };

    var getDistance = function(x1,y1,x2,y2) {
        if (diagonalsEnabled) {
            // Octile distance
            var dx = Math.abs(x1 - x2);
            var dy = Math.abs(y1 - y2);
            if (dx < dy) {
                return DIAGONAL_COST * dx + dy;
            } else {
                return DIAGONAL_COST * dy + dx;
            }
        } else {
            // Manhattan distance
            var dx = Math.abs(x1 - x2);
            var dy = Math.abs(y1 - y2);
            return (dx + dy);
        }
    };
}

EasyStar.TOP = 'TOP'
EasyStar.TOP_RIGHT = 'TOP_RIGHT'
EasyStar.RIGHT = 'RIGHT'
EasyStar.BOTTOM_RIGHT = 'BOTTOM_RIGHT'
EasyStar.BOTTOM = 'BOTTOM'
EasyStar.BOTTOM_LEFT = 'BOTTOM_LEFT'
EasyStar.LEFT = 'LEFT'
EasyStar.TOP_LEFT = 'TOP_LEFT'


/***/ }),
/* 24 */
/***/ (function(module, exports) {

/**
 * Represents a single instance of EasyStar.
 * A path that is in the queue to eventually be found.
 */
module.exports = function() {
    this.pointsToAvoid = {};
    this.startX;
    this.callback;
    this.startY;
    this.endX;
    this.endY;
    this.nodeHash = {};
    this.openList;
};

/***/ }),
/* 25 */
/***/ (function(module, exports) {

/**
* A simple Node that represents a single tile on the grid.
* @param {Object} parent The parent node.
* @param {Number} x The x position on the grid.
* @param {Number} y The y position on the grid.
* @param {Number} costSoFar How far this node is in moves*cost from the start.
* @param {Number} simpleDistanceToTarget Manhatten distance to the end point.
**/
module.exports = function(parent, x, y, costSoFar, simpleDistanceToTarget) {
    this.parent = parent;
    this.x = x;
    this.y = y;
    this.costSoFar = costSoFar;
    this.simpleDistanceToTarget = simpleDistanceToTarget;

    /**
    * @return {Number} Best guess distance of a cost using this node.
    **/
    this.bestGuessDistance = function() {
        return this.costSoFar + this.simpleDistanceToTarget;
    }
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(27);


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Generated by CoffeeScript 1.8.0
(function() {
  var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;

  floor = Math.floor, min = Math.min;


  /*
  Default comparison function to be used
   */

  defaultCmp = function(x, y) {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  };


  /*
  Insert item x in list a, and keep it sorted assuming a is sorted.
  
  If x is already in a, insert it to the right of the rightmost x.
  
  Optional args lo (default 0) and hi (default a.length) bound the slice
  of a to be searched.
   */

  insort = function(a, x, lo, hi, cmp) {
    var mid;
    if (lo == null) {
      lo = 0;
    }
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (lo < 0) {
      throw new Error('lo must be non-negative');
    }
    if (hi == null) {
      hi = a.length;
    }
    while (lo < hi) {
      mid = floor((lo + hi) / 2);
      if (cmp(x, a[mid]) < 0) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }
    return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
  };


  /*
  Push item onto heap, maintaining the heap invariant.
   */

  heappush = function(array, item, cmp) {
    if (cmp == null) {
      cmp = defaultCmp;
    }
    array.push(item);
    return _siftdown(array, 0, array.length - 1, cmp);
  };


  /*
  Pop the smallest item off the heap, maintaining the heap invariant.
   */

  heappop = function(array, cmp) {
    var lastelt, returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    lastelt = array.pop();
    if (array.length) {
      returnitem = array[0];
      array[0] = lastelt;
      _siftup(array, 0, cmp);
    } else {
      returnitem = lastelt;
    }
    return returnitem;
  };


  /*
  Pop and return the current smallest value, and add the new item.
  
  This is more efficient than heappop() followed by heappush(), and can be
  more appropriate when using a fixed size heap. Note that the value
  returned may be larger than item! That constrains reasonable use of
  this routine unless written as part of a conditional replacement:
      if item > array[0]
        item = heapreplace(array, item)
   */

  heapreplace = function(array, item, cmp) {
    var returnitem;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    returnitem = array[0];
    array[0] = item;
    _siftup(array, 0, cmp);
    return returnitem;
  };


  /*
  Fast version of a heappush followed by a heappop.
   */

  heappushpop = function(array, item, cmp) {
    var _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (array.length && cmp(array[0], item) < 0) {
      _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
      _siftup(array, 0, cmp);
    }
    return item;
  };


  /*
  Transform list into a heap, in-place, in O(array.length) time.
   */

  heapify = function(array, cmp) {
    var i, _i, _j, _len, _ref, _ref1, _results, _results1;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    _ref1 = (function() {
      _results1 = [];
      for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }
      return _results1;
    }).apply(this).reverse();
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      i = _ref1[_i];
      _results.push(_siftup(array, i, cmp));
    }
    return _results;
  };


  /*
  Update the position of the given item in the heap.
  This function should be called every time the item is being modified.
   */

  updateItem = function(array, item, cmp) {
    var pos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    pos = array.indexOf(item);
    if (pos === -1) {
      return;
    }
    _siftdown(array, 0, pos, cmp);
    return _siftup(array, pos, cmp);
  };


  /*
  Find the n largest elements in a dataset.
   */

  nlargest = function(array, n, cmp) {
    var elem, result, _i, _len, _ref;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    result = array.slice(0, n);
    if (!result.length) {
      return result;
    }
    heapify(result, cmp);
    _ref = array.slice(n);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      heappushpop(result, elem, cmp);
    }
    return result.sort(cmp).reverse();
  };


  /*
  Find the n smallest elements in a dataset.
   */

  nsmallest = function(array, n, cmp) {
    var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    if (n * 10 <= array.length) {
      result = array.slice(0, n).sort(cmp);
      if (!result.length) {
        return result;
      }
      los = result[result.length - 1];
      _ref = array.slice(n);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        if (cmp(elem, los) < 0) {
          insort(result, elem, 0, null, cmp);
          result.pop();
          los = result[result.length - 1];
        }
      }
      return result;
    }
    heapify(array, cmp);
    _results = [];
    for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      _results.push(heappop(array, cmp));
    }
    return _results;
  };

  _siftdown = function(array, startpos, pos, cmp) {
    var newitem, parent, parentpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    newitem = array[pos];
    while (pos > startpos) {
      parentpos = (pos - 1) >> 1;
      parent = array[parentpos];
      if (cmp(newitem, parent) < 0) {
        array[pos] = parent;
        pos = parentpos;
        continue;
      }
      break;
    }
    return array[pos] = newitem;
  };

  _siftup = function(array, pos, cmp) {
    var childpos, endpos, newitem, rightpos, startpos;
    if (cmp == null) {
      cmp = defaultCmp;
    }
    endpos = array.length;
    startpos = pos;
    newitem = array[pos];
    childpos = 2 * pos + 1;
    while (childpos < endpos) {
      rightpos = childpos + 1;
      if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
        childpos = rightpos;
      }
      array[pos] = array[childpos];
      pos = childpos;
      childpos = 2 * pos + 1;
    }
    array[pos] = newitem;
    return _siftdown(array, startpos, pos, cmp);
  };

  Heap = (function() {
    Heap.push = heappush;

    Heap.pop = heappop;

    Heap.replace = heapreplace;

    Heap.pushpop = heappushpop;

    Heap.heapify = heapify;

    Heap.updateItem = updateItem;

    Heap.nlargest = nlargest;

    Heap.nsmallest = nsmallest;

    function Heap(cmp) {
      this.cmp = cmp != null ? cmp : defaultCmp;
      this.nodes = [];
    }

    Heap.prototype.push = function(x) {
      return heappush(this.nodes, x, this.cmp);
    };

    Heap.prototype.pop = function() {
      return heappop(this.nodes, this.cmp);
    };

    Heap.prototype.peek = function() {
      return this.nodes[0];
    };

    Heap.prototype.contains = function(x) {
      return this.nodes.indexOf(x) !== -1;
    };

    Heap.prototype.replace = function(x) {
      return heapreplace(this.nodes, x, this.cmp);
    };

    Heap.prototype.pushpop = function(x) {
      return heappushpop(this.nodes, x, this.cmp);
    };

    Heap.prototype.heapify = function() {
      return heapify(this.nodes, this.cmp);
    };

    Heap.prototype.updateItem = function(x) {
      return updateItem(this.nodes, x, this.cmp);
    };

    Heap.prototype.clear = function() {
      return this.nodes = [];
    };

    Heap.prototype.empty = function() {
      return this.nodes.length === 0;
    };

    Heap.prototype.size = function() {
      return this.nodes.length;
    };

    Heap.prototype.clone = function() {
      var heap;
      heap = new Heap();
      heap.nodes = this.nodes.slice(0);
      return heap;
    };

    Heap.prototype.toArray = function() {
      return this.nodes.slice(0);
    };

    Heap.prototype.insert = Heap.prototype.push;

    Heap.prototype.top = Heap.prototype.peek;

    Heap.prototype.front = Heap.prototype.peek;

    Heap.prototype.has = Heap.prototype.contains;

    Heap.prototype.copy = Heap.prototype.clone;

    return Heap;

  })();

  (function(root, factory) {
    if (true) {
      return !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports === 'object') {
      return module.exports = factory();
    } else {
      return root.Heap = factory();
    }
  })(this, function() {
    return Heap;
  });

}).call(this);


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @see https://gamedevelopment.tutsplus.com/tutorials/finite-state-machines-theory-and-implementation--gamedev-11867
 */
class StackFSM {
    constructor() {
        this.stack = [];
    }
    update() {
        const currentState = this.getCurrentState();
        const currentStateFunction = currentState.getFunc();
        if (currentStateFunction != null) {
            currentStateFunction();
        }
    }
    popState() {
        return this.stack.pop();
    }
    pushState(state) {
        if (this.getCurrentState() != state) {
            this.stack.push(state);
        }
    }
    getCurrentState() {
        return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
    }
}
exports.StackFSM = StackFSM;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class FogOfWar {
    apply(bitmap, knownGrounds) {
        for (let y = 0; y < knownGrounds.length; y++) {
            for (let x = 0; x < knownGrounds[y].length; x++) {
                const unknownGround = !knownGrounds[y][x];
                let red = 0;
                let green = 0;
                let blue = 0;
                if (unknownGround) {
                    bitmap.setPixel32(x, y, red, green, blue, 255);
                }
                else {
                    bitmap.setPixel32(x, y, red, green, blue, 0);
                }
            }
        }
    }
}
exports.FogOfWar = FogOfWar;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Map {
    constructor(group, tilemap, grounds, tilesize) {
        this.tilemap = tilemap;
        this.grounds = grounds;
        this.tilesize = tilesize;
        this.tiles = tilemap.layers[0].data;
        this.walkableIndexes = this.prepareWalkableIndexes(this.getUnwalkableIndexes());
        this.configureCollisionLayer(this.tilemap, this.getUnwalkableIndexes());
        this.collisionlayer = this.tilemap.createLayer(Map.LAYER_NAME, tilemap.layers[0].width, tilemap.layers[0].height, group);
    }
    prepareWalkableIndexes(unwalkableIndexes) {
        const maxIndex = 400;
        let walkable = [];
        for (let index = 1; index < maxIndex; index++) {
            walkable.push(index);
        }
        walkable.filter(x => unwalkableIndexes.indexOf(x) == -1);
        return walkable;
    }
    configureCollisionLayer(tilemap, unwalkableIndexes) {
        tilemap.setCollision(unwalkableIndexes);
    }
    getTilemap() {
        return this.tilemap;
    }
    getGrounds() {
        return this.grounds;
    }
    getTiles() {
        return this.tiles;
    }
    getTileSize() {
        return this.tilesize;
    }
    getCollisionLayer() {
        return this.collisionlayer;
    }
    getWalkableIndexes() {
        return this.walkableIndexes;
    }
    getUnwalkableIndexes() {
        return [
            1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 14, 15,
            31, 32, 33, 34, 36, 37, 38, 39, 40, 42, 44, 45,
            // 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70
            // 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 89, 90, 91, 92, 93, 94, 95, 96,
            // 97, 98, 99, 100, 101, 102, 103,
            104, 105, 106, 107, 108, 109, 110, 111,
            112, 113, 114, 116, 118, 120, 121, 122, 125, 126, 129, 130,
            147, 148, 149, 150, 152, 153, 154, 155, 157, 158, 160, 161,
            162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 175, 176,
            177, 178, 179, 185, 186, 188, 189, 190,
            200, 201, 202, 203, 204, 205 // Mountain deco
        ];
    }
}
Map.LAYER_NAME = 'Tiles';
exports.Map = Map;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const MapGenerator_1 = __webpack_require__(32);
const Tile_1 = __webpack_require__(5);
const TilesRegistry_1 = __webpack_require__(34);
const Map_1 = __webpack_require__(30);
const MissingTextureFixer_1 = __webpack_require__(33);
const tileSize = 20;
const tileSpacing = 20;
const MIN_POWER = 2;
const MAX_POWER = 3;
const RADIUS = 1; // Specify the smooth. 0.001 = big smooth, infinite = no smooth.
class CloudMapGenerator extends MapGenerator_1.MapGenerator {
    constructor(group, screenWidth, screenHeight, tilesize, emptyAreas, randomGenerator) {
        super(group, screenWidth, screenHeight, tilesize);
        this.tileRegistry = new TilesRegistry_1.TileRegistry();
        this.emptyAreas = emptyAreas;
        this.randomGenerator = randomGenerator;
    }
    generate() {
        const map = this.group.game.add.tilemap(null, tileSize, tileSize, this.screenWidth / tileSize, this.screenHeight / tileSize);
        map.removeAllLayers();
        map.createBlankLayer(Map_1.Map.LAYER_NAME, this.screenWidth / tileSize, this.screenHeight / tileSize, tileSize, tileSize, this.group);
        this.addTileSets(map);
        let mapHeight = Math.floor(this.screenHeight / Math.pow(2, MAX_POWER));
        let mapWidth = Math.floor(this.screenWidth / Math.pow(2, MAX_POWER));
        let cloudMaps = this.generateCloudMaps(mapWidth, mapHeight);
        let points = this.mixCloudMaps(cloudMaps);
        let grounds = this.getGrounds(points);
        grounds = MissingTextureFixer_1.MissingTextureFixer.fix(grounds, this.tileRegistry);
        this.draw(map, grounds);
        // remove useless columns and rows
        const numberColumns = map.width;
        const numberRows = map.height;
        const reducedGrounds = grounds.reduce(function (rows, row) {
            rows.push(row.slice(0, numberColumns));
            return rows;
        }, []).slice(0, numberRows);
        return new Map_1.Map(this.group, map, reducedGrounds, this.tilesize);
    }
    /**
     * Adds the tilesets used for this map generation, and the associated tiles for the tiles registry.
     *
     * @param map
     */
    addTileSets(map) {
        map.addTilesetImage('GrasClif', 'GrasClif', tileSize, tileSize, 0, tileSpacing, 31);
        this.tileRegistry.addTile(new Tile_1.Tile(35, Tile_1.Tile.GRASS, Tile_1.Tile.GRASS, Tile_1.Tile.GRASS, Tile_1.Tile.GRASS));
        map.addTilesetImage('Grs2Mnt', 'Grs2Mnt', tileSize, tileSize, 0, tileSpacing, 132);
        this.tileRegistry.addTile(new Tile_1.Tile(132, Tile_1.Tile.MNT, Tile_1.Tile.MNT, Tile_1.Tile.GRASS, Tile_1.Tile.MNT));
        this.tileRegistry.addTile(new Tile_1.Tile(133, Tile_1.Tile.MNT, Tile_1.Tile.MNT, Tile_1.Tile.GRASS, Tile_1.Tile.GRASS));
        this.tileRegistry.addTile(new Tile_1.Tile(134, Tile_1.Tile.MNT, Tile_1.Tile.MNT, Tile_1.Tile.MNT, Tile_1.Tile.GRASS));
        this.tileRegistry.addTile(new Tile_1.Tile(135, Tile_1.Tile.MNT, Tile_1.Tile.GRASS, Tile_1.Tile.GRASS, Tile_1.Tile.MNT));
        this.tileRegistry.addTile(new Tile_1.Tile(136, Tile_1.Tile.MNT, Tile_1.Tile.MNT, Tile_1.Tile.MNT, Tile_1.Tile.MNT));
        this.tileRegistry.addTile(new Tile_1.Tile(137, Tile_1.Tile.GRASS, Tile_1.Tile.MNT, Tile_1.Tile.MNT, Tile_1.Tile.GRASS));
        this.tileRegistry.addTile(new Tile_1.Tile(138, Tile_1.Tile.MNT, Tile_1.Tile.GRASS, Tile_1.Tile.MNT, Tile_1.Tile.MNT));
        this.tileRegistry.addTile(new Tile_1.Tile(139, Tile_1.Tile.GRASS, Tile_1.Tile.GRASS, Tile_1.Tile.MNT, Tile_1.Tile.MNT));
        this.tileRegistry.addTile(new Tile_1.Tile(140, Tile_1.Tile.GRASS, Tile_1.Tile.MNT, Tile_1.Tile.MNT, Tile_1.Tile.MNT));
        this.tileRegistry.addTile(new Tile_1.Tile(142, Tile_1.Tile.MNT, Tile_1.Tile.GRASS, Tile_1.Tile.GRASS, Tile_1.Tile.GRASS));
        this.tileRegistry.addTile(new Tile_1.Tile(143, Tile_1.Tile.GRASS, Tile_1.Tile.MNT, Tile_1.Tile.GRASS, Tile_1.Tile.GRASS));
        this.tileRegistry.addTile(new Tile_1.Tile(145, Tile_1.Tile.GRASS, Tile_1.Tile.GRASS, Tile_1.Tile.GRASS, Tile_1.Tile.MNT));
        this.tileRegistry.addTile(new Tile_1.Tile(146, Tile_1.Tile.GRASS, Tile_1.Tile.GRASS, Tile_1.Tile.MNT, Tile_1.Tile.GRASS));
        map.addTilesetImage('Grss2Lav', 'Grss2Lav', tileSize, tileSize, 0, tileSpacing, 162);
        this.tileRegistry.addTile(new Tile_1.Tile(162, Tile_1.Tile.GRASS, Tile_1.Tile.GRASS, Tile_1.Tile.LAVA, Tile_1.Tile.GRASS));
        this.tileRegistry.addTile(new Tile_1.Tile(163, Tile_1.Tile.GRASS, Tile_1.Tile.GRASS, Tile_1.Tile.LAVA, Tile_1.Tile.LAVA));
        this.tileRegistry.addTile(new Tile_1.Tile(164, Tile_1.Tile.GRASS, Tile_1.Tile.GRASS, Tile_1.Tile.GRASS, Tile_1.Tile.LAVA));
        this.tileRegistry.addTile(new Tile_1.Tile(165, Tile_1.Tile.GRASS, Tile_1.Tile.LAVA, Tile_1.Tile.LAVA, Tile_1.Tile.GRASS));
        this.tileRegistry.addTile(new Tile_1.Tile(166, Tile_1.Tile.LAVA, Tile_1.Tile.LAVA, Tile_1.Tile.LAVA, Tile_1.Tile.LAVA));
        this.tileRegistry.addTile(new Tile_1.Tile(167, Tile_1.Tile.LAVA, Tile_1.Tile.GRASS, Tile_1.Tile.GRASS, Tile_1.Tile.LAVA));
        this.tileRegistry.addTile(new Tile_1.Tile(168, Tile_1.Tile.GRASS, Tile_1.Tile.LAVA, Tile_1.Tile.GRASS, Tile_1.Tile.GRASS));
        this.tileRegistry.addTile(new Tile_1.Tile(169, Tile_1.Tile.LAVA, Tile_1.Tile.LAVA, Tile_1.Tile.GRASS, Tile_1.Tile.GRASS));
        this.tileRegistry.addTile(new Tile_1.Tile(170, Tile_1.Tile.LAVA, Tile_1.Tile.GRASS, Tile_1.Tile.GRASS, Tile_1.Tile.GRASS));
        this.tileRegistry.addTile(new Tile_1.Tile(172, Tile_1.Tile.GRASS, Tile_1.Tile.LAVA, Tile_1.Tile.LAVA, Tile_1.Tile.LAVA));
        this.tileRegistry.addTile(new Tile_1.Tile(173, Tile_1.Tile.LAVA, Tile_1.Tile.GRASS, Tile_1.Tile.LAVA, Tile_1.Tile.LAVA));
        this.tileRegistry.addTile(new Tile_1.Tile(175, Tile_1.Tile.LAVA, Tile_1.Tile.LAVA, Tile_1.Tile.LAVA, Tile_1.Tile.GRASS));
        this.tileRegistry.addTile(new Tile_1.Tile(176, Tile_1.Tile.LAVA, Tile_1.Tile.LAVA, Tile_1.Tile.GRASS, Tile_1.Tile.LAVA));
        map.addTilesetImage('Snw2Mnt', 'Snw2Mnt', tileSize, tileSize, 0, tileSpacing, 252);
        this.tileRegistry.addTile(new Tile_1.Tile(252, Tile_1.Tile.MNT, Tile_1.Tile.MNT, Tile_1.Tile.SNOW, Tile_1.Tile.MNT));
        this.tileRegistry.addTile(new Tile_1.Tile(253, Tile_1.Tile.MNT, Tile_1.Tile.MNT, Tile_1.Tile.SNOW, Tile_1.Tile.SNOW));
        this.tileRegistry.addTile(new Tile_1.Tile(254, Tile_1.Tile.MNT, Tile_1.Tile.MNT, Tile_1.Tile.MNT, Tile_1.Tile.SNOW));
        this.tileRegistry.addTile(new Tile_1.Tile(255, Tile_1.Tile.MNT, Tile_1.Tile.SNOW, Tile_1.Tile.SNOW, Tile_1.Tile.MNT));
        this.tileRegistry.addTile(new Tile_1.Tile(256, Tile_1.Tile.SNOW, Tile_1.Tile.SNOW, Tile_1.Tile.SNOW, Tile_1.Tile.SNOW));
        this.tileRegistry.addTile(new Tile_1.Tile(257, Tile_1.Tile.SNOW, Tile_1.Tile.MNT, Tile_1.Tile.MNT, Tile_1.Tile.SNOW));
        this.tileRegistry.addTile(new Tile_1.Tile(258, Tile_1.Tile.MNT, Tile_1.Tile.SNOW, Tile_1.Tile.MNT, Tile_1.Tile.MNT));
        this.tileRegistry.addTile(new Tile_1.Tile(259, Tile_1.Tile.SNOW, Tile_1.Tile.SNOW, Tile_1.Tile.MNT, Tile_1.Tile.MNT));
        this.tileRegistry.addTile(new Tile_1.Tile(260, Tile_1.Tile.SNOW, Tile_1.Tile.MNT, Tile_1.Tile.MNT, Tile_1.Tile.MNT));
        this.tileRegistry.addTile(new Tile_1.Tile(262, Tile_1.Tile.MNT, Tile_1.Tile.SNOW, Tile_1.Tile.SNOW, Tile_1.Tile.SNOW));
        this.tileRegistry.addTile(new Tile_1.Tile(263, Tile_1.Tile.SNOW, Tile_1.Tile.MNT, Tile_1.Tile.SNOW, Tile_1.Tile.SNOW));
        this.tileRegistry.addTile(new Tile_1.Tile(265, Tile_1.Tile.SNOW, Tile_1.Tile.SNOW, Tile_1.Tile.SNOW, Tile_1.Tile.MNT));
        this.tileRegistry.addTile(new Tile_1.Tile(266, Tile_1.Tile.SNOW, Tile_1.Tile.SNOW, Tile_1.Tile.MNT, Tile_1.Tile.SNOW));
    }
    generateCloudMaps(mapWidth, mapHeight) {
        let cloudMaps = [];
        for (let power = MIN_POWER; power < MAX_POWER; power++) {
            cloudMaps[power] = this.smoothMap(power, this.generateRandomSquares(power, mapWidth, mapHeight));
        }
        return cloudMaps;
    }
    generateRandomSquares(power, mapWidth, mapHeight) {
        let squaresMap = [];
        let blockSize = Math.pow(2, power);
        for (let y = 0; y < mapHeight; y += blockSize) {
            for (let x = 0; x < mapWidth; x += blockSize) {
                let random = Math.round(this.randomGenerator.between(0, 1));
                for (let yi = 0; yi < blockSize; yi++) {
                    for (let xi = 0; xi < blockSize; xi++) {
                        if (undefined === squaresMap[y + yi]) {
                            squaresMap[y + yi] = [];
                        }
                        let predefined = this.containsPredefined(x, y, blockSize, blockSize);
                        squaresMap[y + yi][x + xi] = null !== predefined ? predefined : random;
                    }
                }
            }
        }
        return squaresMap;
    }
    smoothMap(power, rudePoints) {
        let diff = Math.ceil(Math.pow(2, power) / RADIUS);
        let smooth = [];
        for (let y = 0; y < rudePoints.length; y++) {
            for (let x = 0; x < rudePoints[y].length; x++) {
                let sum = 0;
                let count = 0;
                for (let yi = -diff; yi <= diff; yi++) {
                    for (let xi = -diff; xi <= diff; xi++) {
                        if (undefined !== rudePoints[y + yi] && undefined !== rudePoints[y + yi][x + xi]) {
                            sum += rudePoints[y + yi][x + xi];
                            count += 1;
                        }
                    }
                }
                if (undefined === smooth[y]) {
                    smooth[y] = [];
                }
                smooth[y][x] = sum / count;
            }
        }
        return smooth;
    }
    mixCloudMaps(cloudMaps) {
        let points = [];
        for (let y = 0; y < cloudMaps[MIN_POWER].length; y++) {
            for (let x = 0; x < cloudMaps[MIN_POWER][0].length; x++) {
                if (undefined === points[y]) {
                    points[y] = [];
                }
                let sum = 0;
                let count = 0;
                for (let size = MIN_POWER; size < MAX_POWER; size++) {
                    sum += (size + 1) * cloudMaps[size][y][x];
                    count += (size + 1);
                }
                points[y][x] = sum / count;
            }
        }
        return points;
    }
    getGrounds(points) {
        let result = [];
        points.forEach(function (line) {
            let groudLine = [];
            line.forEach(function (cell) {
                groudLine.push(this.getGround(cell));
            }.bind(this));
            result.push(groudLine);
        }.bind(this));
        return result;
    }
    getGround(cell) {
        const probabilities = [
            [Tile_1.Tile.LAVA, 1],
            [Tile_1.Tile.GRASS, 2],
            [Tile_1.Tile.MNT, 1],
            [Tile_1.Tile.SNOW, 2]
        ];
        const sumProbabilities = probabilities.reduce(function (s, probability) {
            return s + probability[1];
        }, 0);
        let counter = 0;
        for (let i = 0; i < probabilities.length; i++) {
            counter += probabilities[i][1] / sumProbabilities;
            if (cell <= counter) {
                return probabilities[i][0];
            }
        }
        return null;
    }
    draw(map, points) {
        points.slice(0, -1).forEach(function (line, y) {
            line.slice(0, -1).forEach(function (cell, x) {
                let tile = this.tileRegistry.find({
                    topLeft: points[y][x],
                    topRight: points[y][x + 1],
                    bottomRight: points[y + 1][x + 1],
                    bottomLeft: points[y + 1][x]
                });
                if (null !== tile) {
                    map.putTile(tile.index, x, y);
                }
            }.bind(this));
        }.bind(this));
    }
    containsPredefined(x, y, blockSizeX, blockSizeY) {
        let points = [];
        this.emptyAreas.forEach(function (center) {
            for (let yi = center.getY() - center.getGap(); yi <= center.getY() + center.getGap(); yi++) {
                for (let xi = center.getX() - center.getGap(); xi <= center.getX() + center.getGap(); xi++) {
                    points.push({ x: xi, y: yi });
                }
            }
        });
        let found = false;
        points.forEach(function (point) {
            if (x < point.x && point.x < (x + blockSizeX) && y < point.y && point.y < (y + blockSizeY)) {
                found = true;
            }
        });
        return found ? 1 : null;
    }
}
exports.CloudMapGenerator = CloudMapGenerator;
class EmptyArea {
    constructor(x, y, gap) {
        this.x = x;
        this.y = y;
        this.gap = gap;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getGap() {
        return this.gap;
    }
}
exports.EmptyArea = EmptyArea;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class MapGenerator {
    constructor(group, screenWidth, screenHeight, tilesize) {
        this.group = group;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.tilesize = tilesize;
    }
}
exports.MapGenerator = MapGenerator;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Tile_1 = __webpack_require__(5);
class MissingTextureFixer {
    static fix(grounds, tileRegistry) {
        let result = grounds;
        let foundMissingTexture = true;
        let remainingTries = 10;
        while (remainingTries > 0 && foundMissingTexture) {
            foundMissingTexture = false;
            let missingTexturePosition = MissingTextureFixer.getNextMissingTexturePosition(result, tileRegistry);
            if (null !== missingTexturePosition) {
                foundMissingTexture = true;
                let foundReplacement = false;
                let gap = 2;
                while (!foundReplacement && gap < 4) {
                    console.log('Missing texture at ' + missingTexturePosition.x + ',' + missingTexturePosition.y + ' - looking with gap ' + gap);
                    let current = this.createTemplate(missingTexturePosition, gap, result);
                    let availableSquares = this.getAvailableSquares(current, tileRegistry);
                    if (availableSquares.length) {
                        foundReplacement = true;
                        let availableSquare = availableSquares[Math.floor(Math.random() * availableSquares.length)];
                        availableSquare.forEach(function (lines, y) {
                            lines.forEach(function (cell, x) {
                                result[y][x] = cell;
                            });
                        });
                    }
                    gap++;
                }
            }
            remainingTries--;
        }
        return result;
    }
    static getNextMissingTexturePosition(grounds, tileRegistry) {
        let result = null;
        grounds.slice(0, -1).forEach(function (line, y) {
            line.slice(0, -1).forEach(function (cell, x) {
                if (null === result) {
                    let tile = tileRegistry.find({
                        topLeft: grounds[y][x],
                        topRight: grounds[y][x + 1],
                        bottomRight: grounds[y + 1][x + 1],
                        bottomLeft: grounds[y + 1][x]
                    });
                    if (null === tile) {
                        result = new Phaser.Point(x, y);
                    }
                }
            });
        });
        return result;
    }
    static getAvailableSquares(current, tileRegistry) {
        let results = [];
        let nextX = null;
        let nextY = null;
        current.forEach(function (lines, y) {
            lines.forEach(function (cell, x) {
                if (null === nextX && null === nextY && null === current[y][x]) {
                    nextX = x;
                    nextY = y;
                }
            });
        });
        if (null === nextX && null === nextY) {
            return [current];
        }
        for (let i = 0; i < this.availableGrounds.length; i++) {
            let temp = MissingTextureFixer.cloneArray(current);
            temp[nextY][nextX] = this.availableGrounds[i];
            if (MissingTextureFixer.isValidTemp(temp, tileRegistry)) {
                results = results.concat(this.getAvailableSquares(temp, tileRegistry));
                if (results.length && this.isFull(results[0])) {
                    return [results[0]];
                }
            }
        }
        return results;
    }
    static isFull(matrix) {
        let result = true;
        matrix.forEach(function (lines) {
            lines.forEach(function (cell) {
                result = result && (cell !== null);
            });
        });
        return result;
    }
    static cloneArray(matrix) {
        let result = [];
        matrix.forEach(function (lines, y) {
            result[y] = [];
            lines.forEach(function (cell, x) {
                result[y][x] = cell;
            });
        });
        return result;
    }
    static get availableGrounds() {
        return [Tile_1.Tile.LAVA, Tile_1.Tile.GRASS, Tile_1.Tile.MNT, Tile_1.Tile.SNOW, 2];
    }
    static isValidTemp(temp, tileRegistry) {
        let valid = true;
        temp.slice(0, -1).forEach(function (lines, y) {
            lines.slice(0, -1).forEach(function (cell, x) {
                if (null !== temp[y][x] &&
                    null !== temp[y][x + 1] &&
                    null !== temp[y + 1][x + 1] &&
                    null !== temp[y + 1][x]) {
                    let tile = tileRegistry.find({
                        topLeft: temp[y][x],
                        topRight: temp[y][x + 1],
                        bottomRight: temp[y + 1][x + 1],
                        bottomLeft: temp[y + 1][x]
                    });
                    valid = valid && (tile !== null);
                }
            });
        });
        return valid;
    }
    static createTemplate(missingTexturePosition, gap, result) {
        let current = [];
        let topY = Math.max(0, missingTexturePosition.y - gap);
        let bottomY = Math.min(result.length, missingTexturePosition.y + gap);
        let leftX = Math.max(0, missingTexturePosition.x - gap);
        let rightX = Math.min(result[0].length, missingTexturePosition.x + gap);
        for (let y = topY; y <= bottomY; y++) {
            current[y] = [];
            for (let x = leftX; x <= rightX; x++) {
                if (y === topY || y === bottomY || x === leftX || x === rightX) {
                    current[y][x] = result[y][x];
                }
                else {
                    current[y][x] = null;
                }
            }
        }
        return current;
    }
}
exports.MissingTextureFixer = MissingTextureFixer;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Tile_1 = __webpack_require__(5);
class TileRegistry {
    constructor() {
        this.tiles = [];
    }
    addTile(tile) {
        this.tiles.push(tile);
    }
    findAll(param) {
        return this.tiles.filter(function (tile) {
            if (param.topLeft && tile.topLeft !== param.topLeft) {
                return false;
            }
            if (param.topRight && tile.topRight !== param.topRight) {
                return false;
            }
            if (param.bottomRight && tile.bottomRight !== param.bottomRight) {
                return false;
            }
            if (param.bottomLeft && tile.bottomLeft !== param.bottomLeft) {
                return false;
            }
            return true;
        });
    }
    find(param) {
        let tiles = this.findAll(param);
        return tiles.length > 0 ? tiles[0] : null;
    }
    /**
     * Returns the closes tile from this one having the same topRight, bottomRight and bottomLeft.
     * If no tile is found, returns a non existing one.
     *
     * @param topLeft
     * @param topRight
     * @param bottomRight
     * @param bottomLeft
     * @return number
     */
    getClosestTileIndex(topLeft, topRight, bottomRight, bottomLeft) {
        let possibleIndexes = this.findAll({
            topRight: topRight,
            bottomRight: bottomRight,
            bottomLeft: bottomLeft
        }).filter(function (tile) {
            return tile.topLeft !== topLeft;
        }).map(function (tile) {
            return tile.topLeft;
        });
        if (possibleIndexes.length === 0) {
            possibleIndexes = Tile_1.Tile.GROUNDS.filter(function (index) {
                return index !== topLeft;
            });
        }
        return possibleIndexes[Math.floor(Math.random() * possibleIndexes.length)];
    }
}
exports.TileRegistry = TileRegistry;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class PhaserPointPath {
    constructor(nodes = []) {
        this.nodes = nodes;
    }
    getNodes() {
        return this.nodes;
    }
    lastNode() {
        return this.nodes.length > 0 ? this.nodes[this.nodes.length - 1] : null;
    }
}
exports.PhaserPointPath = PhaserPointPath;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const TilePosition_1 = __webpack_require__(16);
/**
 * Path of TilePosition
 */
class TilePositionPath {
    constructor(rawPositions) {
        this.nodes = [];
        for (let i = 0; i < rawPositions.length; i++) {
            this.nodes[i] = new TilePosition_1.TilePosition(rawPositions[i].x, rawPositions[i].y);
        }
    }
    shift() {
        if (this.nodes.length > 0) {
            return this.nodes.shift();
        }
        return null;
    }
    length() {
        return this.nodes.length;
    }
    getNodes() {
        return this.nodes;
    }
}
exports.TilePositionPath = TilePositionPath;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @see https://gamedevelopment.tutsplus.com/tutorials/understanding-steering-behaviors-collision-avoidance--gamedev-7777
 */
class CollisionAvoidanceBehavior {
    constructor(host) {
        this.host = host;
    }
    // TODO ai steering behavior should not now game objects
    avoidCollision(radar) {
        const maxSeeAhead = 80;
        const maxAvoidForce = 2;
        const ahead = this.host.getPosition().clone();
        const velocity = this.host.getVelocity().clone().normalize();
        ahead.multiply(velocity.x, velocity.y);
        ahead.add(maxSeeAhead, maxSeeAhead);
        const ahead2 = ahead.clone();
        ahead2.subtract(maxSeeAhead / 2, maxSeeAhead / 2);
        let avoidance = new Phaser.Point(0, 0);
        const mostThreatening = radar.closestObstacle(this.host.getPosition(), maxSeeAhead);
        if (mostThreatening != null) {
            avoidance.x = ahead.x - mostThreatening.getPosition().x;
            avoidance.y = ahead.y - mostThreatening.getPosition().y;
            avoidance.multiply(maxAvoidForce, maxAvoidForce);
            avoidance.normalize();
            return avoidance;
        }
        return avoidance;
    }
}
exports.CollisionAvoidanceBehavior = CollisionAvoidanceBehavior;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class CollisionReactionBehavior {
    constructor(host) {
        this.host = host;
    }
    reactToCollision(body) {
        const avoidForce = new Phaser.Point(0, 0);
        const force = 20;
        if (body.blocked.up) {
            avoidForce.add(0, force);
        }
        if (body.blocked.down) {
            avoidForce.add(0, -force);
        }
        if (body.blocked.left) {
            avoidForce.add(force, 0);
        }
        if (body.blocked.right) {
            avoidForce.add(-force, 0);
        }
        return avoidForce;
    }
}
exports.CollisionReactionBehavior = CollisionReactionBehavior;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @see https://gamedevelopment.tutsplus.com/tutorials/understanding-steering-behaviors-pursuit-and-evade--gamedev-2946
 */
class EvadingBehavior {
    constructor(host, fleeBehavior) {
        this.host = host;
        this.fleeBehavior = fleeBehavior;
    }
    evading(target) {
        let distance = this.host.getPosition().distance(target.getPosition());
        let updatesAhead = distance / target.getMaxVelocity().x;
        const futurePosition = target.getPosition().clone();
        futurePosition.add(target.getVelocity().x * updatesAhead, target.getVelocity().y * updatesAhead);
        return this.fleeBehavior.flee(futurePosition);
    }
}
exports.EvadingBehavior = EvadingBehavior;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class FleeBehavior {
    constructor(host) {
        this.host = host;
    }
    /**
     * Almost like the SeekBehavior excepts that the vector goes from the target to the boid (to flee away!)
     * @param target
     * @returns {Phaser.Point}
     */
    flee(target) {
        // direction vector is the straight direction from the target to the boid
        const force = new Phaser.Point(this.host.getPosition().x, this.host.getPosition().y);
        // now we subtract the target position
        force.subtract(target.x, target.y);
        // then we normalize it. A normalized vector has its length is 1, but it retains the same direction
        force.normalize();
        // time to set magnitude (length) to boid speed
        force.setMagnitude(this.host.getMaxVelocity().x);
        // now we subtract the current boid velocity
        force.subtract(this.host.getVelocity().x, this.host.getVelocity().y);
        // normalizing again
        force.normalize();
        return force;
    }
}
exports.FleeBehavior = FleeBehavior;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @see https://gamedevelopment.tutsplus.com/tutorials/understanding-steering-behaviors-path-following--gamedev-8769
 */
class PathFollowingBehavior {
    constructor(host, seekBehavior) {
        this.host = host;
        this.seekBehavior = seekBehavior;
    }
    followPath(path, slowingRadius = 0) {
        this.resetIfPathHasChanged(path);
        let target = null;
        if (path != null && path.getNodes().length > 0) {
            const nodes = path.getNodes();
            if (this.currentNodeIndex == null) {
                this.currentNodeIndex = 0;
            }
            target = nodes[this.currentNodeIndex];
            const distance = this.host.getPosition().distance(target);
            if (distance <= 20) {
                this.currentNodeIndex += 1;
                if (this.currentNodeIndex >= nodes.length) {
                    this.currentNodeIndex = nodes.length - 1;
                }
            }
        }
        return target != null ? this.seekBehavior.seek(target, slowingRadius) : new Phaser.Point(0, 0);
    }
    resetIfPathHasChanged(path) {
        if (this.currentPath != path) {
            this.currentPath = path;
            this.currentNodeIndex = 0;
        }
    }
}
exports.PathFollowingBehavior = PathFollowingBehavior;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @see https://gamedevelopment.tutsplus.com/tutorials/understanding-steering-behaviors-path-following--gamedev-8769
 */
class PathPatrollingBehavior {
    constructor(host, seekBehavior) {
        this.host = host;
        this.seekBehavior = seekBehavior;
        this.pathDirection = 1;
    }
    patrolPath(path, slowingRadius = 0) {
        this.resetIfPathHasChanged(path);
        let target = null;
        if (path != null && path.getNodes().length > 0) {
            const nodes = path.getNodes();
            if (this.currentNodeIndex == null) {
                this.currentNodeIndex = 0;
            }
            target = nodes[this.currentNodeIndex];
            const distance = this.host.getPosition().distance(target);
            if (distance <= 20) {
                this.currentNodeIndex += this.pathDirection;
                if (this.currentNodeIndex >= nodes.length) {
                    this.pathDirection = -1;
                    this.currentNodeIndex = nodes.length - 1;
                }
                else if (this.currentNodeIndex < 0) {
                    this.pathDirection = 1;
                    this.currentNodeIndex = 0;
                }
            }
        }
        return target != null ? this.seekBehavior.seek(target, slowingRadius) : new Phaser.Point(0, 0);
    }
    resetIfPathHasChanged(path) {
        if (this.currentPath != path) {
            this.currentPath = path;
            this.currentNodeIndex = 0;
        }
    }
}
exports.PathPatrollingBehavior = PathPatrollingBehavior;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @see https://gamedevelopment.tutsplus.com/tutorials/understanding-steering-behaviors-pursuit-and-evade--gamedev-2946s
 */
class PursuingBehavior {
    constructor(host, seekBehavior) {
        this.host = host;
        this.seekBehavior = seekBehavior;
    }
    pursuing(target) {
        let distance = this.host.getPosition().distance(target.getPosition());
        let updatesAhead = distance / target.getMaxVelocity().x;
        const futurePosition = target.getPosition().clone();
        futurePosition.add(target.getVelocity().x * updatesAhead, target.getVelocity().y * updatesAhead);
        return this.seekBehavior.seek(futurePosition);
    }
}
exports.PursuingBehavior = PursuingBehavior;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class SeekBehavior {
    constructor(host) {
        this.host = host;
    }
    seek(target, slowingRadius = 0) {
        // direction vector is the straight direction from the boid to the target
        const direction = new Phaser.Point(target.x, target.y);
        // now we subtract the current boid position
        direction.subtract(this.host.getPosition().x, this.host.getPosition().y);
        // then we normalize it. A normalized vector has its length is 1, but it retains the same direction
        direction.normalize();
        // Check the distance to detect whether the character is inside the slowing area
        const distance = this.host.getPosition().distance(target);
        if (slowingRadius == 0 || distance > slowingRadius) {
            // time to set magnitude (length) to boid speed
            direction.setMagnitude(this.host.getMaxVelocity().x);
        }
        else {
            const ratio = distance / slowingRadius;
            if (ratio < 0.1) {
                direction.setMagnitude(0);
            }
            else {
                direction.setMagnitude(this.host.getMaxVelocity().x * ratio);
            }
        }
        // now we subtract the current boid velocity
        direction.subtract(this.host.getVelocity().x, this.host.getVelocity().y);
        // normalizing again
        direction.normalize();
        // finally we set the magnitude to boid force, which should be WAY lower than its velocity
        // TODO? direction.setMagnitude(this.force);
        return direction;
    }
}
exports.SeekBehavior = SeekBehavior;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class WanderBehavior {
    constructor(host) {
        this.host = host;
        this.wanderAngle = 0;
    }
    wander() {
        const circleDistance = 50;
        const circleRadius = 50;
        const angleChange = 180;
        // Calculate the circle center
        const circleCenter = this.host.getVelocity().clone();
        circleCenter.multiply(circleDistance, circleDistance);
        circleCenter.normalize();
        // Calculate the displacement force
        const displacement = new Phaser.Point(0, -1);
        displacement.multiply(circleRadius, circleRadius);
        displacement.normalize();
        // Randomly change the vector direction by making it change its current angle
        const distance = this.host.getPosition().distance(displacement);
        displacement.x = Math.cos(this.wanderAngle) * distance;
        displacement.y = Math.sin(this.wanderAngle) * distance;
        // Change wanderAngle just a bit, so it won't have the same value in the next game frame.
        this.wanderAngle += (Math.random() * -angleChange) - (angleChange * .5);
        // Finally calculate and return the wander force
        const wanderForce = circleCenter.add(displacement.x, displacement.y);
        wanderForce.normalize();
        // time to set magnitude (length) to boid speed
        wanderForce.setMagnitude(this.host.getMaxVelocity().x);
        wanderForce.normalize();
        return wanderForce;
    }
}
exports.WanderBehavior = WanderBehavior;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor(army, human) {
        this.army = army;
        this.human = human;
    }
    play() {
        // TODO extract Play state logic
    }
    getArmy() {
        return this.army;
    }
    isHuman() {
        return this.human;
    }
    isDefeated() {
        const notdestroyedBuildings = this.getArmy().getBuildings().filter(function (building) {
            return building.isDestroyed() == false;
        });
        return notdestroyedBuildings.length == 0;
    }
}
exports.Player = Player;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class PlayerRepository {
    constructor() {
        this.players = [];
    }
    add(player) {
        this.players.push(player);
    }
    all() {
        return this.players;
    }
    human() {
        return this.all().filter(function (player) { return player.isHuman(); })[0];
    }
    bots() {
        return this.all().filter(function (player) { return player.isHuman() == false; });
    }
}
exports.PlayerRepository = PlayerRepository;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Boot extends Phaser.State {
    create() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.state.start('Preload');
    }
}
exports.default = Boot;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Menu extends Phaser.State {
    create() {
        this.game.stage.backgroundColor = '#1b1128';
        let spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.startGame, this);
        this.titleText = this.game.add.bitmapText(40, 100, 'carrier-command', 'PhaserJS SandBox', 27);
        this.subtitleText = this.game.add.bitmapText(40, 140, 'carrier-command', 'XXXX Game Jam #x by nidup', 10);
        this.startText = this.game.add.bitmapText(240, 450, 'carrier-command', 'Press space to start', 10);
    }
    startGame() {
        this.game.state.start('Play');
    }
    shutdown() {
        this.titleText.destroy();
        this.subtitleText.destroy();
        this.startText.destroy();
    }
}
exports.default = Menu;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const VehicleRepository_1 = __webpack_require__(67);
const BuildingRepository_1 = __webpack_require__(64);
const CloudMapGenerator_1 = __webpack_require__(31);
const ItemRepository_1 = __webpack_require__(66);
const Oil_1 = __webpack_require__(20);
const UnitSelector_1 = __webpack_require__(60);
const Player_1 = __webpack_require__(46);
const Army_1 = __webpack_require__(61);
const MainPanel_1 = __webpack_require__(54);
const PlayerRepository_1 = __webpack_require__(47);
const FogOfWar_1 = __webpack_require__(29);
const JukeBox_1 = __webpack_require__(63);
const DialogSystem_1 = __webpack_require__(53);
class Play extends Phaser.State {
    constructor() {
        super(...arguments);
        this.debug = false;
        this.enableFog = true;
        this.enableRandMap = true;
    }
    create() {
        if (this.debug) {
            this.game.time.advancedTiming = true;
        }
        this.game.stage.backgroundColor = '#000000';
        const groundLayer = this.game.add.group();
        groundLayer.name = 'Ground';
        const unitLayer = this.game.add.group();
        unitLayer.name = 'Unit';
        const fogOfWarLayer = this.game.add.group();
        fogOfWarLayer.name = 'Fog';
        const interfaceLayer = this.game.add.group();
        interfaceLayer.name = 'Interface';
        const panelWith = 240;
        const mapWidth = this.game.width - panelWith;
        const mapHeight = this.game.height;
        const tileSize = 20;
        const baseAreaGap = 4;
        const baseBlueX = 150;
        const baseBlueY = 150;
        const baseRedX = 850;
        const baseRedY = 650;
        const oilAreaGap = 2;
        const oil1X = 450;
        const oil1Y = 150;
        const oil2X = 850;
        const oil2Y = 150;
        const oil3X = 550;
        const oil3Y = 650;
        const oil4X = 150;
        const oil4Y = 650;
        const oil5X = 500;
        const oil5Y = 400;
        const emptyAreas = [];
        emptyAreas.push(new CloudMapGenerator_1.EmptyArea(Math.round(baseBlueX / tileSize), Math.round(baseBlueY / tileSize), baseAreaGap));
        emptyAreas.push(new CloudMapGenerator_1.EmptyArea(Math.round(baseRedX / tileSize), Math.round(baseRedY / tileSize), baseAreaGap));
        emptyAreas.push(new CloudMapGenerator_1.EmptyArea(Math.round(oil1X / tileSize), Math.round(oil1Y / tileSize), oilAreaGap));
        emptyAreas.push(new CloudMapGenerator_1.EmptyArea(Math.round(oil2X / tileSize), Math.round(oil2Y / tileSize), oilAreaGap));
        emptyAreas.push(new CloudMapGenerator_1.EmptyArea(Math.round(oil3X / tileSize), Math.round(oil3Y / tileSize), oilAreaGap));
        emptyAreas.push(new CloudMapGenerator_1.EmptyArea(Math.round(oil4X / tileSize), Math.round(oil4Y / tileSize), oilAreaGap));
        emptyAreas.push(new CloudMapGenerator_1.EmptyArea(Math.round(oil5X / tileSize), Math.round(oil5Y / tileSize), oilAreaGap));
        if (!this.enableRandMap) {
            this.game.rnd.state('!rnd,1,0.7121938972268254,0.2891752696596086,0.2457362802233547');
            // nice map !rnd,1,0.5805144435726106,0.15749581600539386,0.11405682656913996
            // this.game.rnd.state('!rnd,1,0.9783369363285601,0.5553183087613434,0.5118793193250895');
            // this.game.rnd.state('!rnd,1,0.369288211222738,0.9462695836555213,0.9028305942192674');
            // cool for collision debug this.game.rnd.state('!rnd,1,0.7287226526532322,0.30570402508601546,0.26226503564976156')
        }
        console.log(this.game.rnd.state());
        const mapGenerator = new CloudMapGenerator_1.CloudMapGenerator(groundLayer, mapWidth, mapHeight, tileSize, emptyAreas, this.game.rnd);
        // const mapGenerator = new RandomMapGenerator(groundLayer, mapWidth, mapHeight, tileSize);
        // const mapGenerator = new FileMapGenerator(groundLayer, mapWidth, mapHeight, tileSize);
        const generatedMap = mapGenerator.generate();
        this.tiles = generatedMap.getTiles();
        this.collisionLayer = generatedMap.getCollisionLayer();
        if (this.debug) {
            this.collisionLayer.debug = true;
        }
        this.collisionLayer.resizeWorld();
        this.items = new ItemRepository_1.ItemRepository();
        this.buildings = new BuildingRepository_1.BuildingRepository();
        this.vehicles = new VehicleRepository_1.VehicleRepository();
        const oilQuantity = 1000;
        this.items.add(new Oil_1.Oil(unitLayer, oil1X, oil1Y, 'Icons', 0, oilQuantity));
        this.items.add(new Oil_1.Oil(unitLayer, oil2X, oil2Y, 'Icons', 0, oilQuantity));
        this.items.add(new Oil_1.Oil(unitLayer, oil3X, oil3Y, 'Icons', 0, oilQuantity));
        this.items.add(new Oil_1.Oil(unitLayer, oil4X, oil4Y, 'Icons', 0, oilQuantity));
        this.items.add(new Oil_1.Oil(unitLayer, oil5X, oil5Y, 'Icons', 0, oilQuantity));
        this.players = new PlayerRepository_1.PlayerRepository();
        this.jukebox = new JukeBox_1.JukeBox(this.game);
        const armyBlue = new Army_1.Army(0x1e85ff, this.vehicles, this.buildings, this.items, generatedMap, unitLayer, this.jukebox);
        const humanPlayer = new Player_1.Player(armyBlue, true);
        this.players.add(humanPlayer);
        const armyRed = new Army_1.Army(0xff2b3c, this.vehicles, this.buildings, this.items, generatedMap, unitLayer, this.jukebox);
        const botPlayer = new Player_1.Player(armyRed, false);
        this.players.add(botPlayer);
        const base = armyBlue.buildBase(baseBlueX, baseBlueY);
        base.stock(400);
        /*
        armyBlue.recruitMiner(70, 100);
        armyBlue.recruitMiner(100, 400);
        armyBlue.recruitMiner(400, 100);
        armyBlue.recruitMiner(100, 600);
        armyBlue.recruitScout(250, 200);
        armyBlue.recruitScout(50, 400);
        armyBlue.recruitEngineer(330, 370);
        armyBlue.recruitTank(300, 260);
        */
        /*
        armyBlue.recruitTank(300, 260);
        armyBlue.recruitTank(350, 260);
        armyBlue.recruitTank(370, 260);
        */
        armyRed.buildBase(850, 650);
        armyRed.recruitMiner(850, 500);
        armyRed.recruitMiner(800, 600);
        armyRed.recruitMiner(700, 700);
        armyRed.recruitMiner(600, 700);
        armyRed.recruitScout(450, 800);
        armyRed.recruitScout(300, 600);
        armyRed.recruitTank(650, 760);
        // armyRed.recruitTank(250, 260);
        // armyRed.getStrategy().attack();
        this.unitSelector = new UnitSelector_1.UnitSelector(humanPlayer);
        this.unitSelector.selectUnit(this.buildings.bases()[0]);
        this.mainPanel = new MainPanel_1.MainPanel(interfaceLayer, panelWith, this.unitSelector, this.players, generatedMap, this.items, this.jukebox);
        this.dialogSystem = new DialogSystem_1.DialogSystem(interfaceLayer);
        this.fogOfWar = new FogOfWar_1.FogOfWar();
        const fogX = 0;
        const fogY = 0;
        this.bitmap = this.game.make.bitmapData(52, 40);
        const imageFogOFWar = this.game.add.image(fogX, fogY, this.bitmap, 0, fogOfWarLayer);
        imageFogOFWar.anchor.set(0, 0);
        imageFogOFWar.scale.set(generatedMap.getTileSize(), generatedMap.getTileSize());
        fogOfWarLayer.add(imageFogOFWar);
        if (this.enableFog) {
            const knownTiles = this.players.human().getArmy().getSharedMemory().getKnownTiles();
            this.fogOfWar.apply(this.bitmap, knownTiles);
        }
        this.dialogSystem.displayNewGameDialog();
    }
    update() {
        const tickGap = 500;
        if (this.tick == null) {
            this.tick = this.game.time.time + tickGap;
        }
        if (this.tick < this.game.time.time) {
            this.tick = this.game.time.time + tickGap;
            this.updateGame();
            this.updateItems(this.items);
            this.updateVehicles(this.vehicles, this.game, this.collisionLayer);
            this.updateUnitSelector(this.unitSelector, this.vehicles, this.buildings, this.items);
            this.mainPanel.update();
            if (this.enableFog) {
                const knownTiles = this.players.human().getArmy().getSharedMemory().getKnownTiles();
                this.fogOfWar.apply(this.bitmap, knownTiles);
            }
        }
    }
    updateGame() {
        if (this.players.human().isDefeated()) {
            this.dialogSystem.displayDefeatDialog();
        }
        const notDefeatedBots = this.players.bots().filter(function (player) {
            return player.isDefeated() == false;
        });
        if (notDefeatedBots.length == 0) {
            this.dialogSystem.displayVictoryDialog();
        }
    }
    updateItems(items) {
        const collectableItems = items;
        collectableItems.all()
            .filter(function (item) {
            return item.hasBeenCollected();
        })
            .map(function (item) {
            collectableItems.remove(item);
            item.destroy();
        });
    }
    updateVehicles(vehicles, game, collisionLayer) {
        const aliveVehicles = vehicles;
        aliveVehicles.all()
            .filter(function (vehicle) {
            return !vehicle.isAlive();
        })
            .map(function (vehicle) {
            aliveVehicles.remove(vehicle);
            vehicle.destroy();
        });
        const layer = collisionLayer;
        aliveVehicles.all().map(function (vehicle) {
            game.physics.arcade.collide(vehicle, layer);
        });
    }
    // TODO: move to panel
    updateUnitSelector(unitSelector, vehicles, buildings, items) {
        unitSelector.listenVehicles(vehicles.all());
        unitSelector.listenBuildings(buildings.all());
        unitSelector.listenItems(items.all());
    }
    render() {
        if (this.debug) {
            // TODO: try https://github.com/samme/phaser-plugin-debug-arcade-physics ?
            // this.game.debug.body(this.vehicles.get(1));
            // this.game.debug.bodyInfo(this.vehicles.get(1), 240, 410);
            const game = this.game;
            this.vehicles.all().map(function (vehicle) {
                game.debug.body(vehicle);
            });
            this.buildings.all().map(function (building) {
                game.debug.body(building);
            });
            this.items.all().map(function (item) {
                game.debug.body(item);
            });
            this.game.debug.text("FPS: " + this.game.time.fps + " ", 2, 14, "#00ff00");
        }
    }
    shutdown() {
        this.jukebox.destroy();
    }
}
exports.default = Play;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Preload extends Phaser.State {
    preload() {
        this.loadAudio();
        this.loadTilemap();
        this.loadTileImages();
        this.loadGameImages();
        this.loadUIImages();
    }
    create() {
        this.game.state.start('Play'); // TODO: shortcuting "Menu" state :)
    }
    loadAudio() {
        //  Firefox doesn't support mp3 files, so use ogg ? @see https://www.phaser.io/examples/v2/audio/pause-and-resume
        this.game.load.audio('music', ['assets/audio/music/bodenstaendig_2000_in_rock_4bit.mp3', 'assets/audio/music/bodenstaendig_2000_in_rock_4bit.ogg']);
        this.game.load.audio('explosion', 'assets/audio/sounds/explosion.mp3');
        this.game.load.audio('blaster', 'assets/audio/sounds/blaster.mp3');
    }
    loadTilemap() {
        this.load.tilemap('level1', 'assets/tilemap/level1.json', null, Phaser.Tilemap.TILED_JSON);
    }
    loadTileImages() {
        this.load.image('GrasClif', 'assets/terrain/GrasClif.png');
        this.load.image('Grass', 'assets/terrain/Grass.png');
        this.load.image('Grass2', 'assets/terrain/Grass2.png');
        this.load.image('GrasRoad', 'assets/terrain/GrasRoad.png');
        this.load.image('GrassRDst', 'assets/terrain/GrassRDst.png');
        this.load.image('Grs2CrtB', 'assets/terrain/Grs2CrtB.png');
        this.load.image('Grs2Crtc', 'assets/terrain/Grs2Crtc.png');
        this.load.image('Grs2Crtr', 'assets/terrain/Grs2Crtr.png');
        this.load.image('Grs2Mnt', 'assets/terrain/Grs2Mnt.png');
        this.load.image('Grs2Watr', 'assets/terrain/Grs2Watr.png');
        this.load.image('Grss2Lav', 'assets/terrain/Grss2Lav.png');
        this.load.image('GrssCrtr', 'assets/terrain/GrssCrtr.png');
        this.load.image('GrssMisc', 'assets/terrain/GrssMisc.png');
        this.load.image('MntMisc', 'assets/terrain/MntMisc.png');
        this.load.image('Snw2Mnt', 'assets/terrain/Snw2Mnt.png');
    }
    loadGameImages() {
        this.load.spritesheet('Builder1', 'assets/vehicle/Builder1.png', 20, 20);
        this.load.spritesheet('Scout1', 'assets/vehicle/Scout1.png', 20, 20);
        this.load.spritesheet('Tank5', 'assets/vehicle/Tank5.png', 20, 20);
        this.load.spritesheet('Miner', 'assets/vehicle/Miner.png', 20, 20);
        this.load.spritesheet('Base', 'assets/building/Base.png', 60, 60);
        this.load.spritesheet('Mine', 'assets/building/Mine.png', 40, 60);
        this.load.spritesheet('Generator', 'assets/building/Generator.png', 40, 60);
        this.load.spritesheet('Icons', 'assets/misc/Icons.png', 20, 20);
        this.load.spritesheet('Markers', 'assets/misc/Markers.png', 10, 10);
        this.load.spritesheet('SmallExplosion', 'assets/explosion/Small.png', 20, 20);
        this.load.spritesheet('MediumExplosion', 'assets/explosion/Medium.png', 20, 20);
        this.load.spritesheet('BigExplosion', 'assets/explosion/Big.png', 40, 40);
        this.load.spritesheet('Bullet', 'assets/bullet/Bullet3.png', 10, 10);
    }
    loadUIImages() {
        this.load.bitmapFont('carrier-command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
        this.load.image('CommandPanel', 'assets/interface/CommandPanel.png');
        this.load.spritesheet('Button', 'assets/interface/Button.png', 94, 27);
        this.load.spritesheet('BuyButton', 'assets/interface/BuyButton.png', 140, 27);
        this.load.spritesheet('OrderButton', 'assets/interface/OrderButton.png', 110, 27);
        this.load.image('HealthJauge', 'assets/interface/HealthJauge.png');
        this.load.image('Dialog', 'assets/interface/Dialog.png');
    }
}
exports.default = Preload;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const TextStyle_1 = __webpack_require__(0);
const ButtonBuilder_1 = __webpack_require__(13);
class Dialog {
    constructor(group, content) {
        const game = group.game;
        const dialogWidth = 312;
        const dialogHeight = 195;
        this.dialogX = game.width / 2 - dialogWidth / 2;
        this.dialogY = game.height / 2 - dialogHeight / 2;
        const textStyle = new TextStyle_1.TextStyle();
        this.background = group.game.add.sprite(this.dialogX, this.dialogY, 'Dialog', 0, group);
        const textMarginX = 35;
        const textMarginY = 35;
        this.text = group.game.add.text(this.dialogX + textMarginX, this.dialogY + textMarginY, content, textStyle.getNormalStyle(22), group);
    }
    destroy() {
        this.background.destroy();
        this.text.destroy();
        this.button.getButton().destroy();
        this.button.getText().destroy();
    }
}
class VictoryDialog extends Dialog {
    constructor(group) {
        super(group, "Victory!\n\nYou destroyed all your\nenemy's buildings!");
        const game = group.game;
        const buttonBuilder = new ButtonBuilder_1.ButtonBuilder();
        const myself = this;
        const callback = function () {
            myself.destroy();
            game.paused = false;
            game.state.start('Play');
        };
        this.button = buttonBuilder.addButton(group, this.dialogX + 185, this.dialogY + 160, 6, 'Restart', callback);
    }
}
exports.VictoryDialog = VictoryDialog;
class DefeatDialog extends Dialog {
    constructor(group) {
        super(group, "Defeat!\n\nAll your buildings\nhave been destroyed");
        const game = group.game;
        const buttonBuilder = new ButtonBuilder_1.ButtonBuilder();
        const myself = this;
        const callback = function () {
            myself.destroy();
            game.paused = false;
            game.state.start('Play');
        };
        this.button = buttonBuilder.addButton(group, this.dialogX + 185, this.dialogY + 160, 6, 'Restart', callback);
    }
}
exports.DefeatDialog = DefeatDialog;
class NewGameDialog extends Dialog {
    constructor(group) {
        super(group, "Destroy all enemy's\nbuildings to defeat\nhim and escape\nthis planet");
        const game = group.game;
        const buttonBuilder = new ButtonBuilder_1.ButtonBuilder();
        const myself = this;
        const callback = function () {
            myself.destroy();
            game.paused = false;
        };
        this.button = buttonBuilder.addButton(group, this.dialogX + 185, this.dialogY + 160, 6, 'Start', callback);
    }
}
exports.NewGameDialog = NewGameDialog;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Dialog_1 = __webpack_require__(52);
class DialogSystem {
    constructor(group) {
        this.group = group;
    }
    displayDefeatDialog() {
        this.group.game.paused = true;
        new Dialog_1.DefeatDialog(this.group);
    }
    displayVictoryDialog() {
        this.group.game.paused = true;
        new Dialog_1.VictoryDialog(this.group);
    }
    displayNewGameDialog() {
        this.group.game.paused = true;
        new Dialog_1.NewGameDialog(this.group);
    }
}
exports.DialogSystem = DialogSystem;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const SelectedUnitPanel_1 = __webpack_require__(59);
const OrderPanel_1 = __webpack_require__(57);
const Minimap_1 = __webpack_require__(56);
const RecruitPanel_1 = __webpack_require__(58);
const MenuPanel_1 = __webpack_require__(55);
class MainPanel {
    constructor(group, panelWith, unitSelector, players, map, items, jukebox) {
        const screenWidth = group.game.width;
        this.unitSelector = unitSelector;
        this.minimap = new Minimap_1.Minimap(group, panelWith, map, players, items);
        const background = group.game.add.sprite(screenWidth - panelWith, 0, 'CommandPanel', 0, group);
        background.z = 100;
        let positionY = 190;
        this.selectedUnitPanel = new SelectedUnitPanel_1.SelectedUnitPanel(group, panelWith, unitSelector, positionY);
        positionY += 110;
        this.recruitPanel = new RecruitPanel_1.RecruitPanel(group, players.human(), positionY);
        positionY += 267;
        new OrderPanel_1.OrderPanel(group, screenWidth, panelWith, players.human(), positionY);
        positionY += 125;
        new MenuPanel_1.MenuPanel(group, panelWith, jukebox, positionY);
    }
    update() {
        this.selectedUnitPanel.update();
        this.recruitPanel.update();
        this.minimap.update();
    }
}
exports.MainPanel = MainPanel;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const TextStyle_1 = __webpack_require__(0);
const ButtonBuilder_1 = __webpack_require__(13);
class MenuPanel {
    constructor(group, panelWith, jukebox, positionY) {
        const screenWidth = group.game.width;
        const textStyle = new TextStyle_1.TextStyle();
        group.game.add.text(screenWidth - 210, positionY, 'Settings', textStyle.getNormalStyle(), group);
        const buttonBuilder = new ButtonBuilder_1.ButtonBuilder();
        const buttonHeight = 27;
        const verticalMargin = 3;
        const buttonWidth = 110;
        const buttonMargin = 7;
        const marginX = 7;
        const leftPositionX = screenWidth - panelWith + marginX;
        let positionX = leftPositionX;
        positionY += 30;
        let frame = 4;
        let callback = function () {
            jukebox.switchSound();
        };
        this.soundButton = buttonBuilder.addButton(group, positionX, positionY, frame, 'Sound', callback).getButton();
        positionX += buttonWidth + buttonMargin;
        callback = function () {
            jukebox.switchMusic();
        };
        buttonBuilder.addButton(group, positionX, positionY, 8, 'Music', callback);
        positionY += buttonHeight + verticalMargin;
        positionX = leftPositionX;
        const game = group.game;
        callback = function () {
            game.paused = !game.paused;
        };
        buttonBuilder.addButton(group, positionX, positionY, 10, 'Pause', callback);
        positionX += buttonWidth + buttonMargin;
        callback = function () {
            game.state.start('Play');
        };
        buttonBuilder.addButton(group, positionX, positionY, 6, 'Restart', callback);
    }
}
exports.MenuPanel = MenuPanel;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Tile_1 = __webpack_require__(5);
/**
 * @see https://phaser.io/examples/v2/bitmapdata/reveal
 */
class Minimap {
    constructor(group, panelWidth, map, players, items) {
        this.map = map;
        this.players = players;
        this.items = items;
        const marginX = 10;
        const marginY = 8;
        this.bitmap = group.game.make.bitmapData(52, 40);
        const image = group.game.add.image(group.game.width - panelWidth + marginX, marginY, this.bitmap, 0, group);
        image.anchor.set(0, 0);
        image.scale.set(4.24, 4.24);
    }
    update() {
        this.drawGrounds(this.map.getGrounds());
        const myself = this;
        this.players.all().forEach(function (player) {
            myself.drawBuildings(player.getArmy());
            myself.drawVehicles(player.getArmy());
        });
        this.drawItems(this.items);
        const sharedMemory = this.players.human().getArmy().getSharedMemory();
        this.drawFogOfWar(sharedMemory.getKnownTiles());
    }
    drawGrounds(grounds) {
        for (let y = 0; y < grounds.length; y++) {
            for (let x = 0; x < grounds[y].length; x++) {
                const ground = grounds[y][x];
                let red = 0;
                let green = 0;
                let blue = 0;
                if (ground == Tile_1.Tile.GRASS) {
                    red = 31;
                    green = 112;
                    blue = 3;
                }
                else if (ground == Tile_1.Tile.MNT) {
                    red = 160;
                    green = 112;
                    blue = 96;
                }
                else if (ground == Tile_1.Tile.LAVA) {
                    red = 96;
                    green = 0;
                    blue = 0;
                }
                else if (ground == Tile_1.Tile.SNOW) {
                    red = 191;
                    green = 207;
                    blue = 223;
                }
                this.bitmap.setPixel(x, y, red, green, blue);
            }
        }
    }
    drawBuildings(army) {
        const myself = this;
        army.getBuildings().map(function (building) {
            const x = Math.ceil((building.getPosition().x + 1) / 20); // TODO!!
            const y = Math.ceil((building.getPosition().y + 1) / 20);
            const color = myself.getColorRGB(army);
            myself.bitmap.setPixel(x, y, color.red, color.green, color.blue);
            myself.bitmap.setPixel(x + 1, y, color.red, color.green, color.blue);
            myself.bitmap.setPixel(x, y + 1, color.red, color.green, color.blue);
            myself.bitmap.setPixel(x + 1, y + 1, color.red, color.green, color.blue);
        });
    }
    drawVehicles(army) {
        const myself = this;
        army.getVehicles().map(function (vehicle) {
            const x = Math.ceil((vehicle.getPosition().x + 1) / 20); // TODO get tilesize!! Merge MapAnalyse / Map
            const y = Math.ceil((vehicle.getPosition().y + 1) / 20);
            const color = myself.getColorRGB(army);
            myself.bitmap.setPixel(x, y, color.red, color.green, color.blue);
        });
    }
    getColorRGB(army) {
        const colorHex = army.getColor().toString(16);
        return {
            red: parseInt(colorHex.substring(0, 2), 16),
            green: parseInt(colorHex.substring(2, 4), 16),
            blue: parseInt(colorHex.substring(4, 6), 16)
        };
    }
    drawItems(items) {
        const myself = this;
        items.oils().map(function (item) {
            const x = Math.ceil((item.getPosition().x + 1) / 20); // TODO!!
            const y = Math.ceil((item.getPosition().y + 1) / 20);
            '#ff8b00';
            const color = { red: 255, green: 139, blue: 0 };
            myself.bitmap.setPixel(x, y, color.red, color.green, color.blue);
            myself.bitmap.setPixel(x + 1, y, color.red, color.green, color.blue);
            myself.bitmap.setPixel(x, y + 1, color.red, color.green, color.blue);
            myself.bitmap.setPixel(x + 1, y + 1, color.red, color.green, color.blue);
        });
    }
    drawFogOfWar(knownGrounds) {
        for (let y = 0; y < knownGrounds.length; y++) {
            for (let x = 0; x < knownGrounds[y].length; x++) {
                const unknownGround = !knownGrounds[y][x];
                if (unknownGround) {
                    let red = 0;
                    let green = 0;
                    let blue = 0;
                    this.bitmap.setPixel(x, y, red, green, blue);
                }
            }
        }
    }
}
exports.Minimap = Minimap;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const TextStyle_1 = __webpack_require__(0);
const ButtonBuilder_1 = __webpack_require__(13);
class OrderPanel {
    constructor(group, screenWidth, panelWith, player, positionY) {
        this.screenWidth = screenWidth;
        this.textStyle = new TextStyle_1.TextStyle();
        group.game.add.text(screenWidth - 210, positionY, 'Strategies', this.textStyle.getNormalStyle(), group);
        const buttonBuilder = new ButtonBuilder_1.ButtonBuilder();
        const buttonWidth = 110;
        const buttonMargin = 7;
        const marginX = 7;
        let positionX = screenWidth - panelWith + marginX;
        positionY += 30;
        let callback = function () { player.getArmy().getStrategy().defend(); };
        buttonBuilder.addButton(group, positionX, positionY, 0, 'Defend', callback);
        positionX += buttonWidth + buttonMargin;
        callback = function () { player.getArmy().getStrategy().attack(); };
        buttonBuilder.addButton(group, positionX, positionY, 2, 'Attack', callback);
        // TODO: enable / disable button
    }
}
exports.OrderPanel = OrderPanel;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const VehicleCosts_1 = __webpack_require__(21);
const Scout_1 = __webpack_require__(9);
const Miner_1 = __webpack_require__(1);
const Engineer_1 = __webpack_require__(8);
const Tank_1 = __webpack_require__(10);
const TextStyle_1 = __webpack_require__(0);
class RecruitPanel {
    constructor(group, player, positionY) {
        const buttonHeight = 27;
        const verticalMargin = 5;
        const base = player.getArmy().getBase();
        this.base = base;
        this.vehicleCosts = new VehicleCosts_1.VehicleCosts();
        this.textStyle = new TextStyle_1.TextStyle();
        this.totalStock = this.addCostTextAndImage(group, positionY, base.getStock());
        group.game.add.text(group.game.width - 125, positionY + 2, 'Total', this.textStyle.getNormalStyle(), group);
        positionY += 74;
        group.game.add.text(group.game.width - 210, positionY, 'Recruitment', this.textStyle.getNormalStyle(), group);
        positionY += 28;
        let callback = function () {
            base.buildMiner();
        };
        this.minerButton = this.addRecruitButton(group, positionY, 'Miner', callback);
        this.addCostTextAndImage(group, positionY, this.vehicleCosts.getCost(Miner_1.Miner));
        positionY += buttonHeight + verticalMargin;
        callback = function () {
            base.buildScout();
        };
        this.scoutButton = this.addRecruitButton(group, positionY, 'Scout', callback);
        this.addCostTextAndImage(group, positionY, this.vehicleCosts.getCost(Scout_1.Scout));
        positionY += buttonHeight + verticalMargin;
        callback = function () {
            base.buildBuilder();
        };
        this.builderButton = this.addRecruitButton(group, positionY, 'Engineer', callback);
        this.addCostTextAndImage(group, positionY, this.vehicleCosts.getCost(Engineer_1.Engineer));
        positionY += buttonHeight + verticalMargin;
        callback = function () {
            base.buildTank();
        };
        this.tankButton = this.addRecruitButton(group, positionY, 'Tank', callback);
        this.addCostTextAndImage(group, positionY, this.vehicleCosts.getCost(Tank_1.Tank));
    }
    update() {
        this.totalStock.setText(this.base.getStock().toString());
        if (this.base.getStock() >= this.vehicleCosts.getCost(Miner_1.Miner)) {
            this.enableButton(this.minerButton);
        }
        else {
            this.disableButton(this.minerButton);
        }
        if (this.base.getStock() >= this.vehicleCosts.getCost(Scout_1.Scout)) {
            this.enableButton(this.scoutButton);
        }
        else {
            this.disableButton(this.scoutButton);
        }
        if (this.base.getStock() >= this.vehicleCosts.getCost(Engineer_1.Engineer)) {
            this.enableButton(this.builderButton);
        }
        else {
            this.disableButton(this.builderButton);
        }
        if (this.base.getStock() >= this.vehicleCosts.getCost(Tank_1.Tank)) {
            this.enableButton(this.tankButton);
        }
        else {
            this.disableButton(this.tankButton);
        }
    }
    addRecruitButton(group, positionY, buttonText, callback) {
        const buttonWidth = 140;
        const buttonMargin = 7;
        let buttonX = group.game.width - buttonWidth - buttonMargin;
        let buttonY = positionY;
        const button = group.game.add.button(buttonX, buttonY, 'BuyButton', callback, this, 4, 3, 4, 3, group);
        const textMarginX = 15;
        const textMarginY = 3;
        const styleNormal = this.textStyle.getNormalStyle();
        const styleHover = this.textStyle.getOverStyle();
        const text = group.game.add.text(buttonX + textMarginX, buttonY + textMarginY, buttonText, styleNormal, group);
        button.onInputOut.add(function () {
            text.setStyle(styleNormal);
            text.y = text.y - 1;
        });
        button.onInputOver.add(function () {
            text.setStyle(styleHover);
            text.y = text.y + 1;
        });
        return button;
    }
    addCostTextAndImage(group, positionY, cost) {
        const txtPositionX = group.game.width - 200;
        const txtPositionY = positionY + 3;
        const text = group.game.add.text(txtPositionX, txtPositionY, cost.toString(), this.textStyle.getNormalStyle(), group);
        const oilPositionX = txtPositionX - 37;
        const oilPositionY = txtPositionY - 2;
        group.game.add.image(oilPositionX, oilPositionY, 'Icons', 33, group);
        return text;
    }
    enableButton(button) {
        button.setFrames(4, 3, 4);
    }
    disableButton(button) {
        button.setFrames(6, 5, 6);
    }
}
exports.RecruitPanel = RecruitPanel;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vehicle_1 = __webpack_require__(2);
const Building_1 = __webpack_require__(7);
const Item_1 = __webpack_require__(19);
const TextStyle_1 = __webpack_require__(0);
const HealthBarDrawer_1 = __webpack_require__(18);
const Base_1 = __webpack_require__(14);
const Mine_1 = __webpack_require__(15);
const Miner_1 = __webpack_require__(1);
class SelectedUnitPanel {
    constructor(group, panelWidth, unitSelector, positionY) {
        this.panelWidth = panelWidth;
        this.textStyle = new TextStyle_1.TextStyle();
        this.unitSelector = unitSelector;
        this.unitStateText = group.game.add.text(group.game.width - 150, positionY, '', this.textStyle.getNormalStyle(), group);
        this.unitStateText.fixedToCamera = true;
        positionY += 25;
        this.extraStateText = group.game.add.text(group.game.width - 150, positionY, '', this.textStyle.getNormalStyle(), group);
        this.extraStateText.fixedToCamera = true;
        positionY += 42;
        const rectWidth = 70;
        const rectHeight = 17;
        const posX = group.game.width - panelWidth + 5;
        this.bitmap = group.game.make.bitmapData(rectWidth, rectHeight);
        const bar = group.game.add.sprite(posX, positionY, this.bitmap, 0, group);
        bar.anchor.set(0, 0);
        this.drawer = new HealthBarDrawer_1.HealthBarDrawer();
        group.game.add.image(group.game.width - panelWidth, positionY, 'HealthJauge', 0, group);
        this.group = group;
    }
    update() {
        const selectedUnit = this.unitSelector.getSelectedUnit();
        if (selectedUnit) {
            this.drawer.draw(selectedUnit, this.bitmap, this.bitmap.width);
            this.displayUnitStatus(selectedUnit);
            this.copySelectedUnitImage(selectedUnit);
        }
    }
    displayUnitStatus(selectedUnit) {
        if (selectedUnit instanceof Building_1.Building || selectedUnit instanceof Vehicle_1.Vehicle || selectedUnit instanceof Item_1.Item) {
            this.unitStateText.setText(selectedUnit.getStatus());
            this.unitStateText.setStyle(this.textStyle.getNormalStyle());
            if (selectedUnit instanceof Base_1.Base) {
                this.extraStateText.setText('store: ' + selectedUnit.getStock() + ' oils');
            }
            else if (selectedUnit instanceof Mine_1.Mine) {
                this.extraStateText.setText('contains: ' + selectedUnit.getRemainingQuantity() + ' oils');
            }
            else if (selectedUnit instanceof Miner_1.Miner) {
                this.extraStateText.setText('loads: ' + selectedUnit.getOilLoad() + ' oils');
            }
            else {
                this.extraStateText.setText('');
            }
        }
    }
    copySelectedUnitImage(selectedUnit) {
        const oldImage = this.unitStateImage;
        this.group.children = this.group.children.reduce(function (children, object) {
            if (object != oldImage) {
                children.push(object);
            }
            return children;
        }, []);
        let positionX = this.group.game.width - this.panelWidth;
        positionX += (selectedUnit instanceof Vehicle_1.Vehicle) ? 30 : 0;
        positionX += (selectedUnit instanceof Building_1.Building) ? 20 : 0;
        positionX += (selectedUnit instanceof Item_1.Item) ? 30 : 0;
        let positionY = 184;
        positionY += (selectedUnit instanceof Vehicle_1.Vehicle) ? 40 : 0;
        positionY += (selectedUnit instanceof Building_1.Building) ? 10 : 0;
        positionY += (selectedUnit instanceof Item_1.Item) ? 35 : 0;
        this.unitStateImage = this.group.game.add.sprite(positionX, positionY, selectedUnit.key, selectedUnit.frame, this.group);
        this.unitStateImage.fixedToCamera = true;
        this.unitStateImage.animations = selectedUnit.animations;
        this.unitStateImage.tint = selectedUnit.tint;
        if (selectedUnit.animations.currentAnim) {
            this.unitStateImage.animations.play(selectedUnit.animations.currentAnim.name);
        }
        // TODO: bug when select the mine during the building, infinite loop on building
    }
}
exports.SelectedUnitPanel = SelectedUnitPanel;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class UnitSelector {
    constructor(player) {
        this.player = player;
    }
    selectUnit(unit) {
        this.selectedUnit = unit;
    }
    getSelectedUnit() {
        return this.selectedUnit;
    }
    listenVehicles(vehicles) {
        const myself = this;
        vehicles.map(function (vehicle) {
            if (vehicle.events.onInputDown.getNumListeners() == 0) {
                vehicle.events.onInputDown.add(function () {
                    myself.selectUnit(vehicle);
                }, this);
            }
        });
    }
    listenBuildings(buildings) {
        const myself = this;
        buildings.map(function (building) {
            if (building.events.onInputDown.getNumListeners() == 0) {
                building.events.onInputDown.add(function () {
                    const myBuilding = building.getArmy() == myself.player.getArmy();
                    if (myBuilding) {
                        myself.selectUnit(building);
                    }
                    else {
                        let known = false;
                        myself.player.getArmy().getSharedMemory().getKnownEnemyBuildings().forEach(function (knownBuilding) {
                            if (knownBuilding == building) {
                                known = true;
                            }
                        });
                        if (known) {
                            myself.selectUnit(building);
                        }
                    }
                }, this);
            }
        });
    }
    listenItems(items) {
        const myself = this;
        items.map(function (item) {
            if (item.events.onInputDown.getNumListeners() == 0) {
                item.events.onInputDown.add(function () {
                    let known = false;
                    myself.player.getArmy().getSharedMemory().getKnownOils().forEach(function (knownOil) {
                        if (knownOil == item) {
                            known = true;
                        }
                    });
                    if (known) {
                        myself.selectUnit(item);
                    }
                }, this);
            }
        });
    }
}
exports.UnitSelector = UnitSelector;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Radar_1 = __webpack_require__(76);
const Miner_1 = __webpack_require__(1);
const Scout_1 = __webpack_require__(9);
const Tank_1 = __webpack_require__(10);
const Engineer_1 = __webpack_require__(8);
const Base_1 = __webpack_require__(14);
const Generator_1 = __webpack_require__(65);
const Mine_1 = __webpack_require__(15);
const Strategy_1 = __webpack_require__(62);
const Camera_1 = __webpack_require__(75);
const SharedMemory_1 = __webpack_require__(74);
class Army {
    constructor(color, vehicles, buildings, items, map, group, jukebox) {
        this.color = color;
        this.strategy = new Strategy_1.Strategy();
        this.vehicles = vehicles;
        this.buildings = buildings;
        this.items = items;
        this.map = map;
        this.group = group;
        this.sharedMemory = new SharedMemory_1.SharedMemory(map);
        this.radar = new Radar_1.Radar(this.items, this.buildings, this.vehicles, this, this.sharedMemory);
        this.jukebox = jukebox;
    }
    recruitMiner(x, y) {
        const camera = new Camera_1.Camera(this.items, this.buildings, this.vehicles, this, 140);
        const vehicle = new Miner_1.Miner(this.group, x, y, this, this.radar, camera, 'Miner', 0, this.map);
        this.vehicles.add(vehicle);
        return vehicle;
    }
    recruitScout(x, y) {
        const camera = new Camera_1.Camera(this.items, this.buildings, this.vehicles, this, 240);
        const vehicle = new Scout_1.Scout(this.group, x, y, this, this.radar, camera, 'Scout1', 0);
        this.vehicles.add(vehicle);
        return vehicle;
    }
    recruitTank(x, y) {
        const camera = new Camera_1.Camera(this.items, this.buildings, this.vehicles, this, 180);
        const vehicle = new Tank_1.Tank(this.group, x, y, this, this.radar, camera, 'Tank5', 0, this.map, this.jukebox);
        this.vehicles.add(vehicle);
        return vehicle;
    }
    recruitEngineer(x, y) {
        const camera = new Camera_1.Camera(this.items, this.buildings, this.vehicles, this, 140);
        const vehicle = new Engineer_1.Engineer(this.group, x, y, this, this.radar, camera, 'Builder1', 0, this.map);
        this.vehicles.add(vehicle);
        return vehicle;
    }
    buildBase(x, y) {
        const building = new Base_1.Base(this.group, x, y, this, 'Base', 0);
        this.buildings.add(building);
        this.sharedMemory.registerGrounds(building.getPosition(), 200);
        return building;
    }
    buildGenerator(x, y) {
        const building = new Generator_1.Generator(this.group, x, y, this, 'Generator', 0);
        this.buildings.add(building);
        return building;
    }
    buildMine(x, y, oil) {
        const building = new Mine_1.Mine(this.group, x, y, this, 'Mine', 0, oil.getQuantity());
        this.buildings.add(building);
        return building;
    }
    getColor() {
        return this.color;
    }
    getStrategy() {
        return this.strategy;
    }
    getBase() {
        const myself = this;
        return this.buildings.bases()
            .filter(function (base) {
            return base.getArmy() == myself;
        })[0];
    }
    getBuildings() {
        const myself = this;
        return this.buildings.all().filter(function (building) {
            return building.getArmy() == myself;
        });
    }
    getVehicles() {
        const myself = this;
        return this.vehicles.all().filter(function (vehicle) {
            return vehicle.getArmy() == myself;
        });
    }
    getSharedMemory() {
        return this.sharedMemory;
    }
}
exports.Army = Army;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Strategy {
    constructor() {
        this.attacking = false;
    }
    attack() {
        this.attacking = true;
    }
    defend() {
        this.attacking = false;
    }
    isAttacking() {
        return this.attacking;
    }
    isDefending() {
        return !this.attacking;
    }
}
exports.Strategy = Strategy;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class JukeBox {
    constructor(game) {
        this.musicOn = true;
        this.soundOn = true;
        this.music = game.add.audio('music');
        this.music.play('', 0, 1, true);
        this.explosion = game.add.audio('explosion');
        this.blaster = game.add.audio('blaster');
    }
    switchMusic() {
        this.musicOn = !this.musicOn;
        if (this.musicOn) {
            this.music.resume();
        }
        else {
            this.music.pause();
        }
    }
    switchSound() {
        this.soundOn = !this.soundOn;
    }
    playBlaster() {
        if (this.soundOn) {
            this.blaster.play('', 0, 0.3, false, false);
        }
    }
    playExplosion() {
        if (this.soundOn) {
            this.explosion.play('', 0, 0.7, false, false);
        }
    }
    destroy() {
        this.music.destroy();
        this.explosion.destroy();
        this.blaster.destroy();
    }
}
exports.JukeBox = JukeBox;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __webpack_require__(14);
const Mine_1 = __webpack_require__(15);
class BuildingRepository {
    constructor() {
        this.buildings = [];
    }
    all() {
        return this.buildings;
    }
    bases() {
        return this.buildings.filter(function (building) { return building instanceof Base_1.Base; });
    }
    mines() {
        return this.buildings.filter(function (building) { return building instanceof Mine_1.Mine; });
    }
    add(building) {
        this.buildings.push(building);
    }
    length() {
        return this.buildings.length;
    }
}
exports.BuildingRepository = BuildingRepository;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Building_1 = __webpack_require__(7);
class Generator extends Building_1.Building {
    constructor(group, x, y, army, key, frame) {
        super(group, x, y, army, key, frame);
        this.maxHealth = 300;
        this.health = this.maxHealth;
        this.anchor.setTo(.5, .5);
        group.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.immovable = true;
        this.body.allowGravity = false;
        this.body.setCircle(28, -6, 6);
        this.inputEnabled = true;
        this.animations.add('generating', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], 5, true);
        this.animations.add('destroyed', [15], 5, true);
        this.animations.play('generating');
        group.add(this);
    }
    getStatus() {
        return this.animations.currentAnim.name;
    }
}
exports.Generator = Generator;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Oil_1 = __webpack_require__(20);
class ItemRepository {
    constructor() {
        this.items = [];
    }
    all() {
        return this.items;
    }
    oils() {
        return this.items.filter(function (item) {
            return item instanceof Oil_1.Oil;
        });
    }
    add(item) {
        this.items.push(item);
    }
    remove(item) {
        const index = this.items.indexOf(item);
        this.items.splice(index, 1);
    }
    length() {
        return this.items.length;
    }
    get(index) {
        return this.items[index];
    }
}
exports.ItemRepository = ItemRepository;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class VehicleRepository {
    constructor() {
        this.vehicles = [];
    }
    all() {
        return this.vehicles;
    }
    add(vehicle) {
        this.vehicles.push(vehicle);
    }
    remove(vehicle) {
        const index = this.vehicles.indexOf(vehicle);
        this.vehicles.splice(index, 1);
    }
    length() {
        return this.vehicles.length;
    }
}
exports.VehicleRepository = VehicleRepository;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const VehicleBrain_1 = __webpack_require__(4);
const State_1 = __webpack_require__(3);
/**
 * Defending FSM
 * - Wander Go to hurted Unit -> healing
 * - Wander Go to hurted Building -> healing
 */
class EngineerDefendBrain extends VehicleBrain_1.VehicleBrain {
    constructor(engineer, pathfinder) {
        super();
        this.explore = () => {
            const hurtedFriend = this.host.getCamera().closestVisibleHurtedFriendVehicle(this.host);
            const damagedBuilding = this.host.getRadar().closestKnownRepairableFriendBuilding(this.host.getPosition().clone());
            if (hurtedFriend) {
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('repair vehicle', this.repairVehicle));
            }
            else if (damagedBuilding && damagedBuilding.getPosition()) {
                this.fsm.popState();
                this.path = this.pathfinder.findPhaserPointPath(this.host.getPosition().clone(), damagedBuilding.getPosition().clone());
                this.fsm.pushState(new State_1.State('go to building', this.gotoBuilding));
            }
            else {
                this.host.getSteeringComputer().wander();
                this.host.getSteeringComputer().avoidCollision(this.host.getRadar());
                this.host.getSteeringComputer().reactToCollision(this.host.getBody());
            }
        };
        this.repairVehicle = () => {
            const hurtedFriend = this.host.getCamera().closestVisibleHurtedFriendVehicle(this.host);
            if (hurtedFriend !== null) {
                const distance = this.host.getPosition().distance(hurtedFriend.getPosition());
                if (distance > (this.host.getRepairScope() / 2)) {
                    this.host.getSteeringComputer().pursuing(hurtedFriend);
                }
                this.host.repairVehicle(hurtedFriend);
            }
            else {
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('explore', this.explore));
            }
        };
        this.gotoBuilding = () => {
            const canRepairBuilding = this.path && this.path.lastNode() && this.host.getPosition().distance(this.path.lastNode()) < this.host.getRepairScope();
            const hurtedFriend = this.host.getCamera().closestVisibleHurtedFriendVehicle(this.host);
            if (hurtedFriend) {
                this.fsm.popState();
                this.path = null;
                this.fsm.pushState(new State_1.State('repair vehicle', this.repairVehicle));
            }
            else if (!canRepairBuilding) {
                this.host.getSteeringComputer().pathFollowing(this.path);
                this.host.getSteeringComputer().reactToCollision(this.host.getBody());
            }
            else {
                this.path = null;
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('repair building', this.repairBuilding));
            }
        };
        this.repairBuilding = () => {
            const building = this.host.getRadar().closestKnownRepairableFriendBuilding(this.host.getPosition().clone());
            const damaged = building && building.isDamaged();
            const canRepair = building && building.getPosition() && this.host.getPosition().distance(building.getPosition()) < this.host.getRepairScope();
            const hurtedFriend = this.host.getCamera().closestVisibleHurtedFriendVehicle(this.host);
            if (hurtedFriend) {
                this.fsm.pushState(new State_1.State('repair vehicle', this.repairVehicle));
            }
            else if (damaged && canRepair) {
                // TODO: should be implemented as a proper behavior
                this.host.getSteeringComputer().reset();
                this.host.getBody().velocity = new Phaser.Point(0, 0);
                this.host.repairBuilding(building);
            }
            else {
                this.fsm.pushState(new State_1.State('explore', this.explore));
            }
        };
        this.host = engineer;
        this.pathfinder = pathfinder;
        this.fsm.pushState(new State_1.State('explore', this.explore));
    }
}
exports.EngineerDefendBrain = EngineerDefendBrain;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const VehicleBrain_1 = __webpack_require__(4);
const State_1 = __webpack_require__(3);
/**
 * Wander Collect -> Go to mine -> Load -> Go to base -> Unload -> Go to mine
 * Wander Oil -> Go to oil -> Build mine (destroy)
 */
class MinerCollectBrain extends VehicleBrain_1.VehicleBrain {
    constructor(miner, pathfinder) {
        super();
        this.explore = () => {
            const oil = this.host.getRadar().closestKnownCollectableOil(this.host.getPosition());
            const mine = this.host.getRadar().closestExploitableMine(this.host.getPosition());
            const base = this.host.getRadar().closestBase(this.host.getPosition());
            const knowBaseAndMine = mine != null && base != null;
            const knowMinePlaceholder = oil != null;
            if (knowBaseAndMine) {
                this.path = this.pathfinder.findPhaserPointPath(this.host.getPosition().clone(), mine.getPosition().clone());
                if (this.path) {
                    this.fsm.popState();
                    this.fsm.pushState(new State_1.State('go to mine', this.gotoMine));
                }
            }
            else if (knowMinePlaceholder) {
                this.path = this.pathfinder.findPhaserPointPath(this.host.getPosition().clone(), oil.getPosition().clone());
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('go to oil', this.gotoOil));
            }
            else {
                this.host.getSteeringComputer().wander();
                this.host.getSteeringComputer().reactToCollision(this.host.getBody());
                this.host.getSteeringComputer().avoidCollision(this.host.getRadar());
            }
        };
        this.gotoOil = () => {
            const exploitableMine = this.host.getRadar().closestExploitableMine(this.host.getPosition());
            const oil = this.host.getRadar().closestKnownCollectableOil(this.host.getPosition());
            const distanceToOil = this.path && this.path.lastNode() ? this.host.getPosition().distance(this.path.lastNode()) : 10000;
            const lookForOilPosition = !oil;
            const canGoToMinePlaceholder = distanceToOil > this.host.getBuildingScope();
            const canBuildMine = distanceToOil < this.host.getBuildingScope();
            if (exploitableMine) {
                this.path = this.pathfinder.findPhaserPointPath(this.host.getPosition().clone(), exploitableMine.getPosition().clone());
                if (this.path) {
                    this.fsm.popState();
                    this.fsm.pushState(new State_1.State('go to mine', this.gotoMine));
                }
            }
            else if (lookForOilPosition) {
                this.path = null;
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('explore', this.explore));
            }
            else if (canGoToMinePlaceholder) {
                this.host.getSteeringComputer().pathFollowing(this.path);
                this.host.getSteeringComputer().reactToCollision(this.host.getBody());
            }
            else if (canBuildMine) {
                this.path = null;
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('build mine', this.buildMine));
            }
            else {
                this.path = null;
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('explore', this.explore));
            }
        };
        this.buildMine = () => {
            const oil = this.host.getRadar().closestKnownCollectableOil(this.host.getPosition());
            const distanceToOil = oil ? this.host.getPosition().distance(oil.getPosition()) : 10000;
            const canBuildMine = distanceToOil < this.host.getBuildingScope();
            if (canBuildMine) {
                this.host.buildMine(oil);
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('extracting', this.extracting));
            }
            else {
                this.path = null;
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('explore', this.explore));
            }
        };
        this.extracting = () => {
            // IDLE : TODO: unbuild the mine?
        };
        this.gotoMine = () => {
            // TODO: change path is a closer is built?
            const exploitableMine = this.host.getRadar().closestExploitableMine(this.host.getPosition());
            const canLoadOil = this.path && this.host.getPosition().distance(this.path.lastNode()) < this.host.getBuildingScope();
            if (!exploitableMine) {
                this.path = null;
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('explore', this.explore));
            }
            else if (!canLoadOil) {
                this.host.getSteeringComputer().pathFollowing(this.path);
                this.host.getSteeringComputer().reactToCollision(this.host.getBody());
            }
            else {
                this.path = null;
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('load oil', this.loadOil));
            }
        };
        this.loadOil = () => {
            const exploitableMine = this.host.getRadar().closestExploitableMine(this.host.getPosition());
            if (exploitableMine) {
                this.host.loadOil(exploitableMine);
                const base = this.host.getRadar().closestBase(this.host.getPosition());
                this.path = this.pathfinder.findPhaserPointPath(this.host.getPosition().clone(), base.getPosition().clone());
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('go to base', this.gotoBase));
            }
            else {
                this.path = null;
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('explore', this.explore));
            }
        };
        this.gotoBase = () => {
            const canUnloadOil = this.path && this.host.getPosition().distance(this.path.lastNode()) < this.host.getBuildingScope();
            if (!canUnloadOil) {
                this.host.getSteeringComputer().pathFollowing(this.path);
                this.host.getSteeringComputer().reactToCollision(this.host.getBody());
            }
            else {
                this.path = null;
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('unload oil', this.unloadOil));
            }
        };
        this.unloadOil = () => {
            const base = this.host.getRadar().closestBase(this.host.getPosition());
            this.host.unloadOil(base);
            const exploitableMine = this.host.getRadar().closestExploitableMine(this.host.getPosition());
            if (exploitableMine) {
                this.path = this.pathfinder.findPhaserPointPath(this.host.getPosition().clone(), exploitableMine.getPosition().clone());
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('go to mine', this.gotoMine));
            }
            else {
                this.path = null;
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('explore', this.explore));
            }
        };
        this.host = miner;
        this.pathfinder = pathfinder;
        this.fsm.pushState(new State_1.State('explore', this.explore));
    }
}
exports.MinerCollectBrain = MinerCollectBrain;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const VehicleBrain_1 = __webpack_require__(4);
const State_1 = __webpack_require__(3);
class ScoutExploreBrain extends VehicleBrain_1.VehicleBrain {
    constructor(scout) {
        super();
        this.wander = () => {
            const enemy = this.host.getCamera().closestVisibleEnemyVehicle(this.host.getPosition().clone());
            if (enemy !== null) {
                this.fsm.pushState(new State_1.State('evading', this.evading));
            }
            else {
                this.host.getSteeringComputer().wander();
                this.host.getSteeringComputer().avoidCollision(this.host.getRadar());
                this.host.getSteeringComputer().reactToCollision(this.host.getBody());
            }
        };
        this.evading = () => {
            const enemy = this.host.getCamera().closestVisibleEnemyVehicle(this.host.getPosition().clone());
            if (enemy !== null) {
                // TODO: flee makes something more natural when pursuing!
                // TODO: sometimes both vehicle and enemy does not move anymore!
                //this.host.getSteeringComputer().evading(enemy);
                this.host.getSteeringComputer().flee(enemy.getPosition());
                this.host.getSteeringComputer().avoidCollision(this.host.getRadar());
            }
            else {
                this.fsm.popState();
            }
        };
        this.host = scout;
        this.fsm.pushState(new State_1.State('explore', this.wander));
    }
}
exports.ScoutExploreBrain = ScoutExploreBrain;


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const VehicleBrain_1 = __webpack_require__(4);
const State_1 = __webpack_require__(3);
/**
 * Attacking FSM
 * - Wander Attack Vehicle -> Pursuing Enemy + Attack
 * - Wander Attack Building -> Go to Building + Attack
 */
class TankAttackBrain extends VehicleBrain_1.VehicleBrain {
    constructor(tank, pathfinder) {
        super();
        this.explore = () => {
            const knownEnemyBuilding = this.host.getRadar().closestKnownAttackableEnemyBuilding(this.host.getPosition().clone());
            const visibleEnemyVehicle = this.host.getCamera().closestVisibleEnemyVehicle(this.host.getPosition().clone());
            if (visibleEnemyVehicle) {
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('attack vehicle', this.attackVehicle));
            }
            else if (knownEnemyBuilding && knownEnemyBuilding.getPosition()) {
                this.fsm.popState();
                this.path = this.pathfinder.findPhaserPointPath(this.host.getPosition().clone(), knownEnemyBuilding.getPosition().clone());
                this.fsm.pushState(new State_1.State('go to building', this.gotoBuilding));
            }
            else {
                this.host.getSteeringComputer().wander();
                this.host.getSteeringComputer().avoidCollision(this.host.getRadar());
                this.host.getSteeringComputer().reactToCollision(this.host.getBody());
            }
        };
        this.attackVehicle = () => {
            const enemy = this.host.getCamera().closestVisibleEnemyVehicle(this.host.getPosition().clone());
            if (enemy !== null) {
                const distance = this.host.getPosition().distance(enemy.getPosition());
                if (distance > (this.host.getAttackScope() / 2)) {
                    this.host.getSteeringComputer().pursuing(enemy);
                }
                this.host.attackVehicle(enemy);
            }
            else {
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('explore', this.explore));
            }
        };
        this.gotoBuilding = () => {
            const canAttackBuilding = this.path && this.host.getPosition().distance(this.path.lastNode()) < this.host.getAttackScope();
            const visibleEnemyVehicle = this.host.getCamera().closestVisibleEnemyVehicle(this.host.getPosition().clone());
            if (visibleEnemyVehicle) {
                this.fsm.popState();
                this.path = null;
                this.fsm.pushState(new State_1.State('attack vehicle', this.attackVehicle));
            }
            else if (!canAttackBuilding) {
                this.host.getSteeringComputer().pathFollowing(this.path);
                this.host.getSteeringComputer().reactToCollision(this.host.getBody());
            }
            else {
                this.path = null;
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('attack building', this.attackBuilding));
            }
        };
        this.attackBuilding = () => {
            const building = this.host.getRadar().closestKnownAttackableEnemyBuilding(this.host.getPosition().clone());
            const notDestroyed = building && !building.isDestroyed();
            const canAttack = building && this.host.getPosition().distance(building.getPosition()) < this.host.getAttackScope();
            const visibleEnemyVehicle = this.host.getCamera().closestVisibleEnemyVehicle(this.host.getPosition().clone());
            if (visibleEnemyVehicle) {
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('attack vehicle', this.attackVehicle));
            }
            else if (notDestroyed && canAttack) {
                // TODO: should be implemented as a proper behavior
                this.host.getSteeringComputer().reset();
                this.host.getBody().velocity = new Phaser.Point(0, 0);
                this.host.attackBuilding(building);
            }
            else {
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('explore', this.explore));
            }
        };
        this.host = tank;
        this.pathfinder = pathfinder;
        this.fsm.pushState(new State_1.State('explore', this.explore));
    }
}
exports.TankAttackBrain = TankAttackBrain;


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const VehicleBrain_1 = __webpack_require__(4);
const State_1 = __webpack_require__(3);
const Miner_1 = __webpack_require__(1);
/**
 * Defending FSM
 * - Wander Defend Unit (no Mine) -> escorting Miner
 * - Wander Defend Mine -> patrol Mine to Base
 */
class TankDefendBrain extends VehicleBrain_1.VehicleBrain {
    constructor(tank, pathfinder) {
        super();
        this.explore = () => {
            const visibleEnemy = this.host.getCamera().closestVisibleEnemyVehicle(this.host.getPosition().clone());
            const closestMiner = this.host.getRadar().closestTeamate(this.host.getPosition().clone(), Miner_1.Miner);
            const closestMine = this.host.getRadar().closestExploitableMine(this.host.getPosition());
            const closestBase = this.host.getRadar().closestBase(this.host.getPosition());
            if (visibleEnemy) {
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('attack vehicle', this.attackVehicle));
            }
            else if (closestMine) {
                this.path = this.pathfinder.findPhaserPointPath(closestMine.getPosition().clone(), closestBase.getPosition().clone());
                this.fsm.pushState(new State_1.State('protect mine', this.protectingMine));
            }
            else if (closestMiner) {
                this.fsm.pushState(new State_1.State('escorting', this.escortingMiner));
            }
            else {
                this.host.getSteeringComputer().wander();
                this.host.getSteeringComputer().avoidCollision(this.host.getRadar());
                this.host.getSteeringComputer().reactToCollision(this.host.getBody());
            }
        };
        this.escortingMiner = () => {
            const visibleEnemy = this.host.getCamera().closestVisibleEnemyVehicle(this.host.getPosition().clone());
            const closestMiner = this.host.getRadar().closestTeamate(this.host.getPosition().clone(), Miner_1.Miner);
            const closestBase = this.host.getRadar().closestBase(this.host.getPosition());
            const closestMine = this.host.getRadar().closestExploitableMine(this.host.getPosition());
            if (visibleEnemy) {
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('attack vehicle', this.attackVehicle));
            }
            else if (closestMine) {
                this.path = this.pathfinder.findPhaserPointPath(closestMine.getPosition().clone(), closestBase.getPosition().clone());
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('protect mine', this.protectingMine));
            }
            else if (closestMiner !== null) {
                this.host.getSteeringComputer().pursuing(closestMiner);
            }
            else {
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('explore', this.explore));
            }
        };
        this.protectingMine = () => {
            const visibleEnemy = this.host.getCamera().closestVisibleEnemyVehicle(this.host.getPosition().clone());
            const closestMine = this.host.getRadar().closestExploitableMine(this.host.getPosition());
            if (visibleEnemy) {
                this.path = null;
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('attack vehicle', this.attackVehicle));
            }
            else if (closestMine && this.path) {
                this.host.getSteeringComputer().pathPatrolling(this.path);
            }
            else {
                this.path = null;
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('explore', this.explore));
            }
        };
        this.attackVehicle = () => {
            const enemy = this.host.getCamera().closestVisibleEnemyVehicle(this.host.getPosition().clone());
            if (enemy !== null) {
                const distance = this.host.getPosition().distance(enemy.getPosition());
                if (distance > (this.host.getAttackScope() / 2)) {
                    this.host.getSteeringComputer().pursuing(enemy);
                }
                this.host.attackVehicle(enemy);
            }
            else {
                this.fsm.popState();
                this.fsm.pushState(new State_1.State('explore', this.explore));
            }
        };
        this.host = tank;
        this.pathfinder = pathfinder;
        this.fsm.pushState(new State_1.State('explore', this.explore));
    }
}
exports.TankDefendBrain = TankDefendBrain;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class StateColors {
    constructor() {
        this.stateColors = {
            'explore': '#93d9f4',
            'go to mine': '#00cd00',
            'go to base': '#00cd00',
            'go to oil': '#00cd00',
            'repair building': '#00cd00',
            'repair vehicle': '#00cd00',
            'patrolling': '#eedb13',
            'escorting': '#eedb13',
            'protect mine': '#eedb13',
            'pursuing': '#ee8400',
            'go to building': '#ee8400',
            'evading': '#ff4040',
            'attack vehicle': '#ff4040',
            'attack building': '#ff4040',
        };
    }
    getColor(state) {
        let color = this.stateColors[state];
        if (color == undefined) {
            color = '#FFFFFF';
        }
        return color;
    }
}
exports.StateColors = StateColors;


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class SharedMemory {
    constructor(map) {
        this.knownTiles = map.getGrounds().reduce(function (rows, row) {
            rows.push(row.reduce(function (row, ground) {
                row.push(false);
                return row;
            }, []));
            return rows;
        }, []);
        this.tileSize = map.getTileSize();
        this.knownOils = [];
        this.knownEnemyBuildings = [];
    }
    registerGrounds(position, visibilityScope) {
        const centerX = Math.ceil((position.x) / this.tileSize) - 1;
        const centerY = Math.ceil((position.y) / this.tileSize) - 1;
        const radius = Math.ceil(Math.ceil(visibilityScope / this.tileSize)) - 1;
        const points = this.getCirclePoints(centerX, centerY, radius);
        const knownTiles = this.knownTiles;
        points.map(function (point) {
            if (point.x >= 0 && point.y >= 0 && point.y < knownTiles.length && point.x < knownTiles[point.y].length) {
                knownTiles[point.y][point.x] = true;
            }
        });
    }
    getKnownTiles() {
        return this.knownTiles;
    }
    registerOil(oil) {
        let known = false;
        this.knownOils.forEach(function (knownOil) {
            if (knownOil == oil) {
                known = true;
            }
        });
        if (!known) {
            this.knownOils.push(oil);
        }
    }
    getKnownOils() {
        this.knownOils = this.knownOils.reduce(function (stillExistingOils, oil) {
            if (oil.body != null) {
                stillExistingOils.push(oil);
            }
            return stillExistingOils;
        }, []);
        return this.knownOils;
    }
    registerEnemyBuilding(building) {
        let known = false;
        this.knownEnemyBuildings.forEach(function (knownBuilding) {
            if (knownBuilding == building) {
                known = true;
            }
        });
        if (!known) {
            this.knownEnemyBuildings.push(building);
        }
    }
    getKnownEnemyBuildings() {
        // TODO: destroy?!
        return this.knownEnemyBuildings;
    }
    getCirclePoints(centerX, centerY, radius) {
        const points = [];
        for (let i = -radius; i <= radius; i += 1) {
            for (let j = -radius; j <= radius; j += 1) {
                if (Math.round(Math.sqrt(i * i + j * j)) <= radius) {
                    points.push({ x: i + centerX, y: j + centerY });
                }
            }
        }
        return points;
    }
}
exports.SharedMemory = SharedMemory;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Camera {
    constructor(items, buildings, vehicles, army, visibilityScope) {
        this.items = items;
        this.buildings = buildings;
        this.vehicles = vehicles;
        this.army = army;
        this.visibilityScope = visibilityScope;
    }
    getVisibilityScope() {
        return this.visibilityScope;
    }
    closestVisibleHurtedFriendVehicle(myself) {
        const position = myself.getPosition();
        class VehicleAndDistance {
            constructor(vehicle, distance) {
                this.vehicle = vehicle;
                this.distance = distance;
            }
        }
        const transfoAddDistance = function (vehicle) {
            return new VehicleAndDistance(vehicle, position.distance(vehicle.getPosition()));
        };
        const myArmy = this.army;
        const visibilityScope = this.visibilityScope;
        const closestFriends = this.vehicles.all()
            .filter(function (vehicle) {
            return vehicle.getArmy() == myArmy;
        })
            .filter(function (vehicle) {
            return vehicle != myself;
        })
            .filter(function (vehicle) {
            return vehicle.isHurted();
        })
            .reduce(function (vehiclesWithDistance, vehicle) {
            vehiclesWithDistance.push(transfoAddDistance(vehicle));
            return vehiclesWithDistance;
        }, [])
            .sort(function (vehicle1, vehicle2) {
            return vehicle1.distance > vehicle2.distance ? 1 : -1;
        })
            .filter(function (vehicleAndDistance) {
            return vehicleAndDistance.distance < visibilityScope;
        });
        return closestFriends.length > 0 ? closestFriends[0].vehicle : null;
    }
    closestVisibleEnemyVehicle(position) {
        class VehicleAndDistance {
            constructor(vehicle, distance) {
                this.vehicle = vehicle;
                this.distance = distance;
            }
        }
        const transfoAddDistance = function (vehicle) {
            return new VehicleAndDistance(vehicle, position.distance(vehicle.getPosition()));
        };
        const myArmy = this.army;
        const visibilityScope = this.visibilityScope;
        const closestEnemies = this.vehicles.all()
            .filter(function (vehicle) {
            return vehicle.getArmy() != myArmy;
        })
            .reduce(function (vehiclesWithDistance, vehicle) {
            vehiclesWithDistance.push(transfoAddDistance(vehicle));
            return vehiclesWithDistance;
        }, [])
            .sort(function (vehicle1, vehicle2) {
            return vehicle1.distance > vehicle2.distance ? 1 : -1;
        })
            .filter(function (vehicleAndDistance) {
            return vehicleAndDistance.distance < visibilityScope;
        });
        return closestEnemies.length > 0 ? closestEnemies[0].vehicle : null;
    }
    visibleOils(position) {
        class OilAndDistance {
            constructor(oil, distance) {
                this.oil = oil;
                this.distance = distance;
            }
        }
        const transfoAddDistance = function (oil) {
            return new OilAndDistance(oil, position.distance(oil.getPosition()));
        };
        const visibilityScope = this.visibilityScope;
        const visibleOils = this.items.oils()
            .reduce(function (oilsWithDistance, oil) {
            oilsWithDistance.push(transfoAddDistance(oil));
            return oilsWithDistance;
        }, [])
            .sort(function (oil1, oil2) {
            return oil1.distance > oil2.distance ? 1 : -1;
        })
            .filter(function (oilAndDistance) {
            return oilAndDistance.distance < visibilityScope && !oilAndDistance.oil.hasBeenCollected();
        }).reduce(function (visibleOils, visibleOilAndDistance) {
            visibleOils.push(visibleOilAndDistance.oil);
            return visibleOils;
        }, []);
        return visibleOils;
    }
    visibleEnemyBuildings(position) {
        class BuildingAndDistance {
            constructor(building, distance) {
                this.building = building;
                this.distance = distance;
            }
        }
        const transfoAddDistance = function (building) {
            return new BuildingAndDistance(building, position.distance(building.getPosition()));
        };
        const visibilityScope = this.visibilityScope;
        const myArmy = this.army;
        const visibleBuildings = this.buildings.all()
            .filter(function (building) {
            return building.getArmy() != myArmy;
        })
            .reduce(function (buildingsWithDistance, building) {
            buildingsWithDistance.push(transfoAddDistance(building));
            return buildingsWithDistance;
        }, [])
            .sort(function (building1, building2) {
            return building1.distance > building2.distance ? 1 : -1;
        })
            .filter(function (buildingAndDistance) {
            return buildingAndDistance.distance < visibilityScope;
        }).reduce(function (visibleBuildings, visibleBuildingAndDistance) {
            visibleBuildings.push(visibleBuildingAndDistance.building);
            return visibleBuildings;
        }, []);
        return visibleBuildings;
    }
}
exports.Camera = Camera;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Radar {
    constructor(items, buildings, vehicles, army, sharedMemory) {
        this.items = items;
        this.buildings = buildings;
        this.vehicles = vehicles;
        this.army = army;
        this.sharedMemory = sharedMemory;
    }
    closestExploitableMine(position) {
        class MineAndDistance {
            constructor(mine, distance) {
                this.mine = mine;
                this.distance = distance;
            }
        }
        const transfoAddDistance = function (mine) {
            return new MineAndDistance(mine, position.distance(mine.getPosition()));
        };
        const myArmy = this.army;
        const closestMines = this.buildings.mines()
            .filter(function (mine) {
            return mine.getArmy() == myArmy;
        })
            .reduce(function (minesWithDistance, mine) {
            minesWithDistance.push(transfoAddDistance(mine));
            return minesWithDistance;
        }, [])
            .sort(function (mine1, mine2) {
            return mine1.distance > mine2.distance ? 1 : -1;
        })
            .filter(function (mineAndDistance) {
            return mineAndDistance.mine.isExtracting();
        });
        return closestMines.length > 0 ? closestMines[0].mine : null;
    }
    closestBase(position) {
        class BaseAndDistance {
            constructor(base, distance) {
                this.base = base;
                this.distance = distance;
            }
        }
        const transfoAddDistance = function (base) {
            return new BaseAndDistance(base, position.distance(base.getPosition()));
        };
        const myArmy = this.army;
        const closestBases = this.buildings.bases()
            .filter(function (base) {
            return base.getArmy() == myArmy;
        })
            .reduce(function (basesWithDistance, base) {
            basesWithDistance.push(transfoAddDistance(base));
            return basesWithDistance;
        }, [])
            .sort(function (base1, base2) {
            return base1.distance > base2.distance ? 1 : -1;
        });
        return closestBases.length > 0 ? closestBases[0].base : null;
    }
    closestTeamate(position, type) {
        class VehicleAndDistance {
            constructor(vehicle, distance) {
                this.vehicle = vehicle;
                this.distance = distance;
            }
        }
        const transfoAddDistance = function (vehicle) {
            return new VehicleAndDistance(vehicle, position.distance(vehicle.getPosition()));
        };
        const myArmy = this.army;
        const closestTeamates = this.vehicles.all()
            .filter(function (vehicle) {
            return vehicle.getArmy() == myArmy;
        })
            .filter(function (vehicle) {
            return vehicle instanceof type;
        })
            .reduce(function (vehiclesWithDistance, vehicle) {
            vehiclesWithDistance.push(transfoAddDistance(vehicle));
            return vehiclesWithDistance;
        }, [])
            .sort(function (vehicle1, vehicle2) {
            return vehicle1.distance > vehicle2.distance ? 1 : -1;
        });
        return closestTeamates.length > 0 ? closestTeamates[0].vehicle : null;
    }
    closestKnownCollectableOil(position) {
        class OilAndDistance {
            constructor(oil, distance) {
                this.oil = oil;
                this.distance = distance;
            }
        }
        const transfoAddDistance = function (oil) {
            return new OilAndDistance(oil, position.distance(oil.getPosition()));
        };
        const closestOils = this.sharedMemory.getKnownOils()
            .reduce(function (oilsWithDistance, oil) {
            oilsWithDistance.push(transfoAddDistance(oil));
            return oilsWithDistance;
        }, [])
            .sort(function (oil1, oil2) {
            return oil1.distance > oil2.distance ? 1 : -1;
        })
            .filter(function (oilAndDistance) {
            return !oilAndDistance.oil.hasBeenCollected();
        });
        return closestOils.length > 0 ? closestOils[0].oil : null;
    }
    closestKnownAttackableEnemyBuilding(position) {
        class BuildingAndDistance {
            constructor(building, distance) {
                this.building = building;
                this.distance = distance;
            }
        }
        const transfoAddDistance = function (building) {
            return new BuildingAndDistance(building, position.distance(building.getPosition()));
        };
        const closestBuildings = this.sharedMemory.getKnownEnemyBuildings()
            .reduce(function (buildingsWithDistance, building) {
            buildingsWithDistance.push(transfoAddDistance(building));
            return buildingsWithDistance;
        }, [])
            .sort(function (building1, building2) {
            return building1.distance > building2.distance ? 1 : -1;
        })
            .filter(function (buildingAndDistance) {
            return !buildingAndDistance.building.isDestroyed();
        });
        return closestBuildings.length > 0 ? closestBuildings[0].building : null;
    }
    closestKnownRepairableFriendBuilding(position) {
        class BuildingAndDistance {
            constructor(building, distance) {
                this.building = building;
                this.distance = distance;
            }
        }
        const transfoAddDistance = function (building) {
            return new BuildingAndDistance(building, position.distance(building.getPosition()));
        };
        const closestBuildings = this.army.getBuildings()
            .reduce(function (buildingsWithDistance, building) {
            buildingsWithDistance.push(transfoAddDistance(building));
            return buildingsWithDistance;
        }, [])
            .sort(function (building1, building2) {
            return building1.distance > building2.distance ? 1 : -1;
        })
            .filter(function (buildingAndDistance) {
            return buildingAndDistance.building.isDamaged();
        });
        return closestBuildings.length > 0 ? closestBuildings[0].building : null;
    }
    closestObstacle(position, visibilityScope) {
        class BuildingAndDistance {
            constructor(building, distance) {
                this.building = building;
                this.distance = distance;
            }
        }
        const transfoAddDistance = function (building) {
            return new BuildingAndDistance(building, position.distance(building.getPosition()));
        };
        const closestBuildings = this.buildings.all()
            .reduce(function (buildingsWithDistance, building) {
            buildingsWithDistance.push(transfoAddDistance(building));
            return buildingsWithDistance;
        }, [])
            .filter(function (building) {
            return building.distance < visibilityScope;
        })
            .sort(function (building1, building2) {
            return building1.distance > building2.distance ? 1 : -1;
        });
        return closestBuildings.length > 0 ? closestBuildings[0].building : null;
    }
}
exports.Radar = Radar;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Radio {
    constructor(camera, radar, sharedMemory) {
        this.camera = camera;
        this.radar = radar;
        this.sharedMemory = sharedMemory;
    }
    communicate(position) {
        this.sharedMemory.registerGrounds(position, this.camera.getVisibilityScope());
        const visibleOils = this.camera.visibleOils(position);
        const sharedMemory = this.sharedMemory;
        visibleOils.map(function (visibleOil) {
            sharedMemory.registerOil(visibleOil);
        });
        const visibleEnemyBuildings = this.camera.visibleEnemyBuildings(position);
        visibleEnemyBuildings.map(function (visibleEnemyBuilding) {
            sharedMemory.registerEnemyBuilding(visibleEnemyBuilding);
        });
    }
}
exports.Radio = Radio;


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(22);


/***/ })
/******/ ]);