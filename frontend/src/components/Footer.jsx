import scrollToSection from "../Util";
function Footer() {
  return (
    <div className="relative z-10 bg-slate-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌳</span>
              <span className="text-xl font-bold text-white">TreeTrace</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Empowering the world to track, verify, and protect our green cover
              through advanced satellite technology.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-emerald-400 transition-colors">
                Satellite Maps
              </li>
              <li className="hover:text-emerald-400 transition-colors">
                AI Analysis
              </li>
              <li className="hover:text-emerald-400 transition-colors">
                Alert System
              </li>
              <li className="hover:text-emerald-400 transition-colors">
                Pricing
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li
                className="hover:text-emerald-400 transition-colors"
                onClick={() => scrollToSection("about")}
              >
                About Us
              </li>
              <li className="hover:text-emerald-400 transition-colors">
                Careers
              </li>
              <li className="hover:text-emerald-400 transition-colors">Blog</li>
              <li onClick={() => scrollToSection("contact")} className="hover:text-emerald-400 transition-colors">
                Contact
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-emerald-400 transition-colors">
                Privacy Policy
              </li>
              <li className="hover:text-emerald-400 transition-colors">
                Terms of Service
              </li>
              <li className="hover:text-emerald-400 transition-colors">
                Cookie Policy
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© 2026 TreeTrace Ltd. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a
              href="https://x.com/ASADAHMEDS41506"
              className="hover:text-white transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://www.linkedin.com/in/asad-ahmed-saiyed/"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/AsadAhmedSaiyed/TreeTrace"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
