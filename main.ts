/// <reference path="phaser/phaser.d.ts"/>

class mainState extends Phaser.State {
    private sea:Phaser.TileSprite;
    private bullet:Phaser.Sprite;
    private player:Player;
    private enemy:Phaser.Sprite;
    private bullets:Phaser.Group;
    private nextShotAt:number;
    private shotDelay:number;
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

        // TileSprite: Se repite automáticamente
        this.sea = this.add.tileSprite(0, 0, 800, 600, 'background');

        this.player = new Player(this.game, 400, 550, 'player', 0);
        this.add.existing(this.player);

        this.enemy = this.add.sprite(400, 200, 'greenEnemy');
        // Definimos una animación marcando los "frames" que definen la animación y los fps
        this.enemy.animations.add('fly', [0, 1, 2], 20, true);
        // Reproducimos la animación en bucle.
        this.enemy.play('fly');
        this.enemy.anchor.setTo(0.5, 0.5);
        this.physics.enable(this.enemy, Phaser.Physics.ARCADE);

        // Add an empty sprite group into our game
        this.bullets = this.add.group();
        this.bullets.classType = Bullet;

        // Enable physics to the whole sprite group
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        //Agregamos 100 sprites de bala al grupo.
        // Por defecto se usa el primes sprite del "sprite sheet" y se pone
        // el estado inicial como no existente (muerto).
        this.bullets.createMultiple(100, 'bullet');

        this.nextShotAt = 0;
        this.shotDelay = 100;

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update():void {
        super.update();
        this.sea.tilePosition.y += 0.2;

        this.physics.arcade.overlap(
            this.bullets, this.enemy, this.enemyHit, null, this
        );

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
            this.fire();
        }
    }

    fire():void {
        if (this.nextShotAt > this.time.now) {
            return;
        }

        this.nextShotAt = this.time.now + this.shotDelay;

        // Buscamos la primera bala muerta que haya
        var bullet = this.bullets.getFirstExists(false);

        // Revivimos el sprite y lo ponemos en la nueva posición
        bullet.reset(this.player.x, this.player.y - 20);

        bullet.body.velocity.y = -500;
    }

    enemyHit(bullet:Phaser.Sprite, enemy:Phaser.Sprite):void {
        bullet.kill();
        this.enemy.kill();
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

    constructor(game:Phaser.Game, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number) {
        super(game, x, y, key, frame);

        this.anchor.setTo(0.5, 0.5);
        this.animations.add('fly', [0, 1, 2], 20, true);
        this.play('fly');
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.speed = 300;
        this.body.collideWorldBounds = true;
    }
}

class Bullet extends Phaser.Sprite {
    constructor(game:Phaser.Game, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture, frame:string|number) {
        super(game, x, y, key, frame);

        // Fijamos el "anchor"
        this.anchor.setTo(0.5, 0.5);

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
