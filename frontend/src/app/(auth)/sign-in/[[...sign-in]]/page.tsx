import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn appearance={{ variables: { colorPrimary: 'rgb(var(--color-primary))' } }} />
    </div>
  );
}