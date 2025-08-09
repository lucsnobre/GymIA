import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  UserPlus,
  AlertCircle,
  CheckCircle,
  Loader,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Senha deve conter ao menos: 1 minúscula, 1 maiúscula e 1 número';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Você deve aceitar os termos de uso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
  };

  const getPasswordStrengthLabel = (strength) => {
    if (strength <= 2) return { label: 'Fraca', color: 'var(--error)' };
    if (strength <= 4) return { label: 'Média', color: 'var(--warning)' };
    return { label: 'Forte', color: 'var(--success)' };
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthInfo = getPasswordStrengthLabel(passwordStrength);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      // Navigation will be handled by useEffect
    } catch (error) {
      setErrors({
        general: error.message || 'Erro ao criar conta. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div
          className="auth-card glass-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="auth-header">
            <h1 className="auth-title">
              Crie sua conta
            </h1>
            <p className="auth-subtitle">
              Comece sua jornada fitness personalizada com IA
            </p>
          </div>

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="form-error general">
                <AlertCircle size={20} />
                <span>{errors.general}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Nome completo
              </label>
              <div className="input-wrapper">
                <User size={20} className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Seu nome completo"
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <div className="form-error">
                  <AlertCircle size={16} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <div className="input-wrapper">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="seu@email.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <div className="form-error">
                  <AlertCircle size={16} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Senha
              </label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Crie uma senha segura"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{ 
                        width: `${(passwordStrength / 6) * 100}%`,
                        backgroundColor: strengthInfo.color
                      }}
                    />
                  </div>
                  <span 
                    className="strength-label"
                    style={{ color: strengthInfo.color }}
                  >
                    {strengthInfo.label}
                  </span>
                </div>
              )}
              
              {errors.password && (
                <div className="form-error">
                  <AlertCircle size={16} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar senha
              </label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirme sua senha"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="form-error">
                  <AlertCircle size={16} />
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="checkbox-wrapper">
                <input 
                  type="checkbox" 
                  className="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  disabled={isLoading}
                />
                <span className="checkbox-label">
                  Aceito os{' '}
                  <Link to="/terms" className="auth-link">
                    Termos de Uso
                  </Link>
                  {' '}e{' '}
                  <Link to="/privacy" className="auth-link">
                    Política de Privacidade
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <div className="form-error">
                  <AlertCircle size={16} />
                  <span>{errors.terms}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="auth-submit btn btn-primary btn-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="spinner" />
                  Criando conta...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Criar conta grátis
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <p className="auth-switch">
              Já tem uma conta?{' '}
              <Link to="/login" className="auth-link">
                Faça login
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Side Content */}
        <motion.div
          className="auth-side"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="side-content">
            <h2 className="side-title">
              Junte-se a milhares de pessoas
            </h2>
            <p className="side-description">
              Transforme seus treinos com inteligência artificial e 
              metodologia científica comprovada.
            </p>
            
            <div className="side-features">
              <div className="side-feature">
                <CheckCircle size={20} />
                <span>Planos 100% personalizados</span>
              </div>
              <div className="side-feature">
                <CheckCircle size={20} />
                <span>Chat inteligente com IA</span>
              </div>
              <div className="side-feature">
                <CheckCircle size={20} />
                <span>Base científica sólida</span>
              </div>
              <div className="side-feature">
                <CheckCircle size={20} />
                <span>Resultados comprovados</span>
              </div>
            </div>

            <div className="security-note">
              <Shield size={24} />
              <div>
                <h4>Seus dados estão seguros</h4>
                <p>Utilizamos criptografia de ponta para proteger suas informações pessoais.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
