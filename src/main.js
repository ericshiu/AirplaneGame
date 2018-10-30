import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import MeunState from './states/Meun'
import OverState from './states/Over'
import config from './config'

class Game extends Phaser.Game {
  constructor() {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight
    // const width = 414
    // const height = 736
    super(width, height, Phaser.CANVAS, 'content', null)
    this.state.add('Meun', MeunState, false)
    this.state.add('Boot', BootState, false)
    this.state.add('Over', OverState, false)
    // with Cordova with need to wait that the device is ready so we will call the Boot state in another file
    if (!window.cordova) {
      this.state.start('Meun')
      this.state.disableVisibilityChange = true
    }
  }
}

window.game = new Game()

if (window.cordova) {
  var app = {
    initialize: function () {
      document.addEventListener(
        'deviceready',
        this.onDeviceReady.bind(this),
        false
      )
    },

    // deviceready Event Handler
    //
    onDeviceReady: function () {
      this.receivedEvent('deviceready')

      // When the device is ready, start Phaser Boot state.
      window.game.state.start('Meun')
    },

    receivedEvent: function (id) {
      console.log('Received Event: ' + id)
    }
  }

  app.initialize()
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration)
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError)
    })
  })
}