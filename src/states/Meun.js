import Phaser from 'phaser'
export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#ffffff'
  }
  preload () {
    this.load.image('menu', 'assets/images/start-game.jpg')
  }
  create () {
    var button = this.add.button(60, this.world.height / 2, 'menu', this.startGame, this)
    button.scale.setTo(0.3, 0.3)
  }
  startGame () {
    this.state.start('Boot')
  }
}
