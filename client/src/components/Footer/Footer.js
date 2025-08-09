import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Twitter, 
  Instagram,
  Heart,
  ArrowUp
} from 'lucide-react';
import './Footer.css';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <Dumbbell size={32} />
              <span>GymIA</span>
            </Link>
            <p className="footer-description">
              Transforme seus treinos com inteligência artificial. 
              Planos personalizados baseados em ciência para 
              resultados reais e duradouros.
            </p>
            <div className="footer-social">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-title">Plataforma</h4>
              <ul className="footer-list">
                <li><Link to="/chat">Chat com IA</Link></li>
                <li><Link to="/plans">Meus Planos</Link></li>
                <li><Link to="/profile">Perfil</Link></li>
                <li><Link to="/about">Sobre</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Recursos</h4>
              <ul className="footer-list">
                <li><a href="#science">Base Científica</a></li>
                <li><a href="#methodology">Metodologia</a></li>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#blog">Blog</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Suporte</h4>
              <ul className="footer-list">
                <li><Link to="/contact">Contato</Link></li>
                <li><a href="#help">Central de Ajuda</a></li>
                <li><a href="#tutorials">Tutoriais</a></li>
                <li><a href="#community">Comunidade</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Legal</h4>
              <ul className="footer-list">
                <li><a href="#privacy">Privacidade</a></li>
                <li><a href="#terms">Termos de Uso</a></li>
                <li><a href="#cookies">Cookies</a></li>
                <li><a href="#security">Segurança</a></li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="footer-contact">
            <h4 className="footer-title">Contato</h4>
            <div className="contact-info">
              <div className="contact-item">
                <Mail size={16} />
                <span>contato@gymia.com</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+55 (11) 9999-9999</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>São Paulo, Brasil</span>
              </div>
            </div>
            
            <div className="newsletter">
              <h5>Newsletter</h5>
              <p>Receba dicas e novidades sobre treinos</p>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Seu email"
                  className="newsletter-input"
                  aria-label="Email para newsletter"
                />
                <button type="submit" className="newsletter-btn">
                  Inscrever
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} GymIA. Todos os direitos reservados.
            </p>
            
            <p className="made-with">
              Feito com <Heart size={16} className="heart-icon" /> para revolucionar seus treinos
            </p>
            
            <button 
              onClick={scrollToTop}
              className="scroll-top-btn"
              aria-label="Voltar ao topo"
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
