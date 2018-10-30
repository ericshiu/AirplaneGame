import Phaser from 'phaser'
export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#ffffff'
  }
  preload () {
    this.load.image('gameover', 'assets/images/gameover.png')
  }
  create () {
    var goMenuButton = this.add.button(this.world.centerX / 2, this.world.centerX, 'gameover', this.goMenu, this)
    goMenuButton.scale.setTo(0.6, 0.6)
  }
  goMenu () {
    this.state.start('Meun')
  }
}
