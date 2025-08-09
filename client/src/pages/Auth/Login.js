import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

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

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      // Navigation will be handled by useEffect
    } catch (error) {
      setErrors({
        general: error.message || 'Erro ao fazer login. Verifique suas credenciais.'
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
              Bem-vindo de volta!
            </h1>
            <p className="auth-subtitle">
              Entre na sua conta para continuar sua jornada fitness
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
                  placeholder="Sua senha"
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
              {errors.password && (
                <div className="form-error">
                  <AlertCircle size={16} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            <div className="form-options">
              <label className="checkbox-wrapper">
                <input type="checkbox" className="checkbox" />
                <span className="checkbox-label">Lembrar-me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              className="auth-submit btn btn-primary btn-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="spinner" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Entrar
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <p className="auth-switch">
              Não tem uma conta?{' '}
              <Link to="/register" className="auth-link">
                Cadastre-se grátis
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="demo-credentials">
            <h4>Credenciais de Demonstração:</h4>
            <div className="demo-info">
              <p><strong>Email:</strong> demo@gymia.com</p>
              <p><strong>Senha:</strong> demo123</p>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setFormData({
                  email: 'demo@gymia.com',
                  password: 'demo123'
                });
              }}
              disabled={isLoading}
            >
              Preencher Automaticamente
            </button>
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
              Continue sua jornada fitness
            </h2>
            <p className="side-description">
              Acesse seus planos personalizados, histórico de treinos e 
              continue conversando com nossa IA especializada.
            </p>
            
            <div className="side-features">
              <div className="side-feature">
                <CheckCircle size={20} />
                <span>Planos salvos e editáveis</span>
              </div>
              <div className="side-feature">
                <CheckCircle size={20} />
                <span>Histórico completo de treinos</span>
              </div>
              <div className="side-feature">
                <CheckCircle size={20} />
                <span>Progressão personalizada</span>
              </div>
              <div className="side-feature">
                <CheckCircle size={20} />
                <span>Chat ilimitado com IA</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
