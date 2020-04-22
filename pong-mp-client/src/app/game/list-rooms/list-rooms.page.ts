import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-rooms',
  templateUrl: './list-rooms.page.html',
  styleUrls: ['./list-rooms.page.scss'],
})
export class ListRoomsPage implements OnInit {
  userName = `user-${new Date().getTime()}`
  mockRooms = [
    {
      maxPlayers: 2,
      owner: 'player-1',
      status: 'waiting',
      players: ['player-1']
    },
    {
      maxPlayers: 2,
      owner: 'player-2',
      status: 'waiting',
      players: ['player-2']
    },
    {
      maxPlayers: 2,
      owner: 'player-3',
      status: 'playing',
      players: ['player-3', 'player-4']
    }
  ]

  constructor() { }

  ngOnInit() {
  }

}
