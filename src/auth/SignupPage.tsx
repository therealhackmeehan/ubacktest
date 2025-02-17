import { Link } from 'react-router-dom';
import { SignupForm } from 'wasp/client/auth';
import { AuthPageLayout } from './AuthPageLayout';
import { authAppearance } from './appearance';
import logo from '../client/static/logo.png';

export function Signup() {
  return (
    <AuthPageLayout>
      <SignupForm appearance={authAppearance} logo={logo}/>
      <br />
      <span className='text-sm font-medium text-gray-900'>
        I already have an account (
        <Link to='/login' className='underline'>
          go to login
        </Link>
        ).
      </span>
      <br />
    </AuthPageLayout>
  );
}
