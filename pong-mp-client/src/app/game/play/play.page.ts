import { Component, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { createGesture } from '@ionic/core'

@Component({
  selector: 'app-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayPage implements OnInit {
  @ViewChild('canvas', { static: false}) canvas: any;
  canvasElement: any;
  context: any;
  initialSpeed = 250;
  ball: any;
  _frameCallback: any;
  players = [
    new Player,
    new Player,
  ];

  constructor(private socket: Socket) { 
  }

  ngAfterViewInit() {
    this.startCanvas()

    this.socket.emit('player-ready')

    const gesture = createGesture({
      el: this.canvasElement,
      threshold: 30,
      gestureName: 'touch-track',
      onMove: ev => this.onMoveHandler(ev)
    });

    gesture.enable()

    this.socket.on('move-player', (playerPos) => {
      this.players[1].pos.x = playerPos;
    })

    this.socket.on('start-game', () => {
      console.log('start');
      this.play()
    });
    
  }

  onMoveHandler(ev) {
    const playerPos = ev.currentX - this.players[0].size.x / 2
    this.players[0].pos.x = playerPos
    this.socket.emit('move-player', playerPos)
  }

  ngOnInit() {
  }

  startCanvas() {
    this.canvasElement = this.canvas.nativeElement;
    
    const playerDistanceFromBorder = 20;

    this.canvasElement.width = 300;
    this.canvasElement.height = 600;

    this.players[1].pos.y = playerDistanceFromBorder;
    this.players[0].pos.y = this.canvasElement.height - playerDistanceFromBorder;
    this.players.forEach(p => p.pos.x = this.canvasElement.width / 2);

    this.ball = new Ball;

    let lastTime = null;
    this._frameCallback = (millis) => {
        if (lastTime !== null) {
            const diff = millis - lastTime;
            this.update(diff / 1000);
        }
        lastTime = millis;
        requestAnimationFrame(this._frameCallback);
    };

    this.context = this.canvasElement.getContext('2d');
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    this.start()
  }
  clear() {
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }
  collide(player, ball) {
    if (player.top < ball.bottom && player.bottom > ball.top &&
        player.left < ball.right && player.right > ball.left) {
        ball.vel.y = -ball.vel.y * 1.05;
        const len = ball.vel.len;
        ball.vel.x += player.vel.x * .2;
        ball.vel.len = len;
    }
  }
  draw() {
    this.clear();

    this.drawRect(this.ball);
    this.players.forEach(player => this.drawRect(player));

    this.drawScore();
  }
  drawRect(rect) {
    this.context.fillStyle = '#fff';
    this.context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
  }
  drawScore() {
  }
  play() {
    const b = this.ball;
    // if (b.vel.x === 0 && b.vel.y === 0) {
    b.vel.x = 200 * (Math.random() > .5 ? 1 : -1);
    b.vel.y = 200 * (Math.random() * 2 - 1);
    b.vel.len = this.initialSpeed;
  }
  reset() {
    const b = this.ball;
    b.vel.x = 0;
    b.vel.y = 0;
    b.pos.x = this.canvasElement.width / 2;
    b.pos.y = this.canvasElement.height / 2;
  }
  start() {
    requestAnimationFrame(this._frameCallback);
  }
  update(dt) {
    const cvs = this.canvasElement;
    const ball = this.ball;
    ball.pos.x += ball.vel.x * dt;
    ball.pos.y += ball.vel.y * dt;

    if (ball.top < 0 || ball.bottom > cvs.height) {
        ++this.players[(ball.vel.y < 0) ? 1 : 0].score;
        this.reset();
    }

    if (ball.vel.x < 0 && ball.left < 0 ||
        ball.vel.x > 0 && ball.right > cvs.width) {
        ball.vel.x = -ball.vel.x;
    }

    this.players.forEach(player => {
        player.update(dt);
        this.collide(player, ball);
    });

    this.draw();
  }
}

class Vec {
  x: any
  y: any

  constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
  }
  get len() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  set len(value) {
      const f = value / this.len;
      this.x *= f;
      this.y *= f;
  }
}

class Rect {
  pos: any
  size: any

  constructor(x = 0, y = 0) {
      this.pos = new Vec(0, 0);
      this.size = new Vec(x, y);
  }
  get left(){
      return this.pos.x - this.size.x / 2;
  }
  get right() {
      return this.pos.x + this.size.x / 2;
  }
  get top() {
      return this.pos.y - this.size.y / 2;
  }
  get bottom() {
      return this.pos.y + this.size.y / 2;
  }
}

class Ball extends Rect {
  vel: any

  constructor() {
      super(11, 11);
      this.vel = new Vec;
  }
}

class Player extends Rect {
  vel: any
  score: any
  _lastPos: any

  constructor() {
      super(80, 10);
      this.vel = new Vec;
      this.score = 0;

      this._lastPos = new Vec;
  }
  update(dt) {
      this.vel.x = (this.pos.x - this._lastPos.x) / dt;
      this._lastPos.x = this.pos.x;
  }
}
