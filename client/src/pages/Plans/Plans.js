import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Target, 
  Dumbbell,
  Edit3,
  Trash2,
  Play,
  Pause,
  MoreVertical,
  Download,
  Share,
  Copy,
  Check,
  AlertCircle,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useWorkout } from '../../contexts/WorkoutContext';
import './Plans.css';

function Plans() {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copiedPlanId, setCopiedPlanId] = useState(null);

  const { isAuthenticated, user } = useAuth();
  const { getPlans, deletePlan, duplicatePlan, updatePlan } = useWorkout();

  useEffect(() => {
    loadPlans();
  }, []);

  useEffect(() => {
    filterAndSortPlans();
  }, [plans, searchTerm, filterType, sortBy]);

  const loadPlans = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      const userPlans = await getPlans();
      setPlans(userPlans);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortPlans = () => {
    let filtered = [...plans];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(plan => 
        plan.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(plan => {
        switch (filterType) {
          case 'active':
            return plan.status === 'active';
          case 'completed':
            return plan.status === 'completed';
          case 'paused':
            return plan.status === 'paused';
          case 'strength':
            return plan.type === 'strength' || plan.tags?.includes('força');
          case 'cardio':
            return plan.type === 'cardio' || plan.tags?.includes('cardio');
          case 'flexibility':
            return plan.type === 'flexibility' || plan.tags?.includes('flexibilidade');
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return (a.title || '').localeCompare(b.title || '');
        case 'progress':
          return (b.progress || 0) - (a.progress || 0);
        default:
          return 0;
      }
    });

    setFilteredPlans(filtered);
  };

  const handleDeletePlan = async (planId) => {
    try {
      await deletePlan(planId);
      setPlans(plans.filter(plan => plan.id !== planId));
      setShowDeleteModal(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const handleDuplicatePlan = async (plan) => {
    try {
      const duplicatedPlan = await duplicatePlan(plan.id);
      setPlans([duplicatedPlan, ...plans]);
    } catch (error) {
      console.error('Error duplicating plan:', error);
    }
  };

  const handleTogglePlanStatus = async (plan) => {
    const newStatus = plan.status === 'active' ? 'paused' : 'active';
    try {
      const updatedPlan = await updatePlan(plan.id, { status: newStatus });
      setPlans(plans.map(p => p.id === plan.id ? updatedPlan : p));
    } catch (error) {
      console.error('Error updating plan status:', error);
    }
  };

  const handleCopyPlan = async (plan) => {
    const planText = formatPlanForCopy(plan);
    try {
      await navigator.clipboard.writeText(planText);
      setCopiedPlanId(plan.id);
      setTimeout(() => setCopiedPlanId(null), 2000);
    } catch (error) {
      console.error('Failed to copy plan:', error);
    }
  };

  const formatPlanForCopy = (plan) => {
    let text = `${plan.title}\n`;
    text += '='.repeat(plan.title.length) + '\n\n';
    
    if (plan.description) {
      text += `${plan.description}\n\n`;
    }

    if (plan.exercises && plan.exercises.length > 0) {
      text += 'EXERCÍCIOS:\n\n';
      plan.exercises.forEach((exercise, index) => {
        text += `${index + 1}. ${exercise.name}\n`;
        if (exercise.sets) text += `   Séries: ${exercise.sets}\n`;
        if (exercise.reps) text += `   Repetições: ${exercise.reps}\n`;
        if (exercise.rest) text += `   Descanso: ${exercise.rest}\n`;
        text += '\n';
      });
    }

    return text;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'var(--success)';
      case 'paused': return 'var(--warning)';
      case 'completed': return 'var(--primary)';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'paused': return 'Pausado';
      case 'completed': return 'Concluído';
      default: return 'Rascunho';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="plans-page">
        <div className="plans-container">
          <div className="auth-required glass-card">
            <div className="auth-required-content">
              <AlertCircle size={48} />
              <h2>Login Necessário</h2>
              <p>
                Você precisa estar logado para visualizar e gerenciar seus planos de treino.
                Faça login ou crie uma conta para começar.
              </p>
              <div className="auth-actions">
                <button className="btn btn-primary">
                  Fazer Login
                </button>
                <button className="btn btn-ghost">
                  Criar Conta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="plans-page">
      <div className="plans-container">
        {/* Header */}
        <div className="plans-header">
          <div className="header-content">
            <div className="header-info">
              <h1 className="page-title">Meus Planos</h1>
              <p className="page-subtitle">
                Gerencie seus planos de treino personalizados
              </p>
            </div>
            <button className="btn btn-primary create-plan-btn">
              <Plus size={20} />
              Novo Plano
            </button>
          </div>

          {/* Stats */}
          <div className="plans-stats">
            <div className="stat-card glass-card">
              <div className="stat-icon">
                <Target size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{plans.filter(p => p.status === 'active').length}</span>
                <span className="stat-label">Ativos</span>
              </div>
            </div>
            <div className="stat-card glass-card">
              <div className="stat-icon">
                <Award size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{plans.filter(p => p.status === 'completed').length}</span>
                <span className="stat-label">Concluídos</span>
              </div>
            </div>
            <div className="stat-card glass-card">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-value">{plans.length}</span>
                <span className="stat-label">Total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="plans-controls glass-card">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar planos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todos os tipos</option>
              <option value="active">Ativos</option>
              <option value="paused">Pausados</option>
              <option value="completed">Concluídos</option>
              <option value="strength">Força</option>
              <option value="cardio">Cardio</option>
              <option value="flexibility">Flexibilidade</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="recent">Mais recentes</option>
              <option value="oldest">Mais antigos</option>
              <option value="name">Nome A-Z</option>
              <option value="progress">Progresso</option>
            </select>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="plans-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Carregando seus planos...</p>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="empty-state glass-card">
              <BookOpen size={64} />
              <h3>
                {plans.length === 0 ? 'Nenhum plano criado ainda' : 'Nenhum plano encontrado'}
              </h3>
              <p>
                {plans.length === 0 
                  ? 'Comece criando seu primeiro plano de treino personalizado com nossa IA.'
                  : 'Tente ajustar os filtros ou termo de busca.'
                }
              </p>
              {plans.length === 0 && (
                <button className="btn btn-primary">
                  <Plus size={20} />
                  Criar Primeiro Plano
                </button>
              )}
            </div>
          ) : (
            <div className="plans-grid">
              <AnimatePresence>
                {filteredPlans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    className="plan-card glass-card"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="plan-header">
                      <div className="plan-status">
                        <div 
                          className="status-indicator"
                          style={{ backgroundColor: getStatusColor(plan.status) }}
                        ></div>
                        <span className="status-text">{getStatusText(plan.status)}</span>
                      </div>
                      <div className="plan-actions">
                        <button
                          className="action-btn"
                          onClick={() => handleTogglePlanStatus(plan)}
                          title={plan.status === 'active' ? 'Pausar' : 'Ativar'}
                        >
                          {plan.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <div className="dropdown">
                          <button className="action-btn dropdown-trigger">
                            <MoreVertical size={16} />
                          </button>
                          <div className="dropdown-menu">
                            <button onClick={() => handleCopyPlan(plan)}>
                              {copiedPlanId === plan.id ? <Check size={16} /> : <Copy size={16} />}
                              Copiar
                            </button>
                            <button onClick={() => handleDuplicatePlan(plan)}>
                              <Copy size={16} />
                              Duplicar
                            </button>
                            <button>
                              <Share size={16} />
                              Compartilhar
                            </button>
                            <button>
                              <Download size={16} />
                              Baixar
                            </button>
                            <hr />
                            <button>
                              <Edit3 size={16} />
                              Editar
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedPlan(plan);
                                setShowDeleteModal(true);
                              }}
                              className="danger"
                            >
                              <Trash2 size={16} />
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="plan-content">
                      <h3 className="plan-title">{plan.title || 'Plano sem título'}</h3>
                      <p className="plan-description">
                        {plan.description || 'Nenhuma descrição disponível'}
                      </p>

                      <div className="plan-meta">
                        <div className="meta-item">
                          <Calendar size={16} />
                          <span>{new Date(plan.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="meta-item">
                          <Dumbbell size={16} />
                          <span>{plan.exercises?.length || 0} exercícios</span>
                        </div>
                        <div className="meta-item">
                          <Clock size={16} />
                          <span>{plan.duration || 'N/A'}</span>
                        </div>
                      </div>

                      {plan.progress !== undefined && (
                        <div className="progress-section">
                          <div className="progress-header">
                            <span>Progresso</span>
                            <span>{Math.round(plan.progress)}%</span>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill"
                              style={{ width: `${plan.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {plan.tags && plan.tags.length > 0 && (
                        <div className="plan-tags">
                          {plan.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="tag">{tag}</span>
                          ))}
                          {plan.tags.length > 3 && (
                            <span className="tag more">+{plan.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="plan-footer">
                      <button className="btn btn-primary btn-sm">
                        Ver Detalhes
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
            >
              <motion.div
                className="modal glass-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>Confirmar Exclusão</h3>
                </div>
                <div className="modal-content">
                  <p>
                    Tem certeza que deseja excluir o plano "{selectedPlan?.title}"?
                    Esta ação não pode ser desfeita.
                  </p>
                </div>
                <div className="modal-actions">
                  <button 
                    className="btn btn-ghost"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeletePlan(selectedPlan.id)}
                  >
                    Excluir
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Plans;
