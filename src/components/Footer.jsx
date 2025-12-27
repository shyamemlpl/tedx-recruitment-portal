import './Footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <span className="brand-ted">TED</span>
                            <span className="brand-x">x</span>
                            <span className="brand-city">Prahladnagar</span>
                        </div>
                        <p className="footer-tagline">Ideas Worth Spreading</p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-section">
                            <h4>Quick Links</h4>
                            <a href="/apply">Apply Now</a>
                            <a href="/status">Check Status</a>
                        </div>
                        <div className="footer-section">
                            <h4>Connect</h4>
                            <a href="https://www.tedxprahladnagar.com" target="_blank" rel="noopener noreferrer">
                                Website
                            </a>
                            <a href="https://www.instagram.com/tedxprahladnagar" target="_blank" rel="noopener noreferrer">
                                Instagram
                            </a>
                            <a href="https://www.linkedin.com/company/tedxprahladnagar" target="_blank" rel="noopener noreferrer">
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>
                        © {currentYear} TEDxPrahladnagar. This independent TEDx event is operated under license from TED.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
