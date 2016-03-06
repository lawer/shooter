/// <reference path="phaser/phaser.d.ts"/>

class mainState extends Phaser.State {
    game:Phaser.Game;
    private sea:Phaser.TileSprite;
    private bullet:Phaser.Sprite;
    private player:Player;
    private enemy:Phaser.Sprite;

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
        this.bullet = this.add.sprite(400, 300, 'bullet');
        this.bullet.anchor.setTo(0.5, 0.5);
        this.physics.enable(this.bullet, Phaser.Physics.ARCADE);
        this.bullet.body.velocity.y = -500;

        this.player = new Player(this.game, 400, 550, 'player', 0);
        this.add.existing(this.player);

        this.enemy = this.add.sprite(400, 200, 'greenEnemy');
        // Definimos una animación marcando los "frames" que definen la animación y los fps
        this.enemy.animations.add('fly', [0, 1, 2], 20, true);
        // Reproducimos la animación en bucle.
        this.enemy.play('fly');
        this.enemy.anchor.setTo(0.5, 0.5);
        this.physics.enable(this.enemy, Phaser.Physics.ARCADE);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update():void {
        super.update();
        this.sea.tilePosition.y += 0.2;
        this.physics.arcade.overlap(this.bullet, this.enemy, this.enemyHit, null, this);

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

    }

    enemyHit(bullet:Phaser.Sprite, enemy:Phaser.Sprite):void {
        this.bullet.kill();
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
