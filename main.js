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
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.background = this.add.tileSprite(0, 0, 800, 600, 'background');
        this.bullet = this.add.sprite(400, 300, 'bullet');
    };
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
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