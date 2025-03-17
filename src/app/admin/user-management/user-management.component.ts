import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { User } from '../../_models/user';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModelComponent } from '../../modals/roles-model/roles-model.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  private modelService = inject(BsModalService);
  users: User[] = [];
  bsModuleRef: BsModalRef<RolesModelComponent> = new BsModalRef<RolesModelComponent>();

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  openRolesModal(user: User) {
    const initialState: ModalOptions = {
      class: 'modal-lg',
      initialState: {
        username: user.username,
        title: 'User roles',
        selectedRoles: [...user.roles],
        availableRoles: ['Admin', 'Moderator', 'Member'],
        users: this.users,
        rolesUpdated: false
      } 
    } 
    this.bsModuleRef = this.modelService.show(RolesModelComponent, initialState);
    this.bsModuleRef.onHide?.subscribe({
      next: () => {
        if (this.bsModuleRef.content && this.bsModuleRef.content.rolesUpdated) {
          const selectedRoles = this.bsModuleRef.content.selectedRoles;
          this.adminService.updateUserRoles(user.username, selectedRoles).subscribe({
            next: roles => user.roles = roles
          })
        }
      }
    });
  }

  getUsersWithRoles() {
    this.adminService.getUserWithRoles().subscribe({
      next: users => this.users = users
    })
  }
}
