import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { inject, Injectable, model, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { of, tap } from 'rxjs';
import { Photo } from '../_models/photo';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/UserParams';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private https = inject(HttpClient);
  private accountService = inject(AccountService);
  baseUrl = environment.apiUrl;
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);
  memberCache = new Map();
  userParams = signal<UserParams>(new UserParams(this.accountService.currentUser()));

  resetUserParams() {
    this.userParams.set(new UserParams(this.accountService.currentUser()));
  }


  getMembers() {
    const reponse = this.memberCache.get(Object.values(this.userParams()).join('-'));
    if (reponse) return this.setPaginatedResponse(reponse);

    let params = this.getPaginationHeaders(
      this.userParams().pageNumber,
      this.userParams().pageSize
    );

    params = params.append('minAge', this.userParams().minAge);
    params = params.append('maxAge', this.userParams().maxAge);
    params = params.append('gender', this.userParams().gender);
    params = params.append('orderBy', this.userParams().orderBy);

    return this.https
      .get<Member[]>(this.baseUrl + 'users', {
        observe: 'response',
        params: params,
      })
      .subscribe({
        next: (response) => {
          this.setPaginatedResponse(response);
          this.memberCache.set(Object.values(this.userParams()).join('-'), response);
        },
      });
  }

  private setPaginatedResponse(response: HttpResponse<Member[]>) {
    this.paginatedResult.set({
      items: response.body as Member[],
      pagination: JSON.parse(response.headers.get('Pagination')!),
    });
  }

  private getPaginationHeaders(
    pageNumber: number,
    pageSize: number
  ): HttpParams {
    let params = new HttpParams();

    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }
    return params;
  }

  getMember(username: string) {
    const member: Member = [...this.memberCache.values()].reduce((arr, elem) => arr.concat(elem.body), []).find((m: Member) => m.username === username);
    if (member) return of (member);

    return this.https.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.https
      .put(this.baseUrl + 'users', member)
      .pipe
      // tap(() => {
      //   this.members.update(members => members.map(m => m.username === member.username ? member : m))
      // })
      ();
  }

  setMainPhoto(photo: Photo) {
    return this.https
      .put(this.baseUrl + 'users/set-main-photo/' + photo.id, {})
      .pipe
      // tap(() => {
      //   this.members.update(members => members.map(m => {
      //     if (m.photos.includes(photo)) {
      //       m.photoUrl = photo.url
      //     }
      //     return m;
      //   }))
      // })
      ();
  }

  deletePhoto(photo: Photo) {
    return this.https
      .delete(this.baseUrl + 'users/delete-photo/' + photo.id, {})
      .pipe
      // tap(() => {
      //   this.members.update(members => members.map(m => {
      //     if (m.photos.includes(photo)) {
      //       m.photos = m.photos.filter(x => x.id !== photo.id);
      //     }
      //     return m;
      //   }))
      // })
      ();
  }
}
