import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  BarChart3, 
  Share2, 
  Zap, 
  Lock,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

// Navigation
function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">SurveyLite</div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-gray-700 hover:text-blue-600">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600">How It Works</a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-600">Testimonials</a>
            <a href="#faq" className="text-gray-700 hover:text-blue-600">FAQ</a>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <a href="#features" className="block text-gray-700 hover:text-blue-600">Features</a>
            <a href="#how-it-works" className="block text-gray-700 hover:text-blue-600">How It Works</a>
            <a href="#testimonials" className="block text-gray-700 hover:text-blue-600">Testimonials</a>
            <a href="#faq" className="block text-gray-700 hover:text-blue-600">FAQ</a>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/login')}
                className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Hero Section
function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Create Surveys That <span className="text-blue-600">Matter</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              SurveyLite makes it easy to create, distribute, and analyze surveys. Get insights from your audience in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                Start Free <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50"
              >
                Sign In
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-6">No credit card required. Start creating surveys today.</p>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-24 h-24 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Survey Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      title: 'Lightning Fast',
      description: 'Create professional surveys in minutes with our intuitive builder'
    },
    {
      icon: <Share2 className="w-8 h-8 text-blue-600" />,
      title: 'Easy Distribution',
      description: 'Share surveys via link, email, or embedded on your website'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      title: 'Real-time Analytics',
      description: 'Get instant insights with beautiful charts and visualizations'
    },
    {
      icon: <Lock className="w-8 h-8 text-blue-600" />,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security for your survey data'
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    { number: 1, title: 'Create', description: 'Design your survey with various question types' },
    { number: 2, title: 'Share', description: 'Distribute via link, email, or embed on your site' },
    { number: 3, title: 'Analyze', description: 'View real-time responses and detailed analytics' },
    { number: 4, title: 'Export', description: 'Download results in CSV or JSON format' },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      company: 'TechCorp',
      content: 'SurveyLite has transformed how we gather customer feedback. The analytics are incredibly insightful!'
    },
    {
      name: 'Michael Chen',
      role: 'Product Lead',
      company: 'StartupXYZ',
      content: 'Simple, fast, and exactly what we needed. Highly recommended for any team doing user research.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'HR Director',
      company: 'Global Solutions',
      content: 'Our employee surveys are now beautifully designed and the insights help us improve company culture.'
    },
  ];

  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">What Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="p-6 rounded-lg border border-gray-200 bg-gray-50">
              <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Is SurveyLite free?',
      answer: 'Yes! SurveyLite is completely free to use. Create unlimited surveys and collect unlimited responses at no cost.'
    },
    {
      question: 'How many survey responses can I collect?',
      answer: 'There is no limit on the number of responses you can collect. Gather feedback from as many respondents as you need.'
    },
    {
      question: 'Can I export my survey data?',
      answer: 'Absolutely! You can export all survey data in CSV or JSON format for further analysis in your preferred tools.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, your survey data is protected with enterprise-grade security. We take privacy and data protection seriously.'
    },
    {
      question: 'Can I embed surveys on my website?',
      answer: 'Yes, you can share surveys via public link or embed them directly on your website using our embed code.'
    },
    {
      question: 'Do you offer customer support?',
      answer: 'We provide comprehensive documentation and are constantly improving our platform based on user feedback.'
    },
  ];

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg bg-white">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50"
              >
                <h3 className="font-semibold text-gray-900 text-left">{faq.question}</h3>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-6 text-gray-700 border-t border-gray-200">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">SurveyLite</h3>
            <p className="text-gray-400">Create surveys, gather insights, make better decisions.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Privacy</a></li>
              <li><a href="#" className="hover:text-white">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">© 2026 SurveyLite. All rights reserved.</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-gray-400 hover:text-white"
            >
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main Landing Page
export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
