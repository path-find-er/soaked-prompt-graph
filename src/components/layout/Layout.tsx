import * as React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <Header /> */}
      <main className='realtive flex min-h-screen flex-col'>{children}</main>
    </>
  );
}
