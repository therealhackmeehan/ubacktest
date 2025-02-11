import { Link } from 'react-router-dom';
import { ResetPasswordForm } from 'wasp/client/auth';
import { AuthPageLayout } from '../AuthPageLayout';
import { authAppearance } from '../appearance';

export function PasswordResetPage() {
  return (
    <AuthPageLayout>
      <ResetPasswordForm appearance={authAppearance}/>
      <br />
      <span className='text-sm font-medium text-gray-900'>
        If everything is okay, <Link to='/login'>go to login</Link>
      </span>
    </AuthPageLayout>
  );
}
