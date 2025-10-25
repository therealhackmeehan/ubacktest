import { ForgotPasswordForm } from "wasp/client/auth";
import { AuthPageLayout } from "../AuthPageLayout";
import { authAppearance } from "../appearance";
import logo from "../../client/static/logo.png";

export function RequestPasswordResetPage() {
  return (
    <AuthPageLayout>
      <ForgotPasswordForm appearance={authAppearance} logo={logo} />
    </AuthPageLayout>
  );
}
