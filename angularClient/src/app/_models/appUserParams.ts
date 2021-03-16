import { AppUser } from './appUser';

export class AppUserParams {
  minAge = 13;
  maxAge = 99;
  pageNumber = 1;
  pageSize = 8;
  orderBy = 'lastActive';
  following = false;

  // constructor(appUser: AppUser) {
  //   initialize vehicle tags here with this constructor
  // }
  constructor() {}
}
