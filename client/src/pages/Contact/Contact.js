import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  HelpCircle,
  Bug,
  Lightbulb,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'contato@gymia.com',
      description: 'Resposta em até 24 horas'
    },
    {
      icon: Phone,
      title: 'Telefone',
      value: '+55 (11) 9999-9999',
      description: 'Seg-Sex, 9h às 18h'
    },
    {
      icon: MapPin,
      title: 'Endereço',
      value: 'São Paulo, SP',
      description: 'Brasil'
    },
    {
      icon: Clock,
      title: 'Horário',
      value: '24/7 Online',
      description: 'Suporte via chat sempre disponível'
    }
  ];

  const categories = [
    {
      value: 'general',
      label: 'Dúvida Geral',
      icon: HelpCircle,
      description: 'Perguntas sobre a plataforma'
    },
    {
      value: 'technical',
      label: 'Suporte Técnico',
      icon: Bug,
      description: 'Problemas técnicos ou bugs'
    },
    {
      value: 'feedback',
      label: 'Feedback',
      icon: Lightbulb,
      description: 'Sugestões e melhorias'
    },
    {
      value: 'business',
      label: 'Parcerias',
      icon: MessageCircle,
      description: 'Oportunidades de negócio'
    }
  ];

  const faqs = [
    {
      question: 'Como funciona a IA do GymIA?',
      answer: 'Nossa IA utiliza processamento de linguagem natural para entender suas necessidades e gerar planos de treino personalizados baseados em princípios científicos de alta frequência e baixo volume.'
    },
    {
      question: 'Os treinos são realmente eficazes?',
      answer: 'Sim! Nossa metodologia é baseada em mais de 200 estudos científicos sobre treinamento de força. A abordagem de alta frequência e baixo volume é comprovadamente mais eficiente para a maioria das pessoas.'
    },
    {
      question: 'Preciso de equipamentos especiais?',
      answer: 'Não necessariamente. Nossa IA adapta os treinos aos equipamentos que você tem disponível, desde treinos em casa com peso corporal até academias completas.'
    },
    {
      question: 'Como posso salvar meus planos?',
      answer: 'Usuários registrados podem salvar, editar e acompanhar o histórico de todos os seus planos de treino. Usuários não registrados podem usar a funcionalidade básica.'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <motion.div
            className="hero-content text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              Entre em <span className="gradient-text">Contato</span>
            </h1>
            
            <p className="hero-description">
              Tem dúvidas, sugestões ou precisa de ajuda? Nossa equipe está 
              aqui para ajudar você a aproveitar ao máximo o GymIA.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  className="contact-info-card glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="info-icon">
                    <Icon size={28} />
                  </div>
                  <h3 className="info-title">{info.title}</h3>
                  <p className="info-value">{info.value}</p>
                  <p className="info-description">{info.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <div className="form-content">
            <motion.div
              className="form-header text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title">Envie sua Mensagem</h2>
              <p className="section-description">
                Preencha o formulário abaixo e entraremos em contato o mais breve possível.
              </p>
            </motion.div>

            <motion.form
              className="contact-form glass-card"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Nome *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="subject" className="form-label">Assunto *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Assunto da sua mensagem"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category" className="form-label">Categoria</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Mensagem *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Descreva sua dúvida, sugestão ou problema..."
                  rows="6"
                  required
                />
              </div>

              {submitStatus === 'success' && (
                <div className="form-status success">
                  <CheckCircle size={20} />
                  <span>Mensagem enviada com sucesso! Responderemos em breve.</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="form-status error">
                  <AlertCircle size={20} />
                  <span>Erro ao enviar mensagem. Tente novamente.</span>
                </div>
              )}

              <button
                type="submit"
                className="form-submit btn btn-primary btn-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Enviar Mensagem
                  </>
                )}
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Como Podemos Ajudar?</h2>
            <p className="section-description">
              Escolha a categoria que melhor descreve sua necessidade para um atendimento mais rápido.
            </p>
          </motion.div>

          <div className="categories-grid">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={index}
                  className="category-card glass-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="category-icon">
                    <Icon size={32} />
                  </div>
                  <h3 className="category-title">{category.label}</h3>
                  <p className="category-description">{category.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Perguntas Frequentes</h2>
            <p className="section-description">
              Encontre respostas rápidas para as dúvidas mais comuns sobre o GymIA.
            </p>
          </motion.div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="faq-item glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="contact-cta-section">
        <div className="container">
          <motion.div
            className="cta-content glass-card text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="cta-title">
              Ainda tem dúvidas?
            </h2>
            <p className="cta-description">
              Nossa equipe de suporte está sempre disponível para ajudar você 
              a aproveitar ao máximo sua experiência com o GymIA.
            </p>
            
            <div className="cta-actions">
              <a href="mailto:contato@gymia.com" className="btn btn-primary btn-lg">
                <Mail size={20} />
                Enviar Email
              </a>
              <a href="tel:+5511999999999" className="btn btn-secondary btn-lg">
                <Phone size={20} />
                Ligar Agora
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
