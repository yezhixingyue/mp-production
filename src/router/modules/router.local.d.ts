/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow */
import { RouteMeta } from 'vue-router';

declare module 'vue-router' {
  export interface RouteMeta {
    PermissionInfo?: string[],
  }
}
