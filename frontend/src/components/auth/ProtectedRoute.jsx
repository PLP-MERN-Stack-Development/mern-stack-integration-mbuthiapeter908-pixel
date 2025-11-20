// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';

const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default ProtectedRoute;