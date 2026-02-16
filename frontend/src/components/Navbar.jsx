import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, SignedIn, UserButton } from "@clerk/clerk-react";
import { HashLink } from 'react-router-hash-link';
function Navbar() {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    window.scrollTo(0,0);
    if (isSignedIn) {
      if (user.publicMetadata?.role === "STANDARD_USER") {
        navigate("/app");
      } else {
        navigate("/ngo/dashboard");
      }
    } else {
      navigate("/sign-in");
    }
  };

  const navLinks = [
    { name: "How it Works", id: "how-it-works" },
    { name: "Features", id: "features" },
    { name: "About Us", id: "about" },
    { name: "Contact", id: "contact" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className=" flex justify-between items-center h-16">
          {/* Logo Section */}
          <div
            className="flex items-center gap-2 cursor-pointer shrink-0"
            id="top"
          >
            <span className="text-2xl">🌳</span>
            <HashLink smooth to={"/#top"} onClick={()=>window.scrollTo(0,0)} className="font-bold text-xl bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              TreeTrace
            </HashLink>
          </div>

              <div className="hidden md:flex! items-center gap-8 ">
                {navLinks.map((link) => (
                  <HashLink
                    key={link.name}
                    smooth
                    to={`/#${link.id}`}
                    className="text-sm font-semibold text-slate-800 hover:text-emerald-600 transition-colors"
                  >
                    {link.name}
                  </HashLink>
                ))}
              </div>

              <div className="hidden md:flex! items-center gap-4 ">
                <button
                  onClick={handleGetStarted}
                  className="px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-md"
                >
                  {isSignedIn ? "Dashboard" : "Sign In"}
                </button>

                <SignedIn>
                  <div className="flex items-center justify-center bg-slate-100 rounded-full p-1 border border-slate-200">
                    <UserButton />
                  </div>
                </SignedIn>
              </div>
  

          {/* Mobile Menu Button (Hamburger) - Only visible on SMALL screens */}
          <div className="md:hidden flex items-center gap-4">
            {/* Show UserButton on mobile bar too if signed in */}
            <SignedIn>
              <div className="flex items-center justify-center bg-slate-100 rounded-full p-1 border border-slate-200">
                <UserButton />
              </div>
            </SignedIn>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-lg focus:outline-none transition-colors"
            >
              {isMobileMenuOpen ? (
                // Close Icon (X)
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Menu Icon (Hamburger)
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-xl absolute w-full left-0 z-40">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <HashLink
                key={link.name}
                smooth
                to={`/#${link.id}`}
                onClick={() => {

                  setIsMobileMenuOpen(false); // Close menu after click
                }}
                className="block w-full text-left px-4 py-3 text-base font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                {link.name}
              </HashLink>
            ))}

            <div className="pt-4 border-t border-slate-100 mt-2">
              <button
                onClick={() => {
                  handleGetStarted();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-center px-5 py-3 bg-slate-900 text-white text-base font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg"
              >
                {isSignedIn ? "Go to Dashboard" : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
