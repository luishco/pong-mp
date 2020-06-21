import { Component, OnInit, ɵConsole } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-list-rooms',
  templateUrl: './list-rooms.page.html',
  styleUrls: ['./list-rooms.page.scss'],
})
export class ListRoomsPage implements OnInit {
  objectKeys = Object.keys;
  user = {
    userName: `user-${new Date().getTime()}`,
    room: null
  }
  rooms = {}

  constructor(private socket: Socket, private router: Router, private camera: Camera) {
    socket.on('update-rooms', (rooms) => {
      this.rooms = rooms
    });
    socket.on('set-user-data', (userData) => {
      this.user = userData
    })
  }

  createRoom() {
    const userId = this.socket.ioSocket.id
    let room = {
      locked: false,
      maxPlayers: 2,
      status: 'waiting',
      name: new Date().getTime(),
      players: {}
    }
    room.players[userId] = {
      status: 'waiting'
    }

    this.socket.emit('create-room', room);

    this.router.navigateByUrl('/room')
  }

  joinRoom(roomName: string) {
    this.socket.emit('join-room', roomName)
    this.user.room = roomName
    this.router.navigateByUrl('/room')
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.socket.connect()
    this.socket.emit('set-user-data', this.user)
  }

  takePicture() {
    const cameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(cameraOptions).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    // Handle error
    });
  }
      
}
