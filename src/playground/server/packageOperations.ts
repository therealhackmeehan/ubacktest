import { type GetPackageInfo } from "wasp/server/operations";
import { type PackageInfo } from "wasp/entities";

export const getPackageInfo: GetPackageInfo<void, PackageInfo | null> = async (_args, context) => {
  return await context.entities.PackageInfo.findFirst({
    orderBy: { date: "desc" }
  });
};
