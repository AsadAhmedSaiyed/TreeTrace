import { SignUp } from "@clerk/clerk-react";

function SignUpPage() {
  return (
    <div className="relative pt-25 pb-15 min-h-screen flex items-center justify-center bg-slate-50 px-4 overflow-hidden">
      {/* Background Blobs matching Hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "shadow-2xl border border-slate-200 rounded-2xl backdrop-blur-sm bg-white/90",
              logoBox: "hidden",
              formButtonPrimary: "bg-linear-to-r from-emerald-600 to-teal-600 hover:opacity-90 transition-opacity border-none shadow-md",
              footerActionLink: "text-emerald-600 hover:text-emerald-700",
              headerTitle: "text-slate-900 font-bold",
              headerSubtitle: "text-slate-500",
            },
          }}
          afterSignUpUrl="/"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
}

export default SignUpPage;