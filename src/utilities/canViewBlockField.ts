import type { User } from "../payload-types";
import { checkUserRoles } from "./checkUserRoles";

export const canViewBlockField = (
  reservedTenant: string,
  user: any = undefined
): boolean => {
  if (user) {
    if (checkUserRoles(["super-admin"], user)) {
      return true;
    } else if (user.lastLoggedInTenant.name == reservedTenant) {
      return true;
    }
  }
  return false;
};
