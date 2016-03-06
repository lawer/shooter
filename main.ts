/// <reference path="phaser/phaser.d.ts"/>

class mainState extends Phaser.State {
    private sea:Phaser.TileSprite;
    private player:Player;
    private bullets:Phaser.Group;
    private enemies:Phaser.Group;

    private nextEnemyAt:number = 0;
    private enemyDelay:number = 1000;

    private cursors:Phaser.CursorKeys;

    preload():void {
        super.preload();

        this.load.image('background', 'assets/sea.png');
        this.load.image('bullet', 'assets/bullet.png');

        // Cargamos un SpriteSheet: Conjunto de imágenes en una sola
        // Pasamos como parámetros la altura y anchura de cada imagen
        this.load.spritesheet('greenEnemy', 'assets/enemy.png', 32, 32);
        this.load.spritesheet('explosion', 'assets/explosion.png', 32, 32);
        this.load.spritesheet('player', 'assets/player.png', 64, 64);
    }

    create():void {
        super.create();
        this.createBackground();
        this.createBullets();
        this.createPlayer();
        this.createEnemies();

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    private createEnemies() {
        this.enemies = this.add.group();
        this.enemies.classType = GreenEnemy;
        this.enemies.createMultiple(50, 'greenEnemy');
    };

    private createPlayer() {
        this.player = new Player(this.game, 400, 550, 'player', 0, this.bullets);
        this.add.existing(this.player);
    };

    private createBullets() {
        this.bullets = this.add.group();
        this.bullets.classType = Bullet;

        //Agregamos 100 sprites de bala al grupo.
        // Por defecto se usa el primes sprite del "sprite sheet" y se pone
        // el estado inicial como no existente (muerto).
        this.bullets.createMultiple(100, 'bullet');
    };

    private createBackground() {
        // TileSprite: Se repite automáticamente
        this.sea = this.add.tileSprite(0, 0, 800, 600, 'background');
    };

    update():void {
        super.update();
        this.sea.tilePosition.y += 0.2;

        this.physics.arcade.overlap(
            this.bullets, this.enemies, this.enemyHit, null, this
        );

        this.updatePlayer();
        this.spawnEnemy();
    }

    private updatePlayer() {
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -this.player.speed;
        } else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = this.player.speed;
        }

        if (this.cursors.up.isDown) {
            this.player.body.velocity.y = -this.player.speed;
        } else if (this.cursors.down.isDown) {
            this.player.body.velocity.y = this.player.speed;
        }

        if (this.input.activePointer.isDown &&
            this.physics.arcade.distanceToPointer(this.player) > 15) {
            this.physics.arcade.moveToPointer(this.player, this.player.speed);
        }

        if (this.input.keyboard.isDown(Phaser.Keyboard.Z) ||
            this.input.activePointer.isDown) {
            this.player.fire();
        }
    };

    spawnEnemy():void {
        if (this.nextEnemyAt < this.time.now && this.enemies.countDead() > 0) {
            var enemy = this.enemies.getFirstExists(false);
            // spawn at a random location top of the screen
            enemy.reset(this.rnd.integerInRange(20, 780), 0);
            // also randomize the speed
            enemy.body.velocity.y = this.rnd.integerInRange(30, 60);
            enemy.play('fly');

            this.nextEnemyAt = this.time.now + this.enemyDelay;
        }
    }

    enemyHit(bullet:Phaser.Sprite, enemy:Phaser.Sprite):void {
        bullet.kill();
        enemy.kill();

        var explosion = this.add.sprite(enemy.x, enemy.y, 'explosion');
        explosion.anchor.setTo(0.5, 0.5);
        explosion.animations.add('boom');
        //El false indica que no se repita la animación y el true que se mate el sprite al terminar
        explosion.play('boom', 15, false, true);
    }

    render():void {
        super.render();
        //this.game.debug.body(this.bullet);
        //this.game.debug.body(this.enemy);
    }
}

class Player extends Phaser.Sprite {
    speed:number;
    private nextShotAt:number;
    private shotDelay:number;
    private bullets:Phaser.Group;

    constructor(game:Phaser.Game, x:number, y:number, key:string, frame:string|number, bullets:Phaser.Group) {
        super(game, x, y, key, frame);

        this.anchor.setTo(0.5, 0.5);
        this.animations.add('fly', [0, 1, 2], 20, true);
        this.play('fly');

        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.speed = 300;
        this.body.collideWorldBounds = true;

        this.nextShotAt = 0;
        this.shotDelay = 100;
        this.bullets = bullets;
    }

    fire():void {
        if (this.nextShotAt > this.game.time.now) {
            return;
        }

        this.nextShotAt = this.game.time.now + this.shotDelay;

        // Buscamos la primera bala muerta que haya
        var bullet = this.bullets.getFirstExists(false);

        // Revivimos el sprite y lo ponemos en la nueva posición
        bullet.reset(this.x, this.y - 20);

        bullet.body.velocity.y = -500;
    }

    update():void {
        super.update();
    }
}

class GreenEnemy extends Phaser.Sprite {

    constructor(game:Phaser.Game, x:number, y:number, key:string, frame:string|number) {
        super(game, x, y, key, frame);

        this.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        this.outOfBoundsKill = true;
        this.checkWorldBounds = true;

        this.animations.add('fly', [0, 1, 2], 20, true);
    }
}

class Bullet extends Phaser.Sprite {

    constructor(game:Phaser.Game, x:number, y:number, key:string, frame:string|number) {
        super(game, x, y, key, frame);

        // Fijamos el "anchor"
        this.anchor.setTo(0.5, 0.5);

        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        // Matamos la bala si se sale de los límites de la pantalla
        this.outOfBoundsKill = true;
        this.checkWorldBounds = true;
    }
}


class SimpleGame {
    game:Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');

        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
}

window.onload = () => {
    var game = new SimpleGame();
};
