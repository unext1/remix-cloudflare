import { Form, Link, useNavigate } from '@remix-run/react';
import { ArrowLeftIcon, DoorOpenIcon } from 'lucide-react';
import { type UserType } from '~/services/auth.server';
import { Button } from './ui/button';

export const TopBar = ({ user }: { user: UserType }) => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  return (
    <div className="w-full items-center flex mb-6 bg-neutral rounded-xl p-4">
      <Button onClick={goBack} variant="default" size="sm">
        <ArrowLeftIcon className="w-4" />
      </Button>
      <div className="flex w-full justify-end">
        <Link to="settings">
          <div className="flex space-x-2 mr-5">
            <img src="https://thispersondoesnotexist.com" className="h-8 w-8 rounded-full" alt="user" />
            <div className="flex flex-col justify-center">
              <div className="font-semibold capitalize text-sm">{user?.name}</div>
            </div>
          </div>
        </Link>
        <Form action="/auth/logout" method="post" className="">
          <button type="submit">
            <DoorOpenIcon className="h-5 w-5 mt-1.5 text-gray-500" />
          </button>
        </Form>
      </div>
    </div>
  );
};
