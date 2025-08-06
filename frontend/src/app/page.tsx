import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import "./globals.css";

export default function HomePage() {
  return (
    <>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-hero h-screen flex items-center justify-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Welcome to <span className="text-rebbie-purple-400">Rebbie's</span> Store
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Nigeria's Premier Fashion & Beauty Destination
            </p>
            <p className="text-lg mb-12 text-gray-300 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Discover luxury fashion bags, stunning jewelry, and premium fragrances. 
              Shop authentic thrift pieces and brand new designer collections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Link
                href="/products"
                className="btn-base btn-primary text-lg px-8 py-4 hover:scale-105 transition-transform"
              >
                Shop Now
              </Link>
              <Link
                href="/products/category/thrift-fashion-bags"
                className="btn-base btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-black"
              >
                Explore Thrift Collection
              </Link>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-rebbie-purple-400/20 rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-rebbie-purple-600/20 rounded-full animate-bounce-subtle"></div>
          <div className="absolute top-1/2 left-20 w-16 h-16 bg-white/10 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-black mb-4">Shop by Category</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explore our carefully curated collections of fashion bags, jewelry, and fragrances
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Fashion Bags */}
              <div className="group cursor-pointer">
                <Link href="/products/category/fashion-bags">
                  <div className="card-base overflow-hidden group-hover:shadow-purple-lg transition-all duration-500">
                    <div className="h-64 bg-gradient-purple flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-6xl mb-4">👜</div>
                        <h3 className="text-2xl font-bold">Fashion Bags</h3>
                        <p className="text-purple-100">Thrift & New Collections</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-semibold mb-2">Premium Fashion Bags</h4>
                      <p className="text-gray-600 mb-4">
                        From vintage luxury pieces to contemporary designer bags
                      </p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Starting from ₦15,000</span>
                        <span className="text-rebbie-purple-600 font-semibold">View Collection →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Jewelry */}
              <div className="group cursor-pointer">
                <Link href="/products/category/jewelry">
                  <div className="card-base overflow-hidden group-hover:shadow-purple-lg transition-all duration-500">
                    <div className="h-64 bg-gradient-accent flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-6xl mb-4">💎</div>
                        <h3 className="text-2xl font-bold">Jewelry</h3>
                        <p className="text-purple-100">African & Contemporary</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-semibold mb-2">Stunning Jewelry</h4>
                      <p className="text-gray-600 mb-4">
                        Necklaces, earrings, rings, and traditional African pieces
                      </p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Starting from ₦8,000</span>
                        <span className="text-rebbie-purple-600 font-semibold">View Collection →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Fragrances */}
              <div className="group cursor-pointer">
                <Link href="/products/category/fragrances">
                  <div className="card-base overflow-hidden group-hover:shadow-purple-lg transition-all duration-500">
                    <div className="h-64 bg-black flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-6xl mb-4">🌸</div>
                        <h3 className="text-2xl font-bold">Fragrances</h3>
                        <p className="text-gray-300">Men's & Women's</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-semibold mb-2">Premium Fragrances</h4>
                      <p className="text-gray-600 mb-4">
                        Designer perfumes, colognes, and body mists
                      </p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Starting from ₦12,000</span>
                        <span className="text-rebbie-purple-600 font-semibold">View Collection →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-black mb-4">Why Choose Rebbie's Store?</h2>
              <p className="text-xl text-gray-600">
                We're committed to providing the best shopping experience in Nigeria
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-rebbie-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Same-day delivery in Lagos, nationwide shipping across Nigeria</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-rebbie-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Authentic Products</h3>
                <p className="text-gray-600">100% authentic products with certificates for luxury items</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-rebbie-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💳</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
                <p className="text-gray-600">Multiple payment options: Paystack, bank transfer, cash on delivery</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-rebbie-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📞</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-600">WhatsApp support and customer service always available</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-rebbie-purple-600 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold mb-4">Ready to Shop?</h2>
            <p className="text-xl mb-8 text-purple-100">
              Join thousands of happy customers who trust Rebbie's Store for their fashion and beauty needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="btn-base bg-white text-rebbie-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                Browse All Products
              </Link>
              <a
                href="https://wa.me/2348065776378"
                className="btn-base border-2 border-white text-white hover:bg-white hover:text-rebbie-purple-600 px-8 py-4 text-lg font-semibold"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}