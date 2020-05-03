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

  constructor(private socket: Socket) { }

  startConnection() {
    this.socket.connect()
    this.socket.emit('set-user-data', this.user)
  }

  ngOnInit() {
    this.startConnection()
  }

}
