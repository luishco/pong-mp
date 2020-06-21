import { Component, OnInit, ɵConsole } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Router } from '@angular/router';

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

  constructor(private socket: Socket, private router: Router) {
    socket.on('update-rooms', (rooms) => {
      this.rooms = rooms
    });
    socket.on('set-user-data', (userData) => {
      this.user = userData
    })
  }

  createRoom() {
    this.socket.emit('create-room', {
      locked: false,
      maxPlayers: 2,
      status: 'waiting',
      name: new Date().getTime(),
      players: [
        this.user.userName
      ]
    });

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
}
