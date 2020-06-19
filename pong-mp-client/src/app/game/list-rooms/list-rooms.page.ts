import { Component, OnInit } from '@angular/core';
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
    userName: `user-${new Date().getTime()}`
  }
  rooms = []

  constructor(private socket: Socket, private router: Router) {
    socket.on('update-rooms', (rooms) => {
        this.rooms = rooms
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

    this.router.navigateByUrl('/room')
  }

  ngOnInit() {
    this.startConnection()
  }

}
