const Landing = () => {
  return (
    <div>
      <section id="home" className="card" style={{ marginBottom: 24 }}>
        <h1>Smart Hostel Management</h1>
        <p>
          A web-based system for hostel operations with two user roles: Warden and Students.
          Warden manages daily menu, reviews anonymous complaints, and posts notifications.
          Students view the menu, submit anonymous complaints, and read notifications.
        </p>
        <div className="grid">
          <div className="card">
            <h3>Warden</h3>
            <p className="muted">Add or update menu, view complaints, notify students.</p>
          </div>
          <div className="card">
            <h3>Students</h3>
            <p className="muted">See menu, complain anonymously, read latest notices.</p>
          </div>
        </div>
      </section>

      <section id="about" className="card" style={{ marginBottom: 24 }}>
        <h1>About</h1>
        <p>
          Services include menu management, anonymous complaint handling, and warden notices.
          The system separates features for Warden and Students to keep workflows simple.
        </p>
        <ul className="list">
          <li className="list-item">Menu management for daily meals</li>
          <li className="list-item">Anonymous complaints from students</li>
          <li className="list-item">Notifications published by the warden</li>
        </ul>
      </section>

      <section id="contact" className="card">
        <h1>Contact</h1>
        <p>Email: laaluuooh@gmail.com</p>
      </section>
    </div>
  )
}

export default Landing
