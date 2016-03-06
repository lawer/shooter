/// <reference path="phaser/phaser.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mainState = (function (_super) {
    __extends(mainState, _super);
    function mainState() {
        _super.apply(this, arguments);
    }
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.image('background', 'assets/sea.png');
        this.load.image('bullet', 'assets/bullet.png');
        // Cargamos un SpriteSheet: Conjunto de imágenes en una sola
        // Pasamos como parámetros la altura y anchura de cada imagen
        this.load.spritesheet('greenEnemy', 'assets/enemy.png', 32, 32);
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        // TileSprite: Se repite automáticamente
        this.sea = this.add.tileSprite(0, 0, 800, 600, 'background');
        this.bullet = this.add.sprite(400, 300, 'bullet');
        this.bullet.anchor.setTo(0.5, 0.5);
        this.physics.enable(this.bullet, Phaser.Physics.ARCADE);
        this.bullet.body.velocity.y = -500;
        this.enemy = this.add.sprite(400, 200, 'greenEnemy');
        // Definimos una animación marcando los "frames" que definen la animación y los fps
        this.enemy.animations.add('fly', [0, 1, 2], 20, true);
        // Reproducimos la animación en bucle.
        this.enemy.play('fly');
        this.enemy.anchor.setTo(0.5, 0.5);
    };
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        this.sea.tilePosition.y += 0.2;
    };
    return mainState;
})(Phaser.State);
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');
        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=main.js.map