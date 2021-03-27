import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './views/home/home.component';
import { RegisterComponent } from './views/register/register.component';
import { FeedComponent } from './views/feed/feed.component';
import { LoginComponent } from './views/login/login.component';
import { BrowseComponent } from './views/browse/browse.component';
import { SharedModule } from './_modules/shared/shared.module';
import { TestErrorsComponent } from './views/test-errors/test-errors.component';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { ServerErrorComponent } from './views/server-error/server-error.component';
import { PortfoliosComponent } from './views/user/username/portfolios/portfolios.component';
import { UserCardComponent } from './views/browse/user-card/user-card.component';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PortfolioTableComponent } from './views/user/username/portfolios/portfolio-table/portfolio-table.component';
import { ProfileBannerComponent } from './views/user/username/profile-banner/profile-banner.component';
import { TableMenuHeaderComponent } from './views/user/username/portfolios/table-menu-header/table-menu-header.component';
import { EditNameModalComponent } from './views/user/username/portfolios/edit-name-modal/edit-name-modal.component';
import { EditProfileComponent } from './views/user/edit-profile/edit-profile.component';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { MessagesComponent } from './views/user/messages/messages.component';
import { ThreadComponent } from './views/user/messages/thread/thread.component';
import { MessageComponent } from './views/user/messages/message/message.component';
import { EditProfileBannerComponent } from './views/user/edit-profile/edit-profile-banner/edit-profile-banner.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    RegisterComponent,
    FeedComponent,
    LoginComponent,
    BrowseComponent,
    TestErrorsComponent,
    NotFoundComponent,
    ServerErrorComponent,
    PortfoliosComponent,
    UserCardComponent,
    PortfolioTableComponent,
    ProfileBannerComponent,
    TableMenuHeaderComponent,
    EditNameModalComponent,
    EditProfileComponent,
    MessagesComponent,
    ThreadComponent,
    MessageComponent,
    EditProfileBannerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    SharedModule,
    NgxChartsModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
