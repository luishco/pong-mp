import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListRoomsPageRoutingModule } from './list-rooms-routing.module';

import { ListRoomsPage } from './list-rooms.page';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io'
const socketIoConfig: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: {}
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListRoomsPageRoutingModule,
    SocketIoModule.forRoot(socketIoConfig)
  ],
  declarations: [ListRoomsPage]
})
export class ListRoomsPageModule {}
