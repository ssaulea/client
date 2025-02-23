import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../_models/member';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../_services/likes.service';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
  private likeService = inject(LikesService);
  member = input.required<Member>();
  hasLikes = computed(() => this.likeService.likeIds().includes(this.member().id));

toogleLike() {
  this.likeService.toogleLike(this.member().id).subscribe({
    next: () =>  {
      if (this.hasLikes()) {
        this.likeService.likeIds.update(ids => ids.filter(x => x !== this.member().id));
      }
      else {
        this.likeService.likeIds.update(ids => [...ids, this.member().id]);
      }
    }
  });
}

}
