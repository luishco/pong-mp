import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListRoomsPageRoutingModule } from './list-rooms-routing.module';

import { ListRoomsPage } from './list-rooms.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListRoomsPageRoutingModule
  ],
  declarations: [ListRoomsPage]
})
export class ListRoomsPageModule {}
