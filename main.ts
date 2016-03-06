/// <reference path="phaser/phaser.d.ts"/>

class mainState extends Phaser.State {
    game:Phaser.Game;
    private sea:Phaser.TileSpriteSprite;
    private bullet:Phaser.Sprite;
    private enemy:Phaser.Sprite;

    private cursor:Phaser.CursorKeys;

    preload():void {
        super.preload();

        this.load.image('background', 'assets/sea.png');
        this.load.image('bullet', 'assets/bullet.png');

        // Cargamos un SpriteSheet: Conjunto de imágenes en una sola
        // Pasamos como parámetros la altura y anchura de cada imagen
        this.load.spritesheet('greenEnemy', 'assets/enemy.png', 32, 32);
    }

    create():void {
        super.create();

        // TileSprite: Se repite automáticamente
        this.sea = this.add.tileSprite(0, 0, 800, 600, 'background');
        this.bullet = this.add.sprite(400, 300, 'bullet');
        this.bullet.anchor.setTo(0.5, 0.5);

        this.enemy = this.add.sprite(400, 200, 'greenEnemy');
        // Definimos una animación marcando los "frames" que definen la animación y los fps
        this.enemy.animations.add('fly', [0, 1, 2], 20, true);
        // Reproducimos la animación en bucle.
        this.enemy.play('fly');
        this.enemy.anchor.setTo(0.5, 0.5);
    }

    update():void {
        super.update();
        this.sea.tilePosition.y += 0.2;
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
