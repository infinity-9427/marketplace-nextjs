'use client';

import Image from 'next/image';
import { 
  RiLinkedinFill, 
  RiTwitterFill, 
  RiInstagramLine,
  RiFacebookFill,
  RiMailLine, 
  RiPhoneLine, 
  RiShieldCheckLine,
  RiTruckLine,
  RiSecurePaymentLine,
  RiCustomerServiceLine,
  RiGlobalLine
} from '@remixicon/react';

interface FooterProps {
  className?: string;
}

const Footer = ({ className = '' }: FooterProps) => {
  return (
    <footer className={`relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZG90cyIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZG90cykiLz48L3N2Zz4=')] bg-repeat"></div>
      </div>

      <div className="relative">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">
                Stay Updated with Latest Deals
              </h3>
              <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
                Get exclusive offers, new product alerts, and marketplace updates delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
                <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <div className="mb-4">
                  <Image
                    src="/logo.webp"
                    alt="Marketplace Logo"
                    width={150}
                    height={40}
                    className="object-contain h-8 w-auto"
                    priority
                  />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-3">
                  MarketHub
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Your trusted marketplace connecting buyers and sellers worldwide. Discover amazing products at unbeatable prices.
                </p>
              </div>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
                  <RiShieldCheckLine className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-300">Secure</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
                  <RiTruckLine className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-300">Fast Ship</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
                  <RiSecurePaymentLine className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-gray-300">Safe Pay</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
                  <RiCustomerServiceLine className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-gray-300">24/7 Help</span>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <span className="w-1 h-6 bg-gradient-to-b from-orange-400 to-red-400 rounded-full mr-3"></span>
                About MarketHub
              </h4>
              <div className="space-y-3 text-sm text-gray-300">
                <p>Categories: Electronics, Fashion, Home & Garden, Sports, Books, and more.</p>
                <p>Sellers: Join thousands of trusted sellers from around the world.</p>
                <p>Customer Service: 24/7 support for all your shopping needs.</p>
                <p>Shipping: Fast and reliable delivery to your doorstep.</p>
                <p>Returns: Easy returns and refunds within 30 days.</p>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <span className="w-1 h-6 bg-gradient-to-b from-orange-400 to-red-400 rounded-full mr-3"></span>
                Get in Touch
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 group">
                  <div className="bg-orange-600 p-2 rounded-lg group-hover:bg-orange-500 transition-colors flex-shrink-0">
                    <RiMailLine className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-400 mb-1">Email</p>
                    <p className="text-orange-400 text-sm break-words">
                      support@markethub.com
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 group">
                  <div className="bg-green-600 p-2 rounded-lg group-hover:bg-green-500 transition-colors flex-shrink-0">
                    <RiPhoneLine className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-400 mb-1">Phone</p>
                    <p className="text-green-400 text-sm">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 group">
                  <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-500 transition-colors flex-shrink-0">
                    <RiGlobalLine className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-400 mb-1">Worldwide</p>
                    <p className="text-blue-400 text-sm">
                      Available in 50+ countries
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 bg-gray-900/80">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              
              {/* Copyright */}
              <div className="text-gray-400 text-sm text-center lg:text-left order-2 lg:order-1">
                © {new Date().getFullYear()} MarketHub. All rights reserved.
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-6 order-1 lg:order-2">
                <span className="text-gray-400 text-sm">Follow us:</span>
                <div className="flex space-x-3">
                  <div className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-all duration-200 hover:scale-110 cursor-pointer">
                    <RiFacebookFill className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-800 hover:bg-blue-500 p-2 rounded-full transition-all duration-200 hover:scale-110 cursor-pointer">
                    <RiTwitterFill className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-800 hover:bg-pink-500 p-2 rounded-full transition-all duration-200 hover:scale-110 cursor-pointer">
                    <RiInstagramLine className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-800 hover:bg-blue-700 p-2 rounded-full transition-all duration-200 hover:scale-110 cursor-pointer">
                    <RiLinkedinFill className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Legal Text */}
              <div className="flex flex-wrap justify-center lg:justify-end gap-x-4 gap-y-2 text-sm order-3">
                <span className="text-gray-400">Privacy Policy</span>
                <span className="text-gray-400">Terms of Service</span>
                <span className="text-gray-400">Cookie Policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;