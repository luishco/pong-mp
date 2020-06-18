import { Component, OnInit } from '@angular/core';
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'app-list-rooms',
  templateUrl: './list-rooms.page.html',
  styleUrls: ['./list-rooms.page.scss'],
})
export class ListRoomsPage implements OnInit {
  user = {
    userName: `user-${new Date().getTime()}`
  }
  rooms = []

  constructor(private socket: Socket) {
    socket.on('update-rooms', (newRoom) => {
      this.rooms.push(newRoom)
    });
  }

  startConnection() {
    this.socket.connect()
    this.socket.emit('set-user-data', this.user)
  }

  createRoom() {
    this.socket.emit('create-room', {
      locked: false,
      maxPlayers: 2,
      status: 'waiting',
      name: this.user.userName,
      players: [this.user.userName]
    });
  }

  ngOnInit() {
    this.startConnection()
  }

}
