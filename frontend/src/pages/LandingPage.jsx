import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  const handleGetStarted = () => {
    if (isSignedIn) {
      navigate('/');
    } else {
      navigate('/sign-in');
    }
  };

  const steps = [
    {
      number: '01',
      title: 'Select Your Area',
      description: 'Choose the location and time period you want to analyze using our interactive map interface',
      icon: '🗺️',
      color: 'from-emerald-400 to-teal-500'
    },
    {
      number: '02',
      title: 'Draw Analysis Zone',
      description: 'Draw a rectangle on the map to define the exact area for environmental monitoring',
      icon: '✏️',
      color: 'from-teal-400 to-cyan-500'
    },
    {
      number: '03',
      title: 'AI Analysis',
      description: 'Our advanced AI analyzes satellite imagery using NDVI and other vegetation indices',
      icon: '🤖',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      number: '04',
      title: 'Get Report',
      description: 'Receive detailed environmental impact reports with visual evidence and metrics',
      icon: '📊',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      number: '05',
      title: 'Email Alerts',
      description: 'Get instant notifications about significant environmental changes in monitored areas',
      icon: '📧',
      color: 'from-indigo-400 to-purple-500'
    }
  ];

  const features = [
    {
      title: 'For NGOs',
      description: 'Verify plantation campaigns, manage environmental projects, and track reforestation progress',
      icon: '🏢',
      benefits: ['Campaign Verification', 'Impact Tracking', 'Detailed Analytics']
    },
    {
      title: 'For Users',
      description: 'Monitor environmental changes, track tree planting impact, and contribute to conservation',
      icon: '🌱',
      benefits: ['Personal Tracking', 'Impact Reports', 'Community Goals']
    }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 font-sans text-slate-900">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <span className="text-2xl">🌳</span>
              <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                TreeTrace
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">How it Works</button>
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Features</button>
              <button onClick={() => scrollToSection('about')} className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">About Us</button>
              <button onClick={() => scrollToSection('contact')} className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Contact</button>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={handleGetStarted} className="px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors">
                {isSignedIn ? 'Dashboard' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Static background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-block">
                <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold tracking-wide border border-emerald-200">
                  Powered by AI & Satellite Imagery
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  TreeTrace
                </span>
                <br />
                <span className="text-slate-900">
                  Monitor Green Cover
                </span>
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                Advanced satellite imagery analysis to track vegetation changes, verify environmental campaigns, 
                and protect our forests with precision AI technology.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  Get Started
                </button>
                
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold text-lg shadow-sm border border-slate-200 hover:border-emerald-300 transition-colors"
                >
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
                <div>
                  <div className="text-3xl font-bold text-emerald-600">99%</div>
                  <div className="text-sm text-slate-600 font-medium">Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-teal-600">24/7</div>
                  <div className="text-sm text-slate-600 font-medium">Monitoring</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-600">AI</div>
                  <div className="text-sm text-slate-600 font-medium">Powered</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 z-10" />
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80"
                  alt="Satellite Forest Monitoring"
                  className="w-full h-auto"
                />
              </div>
              
              {/* Static floating cards */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-2xl">
                    🌲
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Live Tracking</div>
                    <div className="text-sm text-slate-600">Real-time Updates</div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-2xl">
                    📡
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Satellite Data</div>
                    <div className="text-sm text-slate-600">High Resolution</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-600 font-bold text-sm tracking-wide uppercase">
              Simple Process
            </span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-slate-800">
              How TreeTrace Works
            </h2>
            <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto">
              Five simple steps to start monitoring environmental changes with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:border-emerald-200 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-3xl shadow-md`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-5xl font-bold text-slate-200 mb-2">{step.number}</div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section (DARK THEME) */}
      <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-400 font-bold text-sm tracking-wide uppercase">
              For Everyone
            </span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-white">
              Built for Impact
            </h2>
            <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto">
              Whether you are an organization or an individual, we have tools tailored for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800 rounded-2xl p-10 shadow-2xl border border-slate-700"
              >
                <div className="text-6xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 mb-8 leading-relaxed text-lg">{feature.description}</p>
                
                <ul className="space-y-4">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="p-1 bg-emerald-500/20 rounded-full">
                        <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-slate-300 font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&q=80" 
              alt="Team planting trees" 
              className="rounded-2xl shadow-xl w-full h-96 object-cover"
            />
          </div>
          <div>
            <span className="text-emerald-600 font-bold text-sm tracking-wide uppercase">About Us</span>
            <h2 className="text-4xl font-bold text-slate-800 mt-2 mb-6">Driven by Data, Inspired by Nature</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Founded in 2024, TreeTrace was built on the belief that technology can be the greatest ally of nature. We combine satellite imagery from Sentinel-2 and Landsat with proprietary AI models to detect vegetation health with unprecedented accuracy.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Our mission is to empower NGOs, governments, and individuals with the data they need to prove the impact of their conservation efforts.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section (NOW DARK - MATCHING FOOTER) */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-emerald-400 font-bold text-sm tracking-wide uppercase">Get in Touch</span>
          <h2 className="text-4xl font-bold text-white mt-2 mb-12">Contact Our Team</h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-xl mb-4">📧</div>
              <h3 className="font-bold text-white">Email Us</h3>
              <p className="text-slate-400 text-sm mt-1">support@treetrace.com</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center text-xl mb-4">📍</div>
              <h3 className="font-bold text-white">Visit Us</h3>
              <p className="text-slate-400 text-sm mt-1">123 Green Way, Eco City</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center text-xl mb-4">📞</div>
              <h3 className="font-bold text-white">Call Us</h3>
              <p className="text-slate-400 text-sm mt-1">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJhMjggMjggMCAwIDEgMC01NnYyYTI2IDI2IDAgMCAwIDAgNTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
            
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
                Join thousands monitoring and protecting our planet's forests with TreeTrace
              </p>
              <button
                onClick={handleGetStarted}
                className="px-10 py-5 bg-white text-emerald-600 rounded-xl font-bold text-lg shadow-xl hover:bg-slate-50 transition-colors"
              >
                Start Monitoring Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Dark Footer */}
      <footer className="relative z-10 bg-slate-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🌳</span>
                <span className="text-xl font-bold text-white">TreeTrace</span>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                Empowering the world to track, verify, and protect our green cover through advanced satellite technology.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Satellite Maps</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">AI Analysis</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Alert System</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© 2024 TreeTrace Inc. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}