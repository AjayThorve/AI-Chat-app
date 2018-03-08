import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './Components/app.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { MaterializeModule } from 'angular2-materialize';
import { ChatMessageBoxComponent } from './Components/chat-message-box/chat-message-box.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { TextBoxComponent } from './Components/text-box/text-box.component';
import { FormsModule } from '@angular/forms';
import { ChatsComponent } from './Components/chats/chats.component';
import { DataService } from './Services/data.service';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { AwsAuthService } from './Services/aws-auth.service';

const appRoutes: Routes = [
  {
    path: 'index.html',
    component: AppComponent
  },
  {
    path: 'dashboard',
    component: HomeComponent
  }
];
@NgModule({
  declarations: [
    AppComponent,
    ChatMessageBoxComponent,
    NavbarComponent,
    TextBoxComponent,
    ChatsComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    MaterializeModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    DataService,
    AwsAuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
