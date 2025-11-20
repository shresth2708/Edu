import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E+</span>
              </div>
              <span className="text-xl font-bold text-white">EduPro+</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              AI-Powered Teaching & Learning Platform empowering educators and students worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-white transition">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* For Teachers */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Teachers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register?role=teacher" className="text-gray-400 hover:text-white transition">
                  Become a Teacher
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-white transition">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-400 hover:text-white transition">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white transition">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <FiMail className="mt-1 flex-shrink-0" />
                <span className="text-gray-400">support@edupro.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <FiPhone className="mt-1 flex-shrink-0" />
                <span className="text-gray-400">+91 98765 43210</span>
              </li>
              <li className="flex items-start space-x-2">
                <FiMapPin className="mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Education Street, Mumbai, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2025 EduPro+. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-sm text-gray-400 hover:text-white transition">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
