import { type WeeklyPackageUpdate } from "wasp/server/jobs";
import CodeExecutor from "../CodeExecutor";

export const weeklyPackageUpdate: WeeklyPackageUpdate<{}, string> = async (
  _args,
  context
) => {
  const codeToExecute = `import subprocess\nprint(subprocess.run(["pip", "freeze"], text=True, capture_output=True).stdout)`;
  const codeExecutor = new CodeExecutor(codeToExecute, 15);
  const { stdout_raw, stderr_raw } = await codeExecutor.execute();

  if (stderr_raw) return "error";
  const packageInfoEntry = await context.entities.PackageInfo.create({
    data: {
      info: stdout_raw,
    },
  });

  console.log(
    "successfully updated package details at " + packageInfoEntry.date
  );
  return packageInfoEntry.info;
};
