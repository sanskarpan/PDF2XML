import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp appearance={{ 
        variables: { 
          colorPrimary: '#3b82f6' // Using a direct hex color instead of CSS variable
        } 
      }} />
    </div>
  );
}