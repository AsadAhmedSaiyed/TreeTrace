function AboutUs() {
    return ( 
      <div id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
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
              Founded in 2026 by Second year Computer Engineering student Asad Ahmed Saiyed, TreeTrace was built on the belief that technology can be the greatest ally of nature. We combine satellite imagery from Sentinel-2 and Landsat with proprietary AI models to detect vegetation health with unprecedented accuracy.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Our mission is to empower NGOs, governments, and individuals with the data they need to prove the impact of their conservation efforts.
            </p>
          </div>
        </div>
      </div>
     );
}

export default AboutUs;