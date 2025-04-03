import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn appearance={{ 
        variables: { 
          colorPrimary: '#3b82f6' // Using a direct hex color instead of CSS variable
        } 
      }} />
    </div>
  );
}