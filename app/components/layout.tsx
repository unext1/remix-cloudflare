import { Dialog, Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from 'lucide-react';
import { Fragment, useState, type ReactNode } from 'react';

import { type UserType } from '~/services/auth.server';
import { Navigation } from './sidebar';
import { TopBar } from './topBar';

export const AppLayout = ({ children, user }: { children: React.ReactNode; user: UserType }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen-safe md:flex-row">
      <MobileSidebar isOpen={sidebarOpen} onClose={setSidebarOpen} setClose={() => setSidebarOpen(false)}>
        <Navigation user={user} />
      </MobileSidebar>

      {/* Static sidebar for desktop */}
      <div className="hidden flex-col space-y-4 border-r border-neutral py-4 w-60  md:flex">
        <Navigation user={user} />
      </div>

      <main className="flex flex-1 flex-col overflow-y-scroll rounded-md max-w-none container mx-auto p-5">
        <TopBar user={user} />

        {children}
      </main>
      <MobileMenu openSidebar={() => setSidebarOpen(true)} />
    </div>
  );
};

const MobileMenu = ({ openSidebar }: { openSidebar: () => void }) => {
  return (
    <div className="flex justify-end border-t border-neutral 0 px-2 shadow-lg py-safe md:hidden">
      <div className="flex p-2">
        <button type="button" className="rounded-md p-2 text-gray-content md:hidden" onClick={openSidebar}>
          <span className="sr-only">Open sidebar</span>
          <MenuIcon aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

const MobileSidebar = ({
  isOpen,
  onClose,
  setClose,
  children
}: {
  isOpen: boolean;
  onClose: (state: boolean) => void;
  setClose: () => void;
  children: ReactNode;
}) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10 md:hidden" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-100/5" />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col space-y-4 bg-background px-1 py-4 pb-safe">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute right-0 top-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none"
                    onClick={setClose}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>

              {children}
            </Dialog.Panel>
          </Transition.Child>
          <div className="w-14 flex-shrink-0" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
