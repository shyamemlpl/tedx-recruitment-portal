import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const teams = [
    {
        name: 'Marketing',
        icon: '📢',
        description: 'Spread the word and build our brand presence across platforms.'
    },
    {
        name: 'Production/Video',
        icon: '🎬',
        description: 'Bring events to life with video production and editing.'
    },
    {
        name: 'Content Writing',
        icon: '✍️',
        description: 'Craft compelling stories and narratives that inspire action.'
    },
    {
        name: 'Operations',
        icon: '⚙️',
        description: 'Ensure smooth operations and logistics for all our initiatives.'
    },
    {
        name: 'Design Team',
        icon: '🎨',
        description: 'Create stunning visuals that communicate our ideas effectively.'
    },
    {
        name: 'Curation',
        icon: '🔍',
        description: 'Discover and curate ideas worth spreading from diverse voices.'
    }
];

function Home() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-content">
                    <h1 className="animate-fade-in">
                        Join <span className="highlight">TED<span className="super-x">x</span>Prahladnagar</span>
                    </h1>
                    <p className="hero-description animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        TEDxPrahladnagar strives to explore & celebrate ingenious perspectives.
                        The organization enables you to be a part of a community that works to benefit
                        the society and proves to be a platform for you to explore your own skills.
                    </p>
                    <p className="hero-highlight animate-fade-in" style={{ animationDelay: '0.15s' }}>
                        🏆 First TED franchise to organize a woman-focused event in the state of Gujarat.
                    </p>
                    <div className="hero-actions animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <Link to="/apply" className="btn btn-primary btn-large">
                            Apply Now
                        </Link>
                        {!isAuthenticated && (
                            <Link to="/status" className="btn btn-outline btn-large">
                                Check Application Status
                            </Link>
                        )}
                    </div>
                </div>
                <div className="hero-decoration">
                    <div className="x-pattern"></div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section">
                <div className="container">
                    <div className="about-content">
                        <div className="about-text">
                            <h2>About TEDxPrahladnagar</h2>
                            <p>
                                TEDxPrahladnagar is an independent organization that hosts keynotes, lectures,
                                and seminars to provide local voices the chance to be heard globally and inspire others.
                            </p>
                            <p>
                                In keeping with TED's vision to explore and identify "ideas worth spreading,"
                                TEDx is a grassroots endeavor. Via TEDx events, TED is brought to local communities
                                all over the world. These conferences are put together by a team of dedicated personnel
                                who are driven to discover novel ideas and to propagate the most relevant discourses
                                in their communities.
                            </p>
                            <a
                                href="https://www.ted.com/tedx/events/56201"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline"
                            >
                                View Our Past Events →
                            </a>
                        </div>
                        <div className="about-visual">
                            <div className="visual-card">
                                <span className="visual-x">x</span>
                                <span className="visual-text">Ideas Worth Spreading</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Join Section */}
            <section className="why-join">
                <div className="container">
                    <div className="section-heading">
                        <h2>Why Join Us?</h2>
                        <p>
                            Through TEDxPrahladnagar we offer you a safe space to connect with an excellent team and grow.
                        </p>
                    </div>

                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-icon">🚀</div>
                            <h3>Grow Your Skills</h3>
                            <p>Work on real projects, learn from mentors, and develop professional skills.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">🌐</div>
                            <h3>Expand Your Network</h3>
                            <p>Connect with speakers, partners, and like-minded individuals.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">💡</div>
                            <h3>Spread Ideas</h3>
                            <p>Be part of the mission to spread ideas that matter and create impact.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">🏆</div>
                            <h3>Recognition</h3>
                            <p>Get certified and recognized for your contribution to a global brand.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Teams Section */}
            <section className="teams-section">
                <div className="container">
                    <div className="section-heading">
                        <h2>Our Teams</h2>
                        <p>Find where you belong. Each team plays a vital role in making TEDx magic happen.</p>
                    </div>

                    <div className="teams-grid">
                        {teams.map((team) => (
                            <div key={team.name} className="team-card">
                                <div className="team-icon">{team.icon}</div>
                                <h3>{team.name}</h3>
                                <p>{team.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Disclaimer Banner */}
            <section className="disclaimer-section">
                <div className="container">
                    <div className="disclaimer-banner">
                        <div className="disclaimer-icon">ℹ️</div>
                        <div className="disclaimer-content">
                            <p>
                                <strong>Important:</strong> Completing the online application form does not guarantee
                                your selection in the respective teams. You will be called for a virtual/online interview
                                by our organizer and respective team leaders, post which you will receive your confirmation email.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Make an Impact?</h2>
                        <p>Applications for 2025 are now open. Don't miss your chance to be part of something extraordinary.</p>
                        <Link to="/apply" className="btn btn-primary btn-large">
                            Start Your Application
                        </Link>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section">
                <div className="container">
                    <div className="contact-content">
                        <h3>Get in Touch</h3>
                        <p>For queries, email us and we will reach back within two business days:</p>
                        <a href="mailto:tedxprahladnagar@gmail.com" className="contact-email">
                            tedxprahladnagar@gmail.com
                        </a>
                        <div className="contact-phones">
                            <div className="contact-person">
                                <span className="person-name">Dev</span>
                                <a href="tel:+919344172991">+91 93441 72991</a>
                            </div>
                            <div className="contact-person">
                                <span className="person-name">Shlok</span>
                                <a href="tel:+919974441199">+91 99744 41199</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
