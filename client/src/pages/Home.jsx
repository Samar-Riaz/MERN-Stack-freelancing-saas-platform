import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="homepage-wrapper">
      <header className="navbar">
        <div className="navbar-left">
          <span className="logo">
            <span className="logo-icon">🐼</span>
            <span className="logo-text">PandaHire</span>
          </span>
        </div>
        <nav className="navbar-center">
          <a href="#features">Features</a>
          <a href="#services">Services</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#testimonials">Testimonials</a>
        </nav>
        <div className="navbar-right">
          <div className="auth-buttons">
            <button 
              className="secondary-btn"
              onClick={() => navigate("/Login")}
            >
              Login
            </button>
            <button 
              className="primary-btn"
              onClick={() => navigate("/Register")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section full-page">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Find Your Dream Freelance Gig</h1>
              <p className="hero-subtitle">
                Connect with top clients and get paid securely with PandaHire's 
                trusted platform.
              </p>
              <div className="cta-buttons">
                <button 
                  className="primary-btn large"
                  onClick={() => navigate("/Register")}
                >
                  Get Started
                </button>
                <button 
                  className="secondary-btn large"
                  onClick={() => navigate("#how-it-works")}
                >
                  How It Works
                </button>
              </div>
            </div>
            <div className="hero-image">
              <img 
                src="/panda.png" 
                alt="Panda working on laptop" 
                className="panda-image"
              />
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="trust-section">
          <div className="trust-badges">
            <div className="trust-item">
              <span>10,000+</span>
              <p>Freelancers</p>
            </div>
            <div className="trust-item">
              <span>5,000+</span>
              <p>Satisfied Clients</p>
            </div>
            <div className="trust-item">
              <span>$5M+</span>
              <p>Paid to Freelancers</p>
            </div>
            <div className="trust-item">
              <span>4.9/5</span>
              <p>Average Rating</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section full-page" id="features">
          <div className="section-header">
            <h2>Why Choose PandaHire?</h2>
            <p className="section-subtitle">
              Everything you need to succeed as a freelancer
            </p>
          </div>
          <div className="features-grid">
            {[
              {
                icon: "🔒",
                title: "Secure Payments",
                description: "Get paid on time with our escrow system"
              },
              {
                icon: "💬",
                title: "Direct Messaging",
                description: "Communicate securely with clients"
              },
              {
                icon: "📊",
                title: "Progress Tracking",
                description: "Track your work and milestones"
              },
              {
                icon: "⚡",
                title: "Fast Payouts",
                description: "Withdraw your earnings instantly"
              },
              {
                icon: "🏆",
                title: "Reputation System",
                description: "Build your professional profile"
              },
              {
                icon: "🌐",
                title: "Global Opportunities",
                description: "Work with clients worldwide"
              }
            ].map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works full-page" id="how-it-works">
          <div className="section-header">
            <h2>How PandaHire Works</h2>
            <p className="section-subtitle">
              Get started in just a few simple steps
            </p>
          </div>
          <div className="steps-container">
            {[
              {
                step: "1",
                title: "Create Your Profile",
                description: "Showcase your skills and experience"
              },
              {
                step: "2",
                title: "Browse Projects",
                description: "Find work that matches your expertise"
              },
              {
                step: "3",
                title: "Submit Proposals",
                description: "Pitch your services to clients"
              },
              {
                step: "4",
                title: "Get Hired & Work",
                description: "Collaborate using our platform tools"
              },
              {
                step: "5",
                title: "Get Paid Securely",
                description: "Receive payments upon completion"
              }
            ].map((step, index) => (
              <div className="step-card" key={index}>
                <div className="step-number">{step.step}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section full-page" id="testimonials">
          <div className="section-header">
            <h2>What Our Users Say</h2>
            <p className="section-subtitle">
              Hear from freelancers and clients who love PandaHire
            </p>
          </div>
          <div className="testimonials-grid">
            {[
              {
                quote: "PandaHire helped me triple my freelance income within 6 months. The platform is so easy to use!",
                author: "Sarah K., Web Developer",
                rating: "★★★★★"
              },
              {
                quote: "As a small business owner, finding quality freelancers was tough until I discovered PandaHire.",
                author: "Michael T., Startup Founder",
                rating: "★★★★★"
              },
              {
                quote: "The secure payment system gives me peace of mind when hiring freelancers for my projects.",
                author: "Lisa M., Marketing Director",
                rating: "★★★★☆"
              }
            ].map((testimonial, index) => (
              <div className="testimonial-card" key={index}>
                <div className="rating">{testimonial.rating}</div>
                <p className="quote">"{testimonial.quote}"</p>
                <p className="author">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section full-page">
          <div className="cta-container">
            <h2>Ready to Grow Your Freelance Career?</h2>
            <p>
              Join thousands of freelancers already succeeding on PandaHire
            </p>
            <button 
              className="primary-btn large"
              onClick={() => navigate("/register")}
            >
              Get Started - It's Free
            </button>
          </div>
        </section>
      </main>

      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-logo">
            <span className="logo-icon">🐼</span>
            <span className="logo-text">PandaHire</span>
          </div>
          <div className="footer-links">
            <div className="link-column">
              <h4>For Freelancers</h4>
              <a href="#">How It Works</a>
              <a href="#">Find Work</a>
              <a href="#">Membership</a>
            </div>
            <div className="link-column">
              <h4>For Clients</h4>
              <a href="#">Post a Job</a>
              <a href="#">Browse Freelancers</a>
              <a href="#">Enterprise Solutions</a>
            </div>
            <div className="link-column">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PandaHire. All rights reserved.</p>
          <div className="legal-links">
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}