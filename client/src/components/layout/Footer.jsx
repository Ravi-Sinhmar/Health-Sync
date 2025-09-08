// Footer.jsx
import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin } from "react-feather";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Heart className="h-6 w-6 text-violet-400 mr-2" />
              <span className="text-xl font-bold">Health Sync</span>
            </div>
            <p className="text-[13px] text-gray-300 mb-4">
              Comprehensive health tracking for students and athletes. Monitor your vital signs, 
              performance metrics, and overall wellness.
            </p>
            <div className="flex space-x-4">
              {/* Social media icons would go here */}
            </div>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-[13px] text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-[13px] text-gray-300 hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-[13px] text-gray-300 hover:text-white">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/select-metrics" className="text-[13px] text-gray-300 hover:text-white">
                  Health Metrics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-[13px] text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-[13px] text-gray-300 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-[13px] text-gray-300 hover:text-white">
                  Refund Policy
                </Link>
              </li>
               <li>
                <Link to="/shipping" className="text-[13px] text-gray-300 hover:text-white">
                  Shipping
                </Link>
              </li>


              <li>
                <Link to="/contact" className="text-[13px] text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wider mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span className="text-[13px] text-gray-300">Meham, Rohtak, Haryana (124112)</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <a href="tel:+918295236618" className="text-[13px] text-gray-300 hover:text-white">
                  +91 8295236618
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <a href="mailto:ravi.sinhmar28@gmail.com" className="text-[13px] text-gray-300 hover:text-white">
                  ravi.sinhmar28@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-[13px] text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Health Sync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;