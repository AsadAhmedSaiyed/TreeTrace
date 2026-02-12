function Contact() {
    return ( 
      <div id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-emerald-400 font-bold text-sm tracking-wide uppercase">Get in Touch</span>
          <h2 className="text-4xl font-bold text-white mt-2 mb-12">Contact Our Team</h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-xl mb-4">📧</div>
              <h3 className="font-bold text-white">Email Us</h3>
              <p className="text-slate-400 text-sm mt-1">asadahmedsaiyed786@gmail.com</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center text-xl mb-4">📍</div>
              <h3 className="font-bold text-white">Visit Us</h3>
              <p className="text-slate-400 text-sm mt-1">Ahmedabad, Gujarat, India</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center text-xl mb-4">📞</div>
              <h3 className="font-bold text-white">Call Us</h3>
              <p className="text-slate-400 text-sm mt-1">+91 8320959662</p>
            </div>
          </div>
        </div>
      </div>
     );
}

export default Contact;