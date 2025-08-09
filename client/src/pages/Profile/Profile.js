import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Edit3, 
  Save, 
  X, 
  Camera,
  Shield,
  Bell,
  Globe,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload,
  Activity,
  Target,
  TrendingUp,
  Award,
  Clock,
  Dumbbell,
  Heart,
  Zap,
  Settings,
  Lock,
  AlertCircle,
  Check
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useWorkout } from '../../contexts/WorkoutContext';
import './Profile.css';

function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    location: '',
    bio: '',
    avatar: null,
    preferences: {
      workoutGoals: [],
      fitnessLevel: '',
      availableEquipment: [],
      workoutDuration: '',
      workoutFrequency: '',
      preferredTime: ''
    },
    privacy: {
      profileVisibility: 'private',
      shareProgress: false,
      allowMessages: true
    },
    notifications: {
      workoutReminders: true,
      progressUpdates: true,
      newFeatures: true,
      emailNotifications: true
    }
  });
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalTime: 0,
    currentStreak: 0,
    completedPlans: 0,
    averageRating: 0
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');

  const { user, updateProfile, deleteAccount, logout } = useAuth();
  const { getUserStats } = useWorkout();

  useEffect(() => {
    loadProfileData();
    loadUserStats();
  }, []);

  const loadProfileData = async () => {
    if (!user) return;
    
    try {
      // Load user profile data
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        birthDate: user.birthDate || '',
        location: user.location || '',
        bio: user.bio || '',
        avatar: user.avatar || null,
        preferences: user.preferences || prev.preferences,
        privacy: user.privacy || prev.privacy,
        notifications: user.notifications || prev.notifications
      }));
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const userStats = await getUserStats();
      setStats(userStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaveStatus('saving');
      await updateProfile(profileData);
      setSaveStatus('saved');
      setIsEditing(false);
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    loadProfileData(); // Reset to original data
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      logout();
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleExportData = () => {
    const dataToExport = {
      profile: profileData,
      stats: stats,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gymia-profile-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'preferences', label: 'Preferências', icon: Settings },
    { id: 'privacy', label: 'Privacidade', icon: Shield },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'account', label: 'Conta', icon: Lock }
  ];

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Carregando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header glass-card">
          <div className="header-content">
            <div className="avatar-section">
              <div className="avatar-container">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Profile" className="avatar-image" />
                ) : (
                  <div className="avatar-placeholder">
                    <User size={48} />
                  </div>
                )}
                {isEditing && (
                  <label className="avatar-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      hidden
                    />
                    <Camera size={16} />
                  </label>
                )}
              </div>
            </div>
            
            <div className="profile-info">
              <h1 className="profile-name">{profileData.name || 'Usuário'}</h1>
              <p className="profile-email">{profileData.email}</p>
              {profileData.bio && (
                <p className="profile-bio">{profileData.bio}</p>
              )}
              <div className="profile-meta">
                {profileData.location && (
                  <div className="meta-item">
                    <MapPin size={16} />
                    <span>{profileData.location}</span>
                  </div>
                )}
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>Membro desde {new Date(user?.createdAt || Date.now()).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              {!isEditing ? (
                <button 
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 size={20} />
                  Editar Perfil
                </button>
              ) : (
                <div className="edit-actions">
                  <button 
                    className="btn btn-ghost"
                    onClick={handleCancelEdit}
                  >
                    <X size={20} />
                    Cancelar
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={handleSaveProfile}
                    disabled={saveStatus === 'saving'}
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <div className="spinner" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        Salvar
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Save Status */}
          <AnimatePresence>
            {saveStatus && (
              <motion.div
                className={`save-status ${saveStatus}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {saveStatus === 'saved' && (
                  <>
                    <Check size={16} />
                    Perfil salvo com sucesso!
                  </>
                )}
                {saveStatus === 'error' && (
                  <>
                    <AlertCircle size={16} />
                    Erro ao salvar perfil
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats Section */}
        <div className="profile-stats">
          <div className="stat-card glass-card">
            <div className="stat-icon">
              <Activity size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalWorkouts}</span>
              <span className="stat-label">Treinos</span>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{formatDuration(stats.totalTime)}</span>
              <span className="stat-label">Tempo Total</span>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon">
              <Zap size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.currentStreak}</span>
              <span className="stat-label">Sequência</span>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon">
              <Award size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.completedPlans}</span>
              <span className="stat-label">Planos Concluídos</span>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="profile-tabs glass-card">
          <div className="tabs-nav">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="profile-content glass-card">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                className="tab-content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2>Informações Pessoais</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Nome Completo</label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={20} />
                      <input
                        type="text"
                        className="form-input"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Seu nome completo"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <div className="input-wrapper">
                      <Mail className="input-icon" size={20} />
                      <input
                        type="email"
                        className="form-input"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Telefone</label>
                    <div className="input-wrapper">
                      <Phone className="input-icon" size={20} />
                      <input
                        type="tel"
                        className="form-input"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Data de Nascimento</label>
                    <div className="input-wrapper">
                      <Calendar className="input-icon" size={20} />
                      <input
                        type="date"
                        className="form-input"
                        value={profileData.birthDate}
                        onChange={(e) => setProfileData(prev => ({ ...prev, birthDate: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Localização</label>
                    <div className="input-wrapper">
                      <MapPin className="input-icon" size={20} />
                      <input
                        type="text"
                        className="form-input"
                        value={profileData.location}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Cidade, Estado"
                      />
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Bio</label>
                    <textarea
                      className="form-textarea"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Conte um pouco sobre você e seus objetivos..."
                      rows="4"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div
                key="preferences"
                className="tab-content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2>Preferências de Treino</h2>
                <div className="preferences-grid">
                  <div className="preference-group">
                    <h3>Objetivos</h3>
                    <div className="checkbox-group">
                      {['Perda de peso', 'Ganho de massa', 'Resistência', 'Força', 'Flexibilidade'].map(goal => (
                        <label key={goal} className="checkbox-wrapper">
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={profileData.preferences.workoutGoals.includes(goal)}
                            onChange={(e) => {
                              const goals = e.target.checked
                                ? [...profileData.preferences.workoutGoals, goal]
                                : profileData.preferences.workoutGoals.filter(g => g !== goal);
                              setProfileData(prev => ({
                                ...prev,
                                preferences: { ...prev.preferences, workoutGoals: goals }
                              }));
                            }}
                            disabled={!isEditing}
                          />
                          <span className="checkbox-label">{goal}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="preference-group">
                    <h3>Nível de Condicionamento</h3>
                    <select
                      className="form-select"
                      value={profileData.preferences.fitnessLevel}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, fitnessLevel: e.target.value }
                      }))}
                      disabled={!isEditing}
                    >
                      <option value="">Selecione...</option>
                      <option value="beginner">Iniciante</option>
                      <option value="intermediate">Intermediário</option>
                      <option value="advanced">Avançado</option>
                    </select>
                  </div>

                  <div className="preference-group">
                    <h3>Duração Preferida</h3>
                    <select
                      className="form-select"
                      value={profileData.preferences.workoutDuration}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, workoutDuration: e.target.value }
                      }))}
                      disabled={!isEditing}
                    >
                      <option value="">Selecione...</option>
                      <option value="15-30">15-30 minutos</option>
                      <option value="30-45">30-45 minutos</option>
                      <option value="45-60">45-60 minutos</option>
                      <option value="60+">Mais de 60 minutos</option>
                    </select>
                  </div>

                  <div className="preference-group">
                    <h3>Frequência Semanal</h3>
                    <select
                      className="form-select"
                      value={profileData.preferences.workoutFrequency}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, workoutFrequency: e.target.value }
                      }))}
                      disabled={!isEditing}
                    >
                      <option value="">Selecione...</option>
                      <option value="1-2">1-2 vezes</option>
                      <option value="3-4">3-4 vezes</option>
                      <option value="5-6">5-6 vezes</option>
                      <option value="daily">Todos os dias</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'privacy' && (
              <motion.div
                key="privacy"
                className="tab-content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2>Configurações de Privacidade</h2>
                <div className="privacy-settings">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Visibilidade do Perfil</h3>
                      <p>Controle quem pode ver seu perfil e informações</p>
                    </div>
                    <select
                      className="form-select"
                      value={profileData.privacy.profileVisibility}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, profileVisibility: e.target.value }
                      }))}
                      disabled={!isEditing}
                    >
                      <option value="private">Privado</option>
                      <option value="friends">Apenas amigos</option>
                      <option value="public">Público</option>
                    </select>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Compartilhar Progresso</h3>
                      <p>Permitir que outros vejam seu progresso nos treinos</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={profileData.privacy.shareProgress}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, shareProgress: e.target.checked }
                        }))}
                        disabled={!isEditing}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Permitir Mensagens</h3>
                      <p>Receber mensagens de outros usuários</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={profileData.privacy.allowMessages}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, allowMessages: e.target.checked }
                        }))}
                        disabled={!isEditing}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                className="tab-content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2>Notificações</h2>
                <div className="notification-settings">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Lembretes de Treino</h3>
                      <p>Receber notificações para não perder seus treinos</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={profileData.notifications.workoutReminders}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, workoutReminders: e.target.checked }
                        }))}
                        disabled={!isEditing}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Atualizações de Progresso</h3>
                      <p>Notificações sobre seu progresso e conquistas</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={profileData.notifications.progressUpdates}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, progressUpdates: e.target.checked }
                        }))}
                        disabled={!isEditing}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Novos Recursos</h3>
                      <p>Ser notificado sobre novas funcionalidades</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={profileData.notifications.newFeatures}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, newFeatures: e.target.checked }
                        }))}
                        disabled={!isEditing}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h3>Notificações por Email</h3>
                      <p>Receber notificações também por email</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={profileData.notifications.emailNotifications}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, emailNotifications: e.target.checked }
                        }))}
                        disabled={!isEditing}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'account' && (
              <motion.div
                key="account"
                className="tab-content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2>Configurações da Conta</h2>
                <div className="account-settings">
                  <div className="setting-section">
                    <h3>Dados da Conta</h3>
                    <div className="account-actions">
                      <button className="btn btn-ghost" onClick={handleExportData}>
                        <Download size={20} />
                        Exportar Dados
                      </button>
                      <button className="btn btn-ghost">
                        <Upload size={20} />
                        Importar Dados
                      </button>
                    </div>
                  </div>

                  <div className="setting-section danger-zone">
                    <h3>Zona de Perigo</h3>
                    <p>Ações irreversíveis que afetam permanentemente sua conta.</p>
                    <div className="danger-actions">
                      <button 
                        className="btn btn-danger"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        <Trash2 size={20} />
                        Excluir Conta
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Delete Account Modal */}
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
                  <h3>Excluir Conta</h3>
                </div>
                <div className="modal-content">
                  <div className="warning-message">
                    <AlertCircle size={24} />
                    <div>
                      <h4>Esta ação é irreversível!</h4>
                      <p>
                        Todos os seus dados, incluindo planos de treino, progresso e 
                        configurações serão permanentemente excluídos.
                      </p>
                    </div>
                  </div>
                  <p>
                    Digite <strong>EXCLUIR</strong> para confirmar:
                  </p>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Digite EXCLUIR"
                  />
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
                    onClick={handleDeleteAccount}
                  >
                    Excluir Conta
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

export default Profile;
