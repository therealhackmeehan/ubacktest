import { Link } from "react-router-dom";
import { VerifyEmailForm } from "wasp/client/auth";
import { AuthPageLayout } from "../AuthPageLayout";
import { authAppearance } from "../appearance";
import logo from "../../client/static/logo.png";

export function EmailVerificationPage() {
  return (
    <AuthPageLayout>
      <VerifyEmailForm appearance={authAppearance} logo={logo} />
      <br />
      <span className="text-sm font-medium text-gray-900">
        If everything is okay,{" "}
        <Link to="/login" className="underline">
          go to login
        </Link>
      </span>
    </AuthPageLayout>
  );
}
