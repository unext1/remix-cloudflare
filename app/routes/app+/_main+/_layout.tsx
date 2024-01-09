import { Outlet } from '@remix-run/react';

const AppLayout = () => {
  return (
    <div className="container mx-auto">
      <Outlet />
    </div>
  );
};

export default AppLayout;
