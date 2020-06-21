import { Component, OnInit } from '@angular/core';
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {

  constructor(private socket: Socket) { }

  ionViewWillLeave() {
  }

  leaveRoom() {
    this.socket.emit('leave-room')
  }

  ngOnInit() {
  }

}
