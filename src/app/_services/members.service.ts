import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private https = inject(HttpClient);
  baseUrl = environment.apiUrl;

  getMembers() {
    return this.https.get<Member[]>(this.baseUrl + 'users');
  }

  getMember(username: string) {
    return this.https.get<Member>(this.baseUrl + 'users/' + username);
  }

}
