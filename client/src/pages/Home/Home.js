import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Zap, 
  Target, 
  Users, 
  ArrowRight,
  CheckCircle,
  Star,
  Dumbbell,
  Brain,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Home.css';

function Home() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Brain,
      title: 'IA Personalizada',
      description: 'Chat inteligente que entende linguagem natural e gera planos científicos baseados em alta frequência e baixo volume.'
    },
    {
      icon: TrendingUp,
      title: 'Base Científica',
      description: 'Treinos fundamentados em estudos reais sobre eficiência do treinamento de alta frequência.'
    },
    {
      icon: Target,
      title: 'Totalmente Personalizado',
      description: 'Planos adaptados aos seus objetivos, tempo disponível, equipamentos e condições físicas.'
    },
    {
      icon: Zap,
      title: 'Resultados Rápidos',
      description: 'Metodologia otimizada para máximos resultados com menor tempo de treino por sessão.'
    }
  ];

  const benefits = [
    'Treinos baseados em evidências científicas',
    'Chat natural - fale como quiser, a IA entende',
    'Planos salvos e editáveis',
    'Progressão automática e inteligente',
    'Suporte para todos os níveis de condicionamento',
    'Interface moderna e intuitiva'
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Iniciante em Fitness',
      text: 'Nunca pensei que conseguiria criar um plano de treino tão eficiente. A IA entendeu perfeitamente minhas limitações!',
      rating: 5
    },
    {
      name: 'João Santos',
      role: 'Atleta Amador',
      text: 'Os princípios de alta frequência realmente funcionam. Estou vendo resultados que nunca consegui antes.',
      rating: 5
    },
    {
      name: 'Ana Costa',
      role: 'Profissional Ocupada',
      text: 'Perfeito para quem tem pouco tempo. Treinos de 30-45 minutos que realmente fazem diferença.',
      rating: 5
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <motion.div
              className="hero-text"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="hero-title">
                Treinos Personalizados com
                <span className="gradient-text"> Inteligência Artificial</span>
              </h1>
              
              <p className="hero-description">
                Converse naturalmente com nossa IA e receba planos de treino científicos 
                baseados em alta frequência e baixo volume. Resultados comprovados, 
                adaptados ao seu perfil e objetivos.
              </p>

              <div className="hero-actions">
                <Link to="/chat" className="btn btn-primary btn-lg">
                  <MessageCircle size={20} />
                  Começar Chat com IA
                </Link>
                
                {!isAuthenticated && (
                  <Link to="/register" className="btn btn-secondary btn-lg">
                    Criar Conta Grátis
                  </Link>
                )}
                
                <Link to="/about" className="btn btn-ghost btn-lg">
                  Saber Mais
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Eficiência Comprovada</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">30min</div>
                  <div className="stat-label">Treinos Médios</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">5x</div>
                  <div className="stat-label">Frequência Semanal</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="hero-card glass-card">
                <div className="chat-preview">
                  <div className="chat-message user">
                    "Quero ganhar massa magra, treino 4x por semana, 45 minutos"
                  </div>
                  <div className="chat-message ai">
                    <Dumbbell size={16} />
                    Perfeito! Vou criar um plano de alta frequência otimizado para seus objetivos...
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Por que escolher o GymIA?</h2>
            <p className="section-description">
              Tecnologia de ponta encontra ciência do exercício para criar 
              a melhor experiência de treino personalizado.
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="feature-card glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="feature-icon">
                    <Icon size={32} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <div className="benefits-content">
            <motion.div
              className="benefits-text"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title">
                Tudo que você precisa em um só lugar
              </h2>
              <p className="section-description">
                Nossa plataforma combina o melhor da tecnologia com 
                conhecimento científico para entregar resultados reais.
              </p>

              <div className="benefits-list">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="benefit-item"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle size={20} className="benefit-icon" />
                    <span>{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <Link to="/chat" className="btn btn-primary btn-lg mt-lg">
                Experimentar Agora
                <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div
              className="benefits-visual"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="workout-preview glass-card">
                <div className="preview-header">
                  <h4>Seu Plano Personalizado</h4>
                  <span className="preview-badge">Alta Frequência</span>
                </div>
                <div className="preview-content">
                  <div className="exercise-item">
                    <span className="exercise-name">Agachamento</span>
                    <span className="exercise-sets">3x8-10</span>
                  </div>
                  <div className="exercise-item">
                    <span className="exercise-name">Supino Inclinado</span>
                    <span className="exercise-sets">3x8-10</span>
                  </div>
                  <div className="exercise-item">
                    <span className="exercise-name">Remada Curvada</span>
                    <span className="exercise-sets">3x10-12</span>
                  </div>
                  <div className="preview-footer">
                    <span>Duração: 45 min</span>
                    <span>Frequência: 4x/semana</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">O que nossos usuários dizem</h2>
            <p className="section-description">
              Resultados reais de pessoas reais usando nossa plataforma.
            </p>
          </motion.div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="star-filled" />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <Users size={20} />
                  </div>
                  <div>
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-role">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-content glass-card text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="cta-title">
              Pronto para transformar seus treinos?
            </h2>
            <p className="cta-description">
              Comece agora mesmo e descubra como a IA pode revolucionar 
              sua jornada fitness com treinos científicos e personalizados.
            </p>
            
            <div className="cta-actions">
              <Link to="/chat" className="btn btn-primary btn-lg">
                <MessageCircle size={20} />
                Iniciar Chat com IA
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="btn btn-secondary btn-lg">
                  Criar Conta Grátis
                </Link>
              )}
            </div>

            <p className="cta-note">
              Gratuito para sempre • Sem cartão de crédito • Resultados garantidos
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
