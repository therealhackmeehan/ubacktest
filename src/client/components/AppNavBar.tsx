import { Link, routes } from 'wasp/client/router';
import { useAuth } from 'wasp/client/auth';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { BiLogIn } from 'react-icons/bi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { HiBars3 } from 'react-icons/hi2';
import logo from '../static/logo.png';
import DropdownUser from '../../user/DropdownUser';
import { UserMenuItems } from '../../user/UserMenuItems';
import DarkModeSwitcher from './DarkModeSwitcher';

const NavLogo = () => <img className='h-8 w-8' src={logo} alt='Your SaaS App' />;

export default function AppNavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: user, isLoading: isUserLoading } = useAuth();
  return (
    <header className='bg-white bg-opacity-50 backdrop-blur-lg backdrop-filter dark:bg-boxdark-2'>
      <nav className='flex items-center justify-between p-5 lg:px-8' aria-label='Global'>
        <div className='flex lg:flex-1'>
          <Link to='/' className='-m-1.5 p-1.5 font-extrabold text-sky-700 tracking-tight text-xl dark:text-blue-300'>
            uBacktest.
            {/* <img className='h-8 w-8' src={logo} alt='My SaaS App' /> */}
          </Link>
        </div>
        <div className='flex lg:hidden'>
          <button
            type='button'
            className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-white'
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className='sr-only'>Open main menu</span>
            <HiBars3 className='h-6 w-6' aria-hidden='true' />
          </button>
        </div>
        <div className='hidden lg:flex lg:gap-x-8'>
          <Link
            to={"/editor"}
            className='text-sm font-semibold leading-6 text-gray-900 duration-300 ease-in-out hover:text-slate-500 dark:text-white'
          >
            Strategy Editor
          </Link>
          <Link
            to={"/home"}
            className='text-sm font-semibold leading-6 text-gray-900 duration-300 ease-in-out hover:text-slate-500 dark:text-white'
          >
            My Strategies
          </Link>
          <Link
            to={"/results"}
            className='text-sm font-semibold leading-6 text-gray-900 duration-300 ease-in-out hover:text-slate-500 dark:text-white'
          >
            My Results
          </Link>
          {/* <Link
            to={"/leaderboard"}
            className='text-sm font-semibold leading-6 text-gray-900 duration-300 ease-in-out hover:text-slate-500 dark:text-white'
          >
            Leaderboard
          </Link> */}
        </div>
        <div className='hidden lg:flex mx-4 xl:mx-12 border-r-2 py-4 border-black/80 dark:border-blue-300'></div>
        <div className='hidden lg:flex lg:gap-x-8 lg:mr-4'>
          <Link
            to={"/home"}
            className='text-sm leading-6 text-sky-700 duration-300 ease-in-out hover:text-slate-500 dark:text-white'
          >
            Documentation
          </Link>
          <Link
            to={"/pricing"}
            className='text-sm leading-6 text-sky-700 duration-300 ease-in-out hover:text-slate-500 dark:text-white'
          >
            Pricing
          </Link>
        </div>
        <div className='hidden lg:flex lg:flex-1 gap-3 justify-end items-center'>
          <ul className='flex justify-end items-center gap-2 sm:gap-4'>
            <DarkModeSwitcher />
          </ul>

          {isUserLoading ? null : !user ? (
            <a href={!user ? routes.LoginRoute.build() : routes.AccountRoute.build()} className='text-sm font-semibold leading-6 ml-4'>
              <div className='flex items-center duration-300 ease-in-out text-gray-900 hover:text-slate-500 dark:text-white'>
                Log in <BiLogIn size='1.1rem' className='ml-1 mt-[0.1rem]' />
              </div>
            </a>
          ) : (
            <div className='ml-4'>
              <DropdownUser user={user} />
            </div>
          )}
        </div>
      </nav>
      <Dialog as='div' className='lg:hidden' open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className='fixed inset-0 z-50' />
        <Dialog.Panel className='fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:text-white dark:bg-boxdark px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
          <div className='flex items-center justify-between'>
            <a href='/' className='-m-1.5 p-1.5'>
              <span className='sr-only'>Your SaaS</span>
              <NavLogo />
            </a>
            <button
              type='button'
              className='-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-50'
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className='sr-only'>Close menu</span>
              <AiFillCloseCircle className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
          <div className='mt-6 flow-root'>
            <div className='-my-6 divide-y divide-gray-500/10'>
              <div className='space-y-2 py-6'>
                <Link
                  to={"/editor"}
                  onClick={() => setMobileMenuOpen(false)}
                  className='-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-white hover:dark:bg-boxdark-2'
                >
                  Strategy Editor
                </Link>
                <Link
                  to={"/home"}
                  onClick={() => setMobileMenuOpen(false)}
                  className='-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-white hover:dark:bg-boxdark-2'
                >
                  My Strategies
                </Link>
                <Link
                  to={"/results"}
                  onClick={() => setMobileMenuOpen(false)}
                  className='-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-white hover:dark:bg-boxdark-2'
                >
                  My Results
                </Link>
                {/* <Link
                  to={"/leaderboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className='-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-white hover:dark:bg-boxdark-2'
                >
                  Leaderboard
                </Link> */}
              </div>
              <div className='space-y-2 scale-90 py-6'>
                <Link
                  to={"/pricing"}
                  onClick={() => setMobileMenuOpen(false)}
                  className='-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-white hover:dark:bg-boxdark-2'
                >
                  Pricing
                </Link>
                <Link
                  to={"/home"}
                  onClick={() => setMobileMenuOpen(false)}
                  className='-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-white hover:dark:bg-boxdark-2'
                >
                  Documentation
                </Link>
              </div>
              <div className='py-6'>
                {isUserLoading ? null : !user ? (
                  <Link to='/login' onClick={() => setMobileMenuOpen(false)}>
                    <div className='flex justify-end items-center duration-300 ease-in-out text-gray-900 hover:text-slate-500 dark:text-white'>
                      Log in <BiLogIn size='1.1rem' className='ml-1' />
                    </div>
                  </Link>
                ) : (
                  <UserMenuItems user={user} setMobileMenuOpen={setMobileMenuOpen} />
                )}
              </div>
              <div className='py-6'>
                <DarkModeSwitcher />
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
