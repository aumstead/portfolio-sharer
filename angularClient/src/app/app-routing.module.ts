import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { BrowseComponent } from './views/browse/browse.component';
import { FeedComponent } from './views/feed/feed.component';
import { LoginComponent } from './views/login/login.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { RegisterComponent } from './views/register/register.component';
import { TestErrorsComponent } from './views/test-errors/test-errors.component';
import { AuthGuard } from './_guards/auth.guard';
import { ServerErrorComponent } from './views/server-error/server-error.component';
import { PortfoliosComponent } from './views/user/username/portfolios/portfolios.component';
import { EditProfileComponent } from './views/user/edit-profile/edit-profile.component';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'errors', component: TestErrorsComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'feed', component: FeedComponent },
      { path: 'browse', component: BrowseComponent },
      {
        path: 'user/edit-profile',
        component: EditProfileComponent,
        canDeactivate: [PreventUnsavedChangesGuard],
      },
    ],
  },
  { path: 'user/:username/portfolios', component: PortfoliosComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
