import { SetMetadata } from '@nestjs/common';

export enum AuthRole {
    Employer = 'EMPLOYER',
    Admin = 'ADMIN',
    JobSeeker = 'JOB_SEEKER'
  }

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AuthRole[]): any => SetMetadata(ROLES_KEY, roles);