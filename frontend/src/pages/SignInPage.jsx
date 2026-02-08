import { SignIn } from "@clerk/clerk-react";

function SignInPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg",
            // Hide Clerk logo
            logoBox: "hidden",
            // Customize other elements as needed
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
          }
        }}
        // Redirect after sign in
        afterSignInUrl="/"
        // Redirect after sign up
        signUpUrl="/sign-up"
      />
    </div>
  );
}

export default SignInPage;