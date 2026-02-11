const Home = () => {
  return (
    <div className="card">
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
    </div>
  )
}

export default Home
