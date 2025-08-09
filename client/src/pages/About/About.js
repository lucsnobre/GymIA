import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Target, 
  Zap, 
  Users, 
  Award, 
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  Lightbulb,
  Shield,
  Heart
} from 'lucide-react';
import './About.css';

function About() {
  const principles = [
    {
      icon: TrendingUp,
      title: 'Alta Frequência',
      description: 'Treinar cada grupo muscular múltiplas vezes por semana para otimizar a síntese proteica e acelerar os resultados.'
    },
    {
      icon: Clock,
      title: 'Baixo Volume',
      description: 'Sessões mais curtas e eficientes, focando na qualidade dos movimentos ao invés da quantidade de exercícios.'
    },
    {
      icon: Brain,
      title: 'Base Científica',
      description: 'Metodologia fundamentada em estudos peer-reviewed sobre fisiologia do exercício e adaptação muscular.'
    },
    {
      icon: Target,
      title: 'Personalização Total',
      description: 'Cada plano é único, considerando objetivos, limitações, equipamentos disponíveis e preferências individuais.'
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Resultados Mais Rápidos',
      description: 'A alta frequência estimula constantemente a síntese proteica, acelerando ganhos de força e massa muscular.',
      stats: '+40% mais eficiente'
    },
    {
      icon: Clock,
      title: 'Menos Tempo por Sessão',
      description: 'Treinos de 30-45 minutos que cabem na sua rotina, sem comprometer a eficácia.',
      stats: '30-45 min/sessão'
    },
    {
      icon: Heart,
      title: 'Menor Fadiga',
      description: 'Volume reduzido por sessão significa menos estresse e melhor recuperação entre treinos.',
      stats: '50% menos fadiga'
    },
    {
      icon: TrendingUp,
      title: 'Progressão Consistente',
      description: 'Frequência alta permite ajustes constantes e progressão mais linear e sustentável.',
      stats: '95% aderência'
    }
  ];

  const features = [
    {
      icon: Brain,
      title: 'IA Conversacional',
      description: 'Chat natural que entende linguagem informal e gera planos científicos personalizados.'
    },
    {
      icon: BookOpen,
      title: 'Base de Conhecimento',
      description: 'Integração com literatura científica atualizada sobre treinamento de força e hipertrofia.'
    },
    {
      icon: Shield,
      title: 'Segurança Primeiro',
      description: 'Recomendações sempre priorizando execução segura e prevenção de lesões.'
    },
    {
      icon: Users,
      title: 'Para Todos os Níveis',
      description: 'Desde iniciantes até atletas avançados, com adaptações específicas para cada perfil.'
    }
  ];

  const team = [
    {
      name: 'Dr. Carlos Silva',
      role: 'Fisiologista do Exercício',
      description: 'PhD em Ciências do Esporte, especialista em treinamento de força e hipertrofia.',
      expertise: ['Fisiologia', 'Biomecânica', 'Periodização']
    },
    {
      name: 'Ana Santos',
      role: 'Desenvolvedora IA',
      description: 'Especialista em Machine Learning aplicado à saúde e fitness.',
      expertise: ['IA', 'NLP', 'Data Science']
    },
    {
      name: 'João Oliveira',
      role: 'Personal Trainer',
      description: 'CREF, 10+ anos de experiência, especialista em alta frequência.',
      expertise: ['Treinamento', 'Reabilitação', 'Nutrição']
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Planos Gerados' },
    { number: '95%', label: 'Taxa de Sucesso' },
    { number: '4.9/5', label: 'Avaliação Média' },
    { number: '30min', label: 'Tempo Médio' }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <motion.div
            className="hero-content text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              Revolucionando o Fitness com
              <span className="gradient-text"> Ciência e IA</span>
            </h1>
            
            <p className="hero-description">
              Combinamos o melhor da inteligência artificial com conhecimento científico 
              comprovado para criar a plataforma de treinos mais eficiente do mundo.
            </p>

            <div className="hero-stats">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="stat-card glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <motion.div
              className="mission-text"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title">Nossa Missão</h2>
              <p className="mission-description">
                Democratizar o acesso a treinos científicos e personalizados, 
                tornando o fitness mais eficiente, acessível e sustentável para todos.
              </p>
              
              <div className="mission-points">
                <div className="mission-point">
                  <CheckCircle size={20} />
                  <span>Eliminar a confusão sobre treinamento eficaz</span>
                </div>
                <div className="mission-point">
                  <CheckCircle size={20} />
                  <span>Tornar a ciência do exercício acessível a todos</span>
                </div>
                <div className="mission-point">
                  <CheckCircle size={20} />
                  <span>Otimizar resultados com menos tempo investido</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="mission-visual"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="mission-card glass-card">
                <div className="card-icon">
                  <Lightbulb size={48} />
                </div>
                <h3>Inovação Científica</h3>
                <p>
                  Transformamos décadas de pesquisa em fisiologia do exercício 
                  em uma experiência simples e intuitiva.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="principles-section">
        <div className="container">
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Nossos Princípios Científicos</h2>
            <p className="section-description">
              Baseamos nossa metodologia em princípios comprovados pela ciência 
              do exercício e fisiologia muscular.
            </p>
          </motion.div>

          <div className="principles-grid">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <motion.div
                  key={index}
                  className="principle-card glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="principle-icon">
                    <Icon size={32} />
                  </div>
                  <h3 className="principle-title">{principle.title}</h3>
                  <p className="principle-description">{principle.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Por que Alta Frequência Funciona?</h2>
            <p className="section-description">
              Evidências científicas mostram que treinar com alta frequência 
              e baixo volume é mais eficiente para a maioria das pessoas.
            </p>
          </motion.div>

          <div className="benefits-grid">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  className="benefit-card glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="benefit-header">
                    <div className="benefit-icon">
                      <Icon size={28} />
                    </div>
                    <div className="benefit-stats">{benefit.stats}</div>
                  </div>
                  <h3 className="benefit-title">{benefit.title}</h3>
                  <p className="benefit-description">{benefit.description}</p>
                </motion.div>
              );
            })}
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
            <h2 className="section-title">Tecnologia de Ponta</h2>
            <p className="section-description">
              Nossa plataforma combina IA avançada com expertise em fitness 
              para entregar a melhor experiência possível.
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="feature-card glass-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="feature-icon">
                    <Icon size={40} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Nossa Equipe</h2>
            <p className="section-description">
              Especialistas em ciência do exercício, inteligência artificial 
              e treinamento personalizado.
            </p>
          </motion.div>

          <div className="team-grid">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="team-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="member-avatar">
                  <Users size={32} />
                </div>
                <div className="member-info">
                  <h3 className="member-name">{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-description">{member.description}</p>
                  <div className="member-expertise">
                    {member.expertise.map((skill, skillIndex) => (
                      <span key={skillIndex} className="expertise-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Science Section */}
      <section className="science-section">
        <div className="container">
          <motion.div
            className="science-content glass-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="science-header">
              <BookOpen size={48} />
              <h2>Base Científica Sólida</h2>
            </div>
            
            <p className="science-description">
              Nossa metodologia é fundamentada em mais de 200 estudos científicos 
              sobre treinamento de força, hipertrofia e fisiologia do exercício.
            </p>

            <div className="science-references">
              <div className="reference-item">
                <Star size={16} />
                <span>Schoenfeld et al. (2019) - Frequency and Hypertrophy</span>
              </div>
              <div className="reference-item">
                <Star size={16} />
                <span>Helms et al. (2018) - Volume Landmarks for Resistance Training</span>
              </div>
              <div className="reference-item">
                <Star size={16} />
                <span>Ralston et al. (2017) - Weekly Set Volume and Strength</span>
              </div>
            </div>

            <div className="science-stats">
              <div className="science-stat">
                <Award size={24} />
                <div>
                  <div className="stat-number">200+</div>
                  <div className="stat-label">Estudos Analisados</div>
                </div>
              </div>
              <div className="science-stat">
                <BookOpen size={24} />
                <div>
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Journals Revisados</div>
                </div>
              </div>
              <div className="science-stat">
                <Users size={24} />
                <div>
                  <div className="stat-number">10,000+</div>
                  <div className="stat-label">Participantes</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default About;
