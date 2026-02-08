import { SignUp } from "@clerk/clerk-react";

function SignUpPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <SignUp 
        appearance={{
          elements: {
            logoBox: "hidden", // Hides Clerk logo
            card: "shadow-lg",
          }
        }}
        afterSignUpUrl="/"
        signInUrl="/sign-in"
      />
    </div>
  );
}

export default SignUpPage;