import { Link } from 'react-router-dom'
import { FiArrowRight, FiPlay, FiStar, FiUsers, FiAward, FiZap } from 'react-icons/fi'
import { motion } from 'framer-motion'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 text-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                AI-Powered Learning Platform for{' '}
                <span className="text-yellow-300">Everyone</span>
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                Transform your teaching with AI automation, gamification, and advanced analytics.
                Build your own digital academy today.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100">
                  Get Started Free
                </Link>
                <button className="btn border-2 border-white text-white hover:bg-white/10">
                  <FiPlay className="mr-2" />
                  Watch Demo
                </button>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-8">
                <div>
                  <p className="text-3xl font-bold">10K+</p>
                  <p className="text-gray-200">Active Teachers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">50K+</p>
                  <p className="text-gray-200">Students</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">4.8★</p>
                  <p className="text-gray-200">Average Rating</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block"
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
                alt="Students learning"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose EduPro+?</h2>
            <p className="text-xl text-gray-600">Everything you need to build and grow your academy</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FiZap,
                title: 'AI-Powered Tools',
                description: 'Auto-generate quizzes, lesson plans, and get AI-powered insights',
                color: 'text-yellow-500',
              },
              {
                icon: FiUsers,
                title: 'Live Classes',
                description: 'Conduct interactive live sessions with whiteboard and screen sharing',
                color: 'text-blue-500',
              },
              {
                icon: FiAward,
                title: 'Gamification',
                description: 'Engage students with XP, badges, streaks, and leaderboards',
                color: 'text-green-500',
              },
              {
                icon: FiStar,
                title: 'Content Protection',
                description: 'Advanced DRM, watermarking, and anti-piracy measures',
                color: 'text-purple-500',
              },
              {
                icon: FiUsers,
                title: 'Advanced Analytics',
                description: 'Track student progress, engagement, and revenue in real-time',
                color: 'text-pink-500',
              },
              {
                icon: FiZap,
                title: 'Multi-Currency Support',
                description: 'Accept payments globally with multiple payment gateways',
                color: 'text-indigo-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card hover:shadow-lg transition-shadow"
              >
                <feature.icon className={`${feature.color} mb-4`} size={40} />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Teaching?</h2>
          <p className="text-xl mb-8 text-gray-100">
            Join thousands of educators already using EduPro+
          </p>
          <Link
            to="/register"
            className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4"
          >
            Start Your Free Trial
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
