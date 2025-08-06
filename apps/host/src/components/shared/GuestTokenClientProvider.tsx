'use client';

import { useEnsureGuestToken } from '@data-access/auth-hooks';

export function GuestTokenClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEnsureGuestToken();
  return <>{children}</>;
}
