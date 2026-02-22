import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="home-page">
      <section id="home" className="home-hero">
        <h1>
          For Students of <span>Smart Hostel</span>
        </h1>
        <h2>
          <span>Smart Hostel</span> Management
        </h2>
        <p>
          This portal is your one-place solution for all hostel-related updates and support.
        </p>
        <div className="home-hero-actions">
          <Link to="/login" className="btn btn-primary btn-large">Login to Portal</Link>
          <a href="/#about" className="btn btn-ghost btn-large">Learn More</a>
        </div>
      </section>

      <section id="about" className="home-features">
        <article className="feature-card">
          <div className="feature-icon">M</div>
          <h3>View Food Menu</h3>
          <p>Check the weekly meal plan and stay informed about your daily meals.</p>
        </article>
        <article className="feature-card">
          <div className="feature-icon">N</div>
          <h3>Stay Updated</h3>
          <p>Read the latest hostel announcements and important notices.</p>
        </article>
        <article className="feature-card">
          <div className="feature-icon feature-icon-warn">!</div>
          <h3>Post Complaint</h3>
          <p>Submit an anonymous issue if you have a problem or concern.</p>
        </article>
      </section>

      <section className="support-strip">
        <div>
          <h3>Need Help?</h3>
          <p>Questions or issues? Login to the portal for support.</p>
          <p>Email: laaluuooh@gmail.com</p>
        </div>
        <div className="support-actions">
          <Link to="/login" className="btn btn-ghost">Login to Portal</Link>
          <a href="mailto:laaluuooh@gmail.com" className="btn btn-success">Contact Support</a>
        </div>
      </section>

      <section id="contact" className="home-footer">
        <h2>Contact</h2>
        <p>© 2024 Smart Hostel. All rights reserved.</p>
        <div className="footer-links">
          <a href="/#">Privacy Policy</a>
          <a href="/#">Terms &amp; Conditions</a>
          <a href="/#">Help Center</a>
        </div>
      </section>
    </div>
  )
}

export default Landing
