/// <reference path="phaser/phaser.d.ts"/>

class mainState extends Phaser.State {
    game: Phaser.Game;
    private background:Phaser.TileSpriteSprite;
    private bullet:Phaser.Sprite;

    private cursor:Phaser.CursorKeys;

    preload():void {
        super.preload();

        this.load.image('background', 'assets/sea.png');
        this.load.image('bullet', 'assets/bullet.png');

    }

    create():void {
        super.create();

        this.background = this.add.tileSprite(0, 0, 800,  600, 'background');
        this.bullet = this.add.sprite(400, 300, 'bullet');
    }

    update():void {
        super.update();
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
