import { ForgotPasswordForm } from 'wasp/client/auth';
import { AuthPageLayout } from '../AuthPageLayout';
import { authAppearance } from '../appearance';

export function RequestPasswordResetPage() {
  return (
    <AuthPageLayout>
      <ForgotPasswordForm appearance={authAppearance} />
    </AuthPageLayout>
  );
}
