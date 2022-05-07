import { SetMetadata } from '@nestjs/common';

export enum AuthRole {
    Tutor = 'TUTOR',
    Admin = 'ADMIN',
    Student = 'STUDENT',
    JobReviewer = 'JOB_REVIEWER',
    AccountReviewer = 'ACCOUNT_REVIEWER',
  }

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AuthRole[]): any => SetMetadata(ROLES_KEY, roles);