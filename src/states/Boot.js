import Phaser from 'phaser'
let player, bullets, bg, shotAudio, enemys, scoreText, spaceKey
let fireRate = 100
let nextFire = 0
let lestX = 0
let score = 0
export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#EDEEC9'
  }
  preload () {
    this.load.audio('backgroundAudio', 'assets/audio/bgm.mp3')
    this.load.audio('shotAudio', 'assets/audio/shotAudio.mp3')
    this.load.spritesheet('airP', 'assets/images/plane-sprite-png-4.png', 189, 140)
    this.load.spritesheet('bullet', 'assets/images/bullet.png', 39.5, 29)
    this.load.spritesheet('enemy', 'assets/images/enemy.png', 155, 155)
    // this.load.image('background', 'assets/images/sakura_art_nebo.jpg')
    this.load.image('background', 'assets/images/bg.jpg')
  }
  create () {
    // 加入音樂
    var backgroundA = this.add.audio('backgroundAudio')
    shotAudio = this.add.audio('shotAudio')
    // backgroundA.play()
    backgroundA.loopFull()
    // 放入背景圖案
    bg = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'background')
    // 滾動背景
    bg.autoScroll(0, 20)
    bg.smoothed = false
    this.physics.startSystem(Phaser.Physics.ARCADE)
    player = this.add.sprite(0, this.world.height, 'airP')
    this.physics.arcade.enable(player)
    player.scale.setTo(0.5, 0.5)
    player.frame = 2
    player.body.bounce.y = 0.5
    player.body.collideWorldBounds = true
    player.inputEnabled = true
    player.input.enableDrag(false)
    player.animations.add('left', [1], 190, false)
    player.animations.add('right', [3], 190, false)
    // 製作子彈
    bullets = this.add.group()
    bullets.enableBody = true
    bullets.physicsBodyType = Phaser.Physics.ARCADE
    bullets.createMultiple(200, 'bullet', [0, 1, 2, 3])
    bullets.setAll('checkWorldBounds', true)
    bullets.setAll('outOfBoundsKill', true)
    bullets.setAll('anchor.y', 0.5)
    bullets.setAll('scale.x', 0.85)
    bullets.setAll('scale.y', 0.85)
    bullets.callAll('animations.add', 'animations', 'fly3', [0, 1, 2, 3], 4, true)
    // 製作敵人
    enemys = this.add.group()
    enemys.enableBody = true
    enemys.createMultiple(200, 'enemy', [0, 1, 2, 3])
    enemys.setAll('outOfBoundsKill', true)
    enemys.setAll('checkWorldBounds', true)
    enemys.callAll('animations.add', 'animations', 'fly2', [0, 1, 2, 3], 4, true)
    // 記分板
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' })
    spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  }
  update () {
    if (this.time.now > nextFire) {
      this.createEnemy()
    }
    if (this.input.pointer1.isDown || spaceKey.isDown) {
      this.fire()
      // this.physics.arcade.accelerationFromRotation(bullet.rotation, 300, bullet.body.acceleration)
    }
    if (lestX > player.x) {
      // 播放此動畫。
      player.animations.play('left')
      lestX = player.x
    } else if (lestX < player.x) {
      // 播放此動畫。
      player.animations.play('right')
      lestX = player.x
    } else {
      // 停止此動畫。
      player.body.velocity.x = 0
      player.animations.stop()
      player.frame = 2
    }
    // 此方法在這遊戲是把星星刪除
    this.physics.arcade.overlap(bullets, enemys, this.collectStar, null, this)
  }
  collectStar (bullets, e) {
    // 把這個星星刪除
    console.log(e)
    e.kill()
    bullets.kill()
    score += 10
    scoreText.text = 'Score: ' + score
  }
  createEnemy () {
    let e = enemys.getFirstExists(false)
    if (e) {
      e.scale.setTo(0.2, 0.2)
      e.reset(Math.random() * this.world.width, 0)
      // e.life = config.life
      e.body.velocity.y = 100
      e.play('fly2')
    }
  }
  fire () {
    if (this.time.now > nextFire) {
      var bullet1 = bullets.getFirstExists(false)
      var bullet2 = bullets.getAt(bullets.getChildIndex(bullet1) + 1)
      var bullet3 = bullets.getAt(bullets.getChildIndex(bullet1) + 2)
      shotAudio.play()
      console.log('fire')
      nextFire = this.time.now + fireRate
      // bullet3.scale.setTo(2, 2)
      // 設定乞食x y
      bullet1.reset(player.x + player.width / 2, player.y + player.height / 2)
      bullet2.reset(player.x + player.width / 2, player.y + player.height / 2)
      bullet3.reset(player.x + player.width / 2, player.y + player.height / 2)
      // 設定 射到哪邊的仰角
      bullet1.rotation = this.physics.arcade.angleToXY(bullet1, 0, 0)
      bullet2.rotation = this.physics.arcade.angleToXY(bullet2, player.x, 0)
      bullet3.rotation = this.physics.arcade.angleToXY(bullet3, this.world.width, 0)
      bullet1.body.velocity.y = -700
      bullet2.body.velocity.y = -700
      bullet3.body.velocity.y = -700
      bullet1.body.velocity.x = -50
      bullet3.body.velocity.x = +50
      bullet1.play('fly3')
      bullet2.play('fly3')
      bullet3.play('fly3')
    }
  }
}
