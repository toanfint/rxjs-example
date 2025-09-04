import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './components/user/user.component';
import { SearchComponent } from './components/search/search.component';
import { SearchLayLoadComponent } from './components/search-lay-load/search-lay-load.component';
import { SearchLazyLoad2Component } from './search-lazy-load2/search-lazy-load2.component';
import { SearchLazyLoad3Component } from './search-lazy-load3/search-lazy-load3.component';
import { SearchLazyLoad4Component } from './search-lazy-load4/search-lazy-load4.component';
import { UserPostComponent } from './components/user-post/user-post.component';
import { CombineLatestComponent } from './components/combine-latest/combine-latest.component';
import { WebsocketExampleComponent } from './components/websocket-example/websocket-example.component';
import { ChatDialogComponent } from './components/chat-dialog/chat-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    SearchComponent,
    SearchLayLoadComponent,
    SearchLazyLoad2Component,
    SearchLazyLoad3Component,
    SearchLazyLoad4Component,
    UserPostComponent,
    CombineLatestComponent,
    WebsocketExampleComponent,
    ChatDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
