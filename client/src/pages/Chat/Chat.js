import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Loader, 
  Save,
  Download,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  MessageCircle,
  Zap,
  Clock,
  Target
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useWorkout } from '../../contexts/WorkoutContext';
import './Chat.css';

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Olá! Sou sua IA especializada em treinos personalizados. Conte-me sobre seus objetivos, tempo disponível, equipamentos e qualquer limitação que você tenha. Vou criar um plano científico perfeito para você!',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);

  const { isAuthenticated, user } = useAuth();
  const { sendMessage, savePlan } = useWorkout();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await sendMessage(message.trim());
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.message || 'Plano gerado com sucesso!',
        workoutPlan: response.workoutPlan,
        canSave: response.canSave,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      if (response.workoutPlan) {
        setCurrentPlan(response.workoutPlan);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        isError: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlan = async (plan) => {
    if (!isAuthenticated) {
      // Show login prompt or redirect
      return;
    }

    try {
      await savePlan(plan);
      // Show success message
    } catch (error) {
      // Show error message
    }
  };

  const handleCopyMessage = async (messageId, content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const handleDownloadPlan = (plan) => {
    const planText = formatPlanForDownload(plan);
    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plano-treino-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatPlanForDownload = (plan) => {
    let text = `PLANO DE TREINO PERSONALIZADO - GymIA\n`;
    text += `Gerado em: ${new Date().toLocaleDateString('pt-BR')}\n\n`;
    
    if (plan.title) {
      text += `${plan.title}\n`;
      text += '='.repeat(plan.title.length) + '\n\n';
    }

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
        if (exercise.notes) text += `   Observações: ${exercise.notes}\n`;
        text += '\n';
      });
    }

    if (plan.notes) {
      text += `OBSERVAÇÕES GERAIS:\n${plan.notes}\n\n`;
    }

    text += 'Gerado por GymIA - Treinos Personalizados com IA\n';
    return text;
  };

  const suggestions = [
    {
      icon: Target,
      text: 'Quero ganhar massa muscular, treino 4x por semana',
      category: 'Objetivo'
    },
    {
      icon: Clock,
      text: 'Tenho apenas 30 minutos por dia para treinar',
      category: 'Tempo'
    },
    {
      icon: Zap,
      text: 'Treino em casa, só tenho halteres',
      category: 'Equipamento'
    },
    {
      icon: Sparkles,
      text: 'Sou iniciante, nunca treinei antes',
      category: 'Nível'
    }
  ];

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Chat Header */}
        <div className="chat-header glass-card">
          <div className="header-content">
            <div className="header-info">
              <div className="ai-avatar">
                <Bot size={24} />
              </div>
              <div>
                <h1 className="chat-title">GymIA Assistant</h1>
                <p className="chat-subtitle">
                  IA especializada em treinos científicos
                </p>
              </div>
            </div>
            <div className="header-status">
              <div className="status-indicator online">
                <div className="status-dot"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="chat-messages">
          <div className="messages-container">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`message ${msg.type}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="message-avatar">
                    {msg.type === 'bot' ? (
                      <Bot size={20} />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-sender">
                        {msg.type === 'bot' ? 'GymIA' : user?.name || 'Você'}
                      </span>
                      <span className="message-time">
                        {msg.timestamp.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    <div className={`message-text ${msg.isError ? 'error' : ''}`}>
                      {msg.isError && <AlertCircle size={16} />}
                      {msg.content}
                    </div>

                    {/* Workout Plan Display */}
                    {msg.workoutPlan && (
                      <div className="workout-plan-card">
                        <div className="plan-header">
                          <h3>{msg.workoutPlan.title || 'Seu Plano Personalizado'}</h3>
                          <div className="plan-actions">
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => handleCopyMessage(msg.id, JSON.stringify(msg.workoutPlan, null, 2))}
                              title="Copiar plano"
                            >
                              {copiedMessageId === msg.id ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => handleDownloadPlan(msg.workoutPlan)}
                              title="Baixar plano"
                            >
                              <Download size={16} />
                            </button>
                            {msg.canSave && (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleSavePlan(msg.workoutPlan)}
                                title="Salvar plano"
                              >
                                <Save size={16} />
                                Salvar
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {msg.workoutPlan.description && (
                          <p className="plan-description">{msg.workoutPlan.description}</p>
                        )}

                        {msg.workoutPlan.exercises && (
                          <div className="exercises-list">
                            {msg.workoutPlan.exercises.map((exercise, index) => (
                              <div key={index} className="exercise-item">
                                <div className="exercise-number">{index + 1}</div>
                                <div className="exercise-details">
                                  <h4 className="exercise-name">{exercise.name}</h4>
                                  <div className="exercise-specs">
                                    {exercise.sets && <span>{exercise.sets} séries</span>}
                                    {exercise.reps && <span>{exercise.reps} reps</span>}
                                    {exercise.rest && <span>{exercise.rest} descanso</span>}
                                  </div>
                                  {exercise.notes && (
                                    <p className="exercise-notes">{exercise.notes}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {msg.workoutPlan.notes && (
                          <div className="plan-notes">
                            <h4>Observações:</h4>
                            <p>{msg.workoutPlan.notes}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="message-actions">
                      <button
                        className="action-btn"
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        title="Copiar mensagem"
                      >
                        {copiedMessageId === msg.id ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading Message */}
            {isLoading && (
              <motion.div
                className="message bot loading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="message-avatar">
                  <Bot size={20} />
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-sender">GymIA</span>
                  </div>
                  <div className="message-text">
                    <Loader size={16} className="spinner" />
                    Analisando suas necessidades e criando seu plano personalizado...
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggestions (show when no messages or few messages) */}
        {messages.length <= 1 && (
          <div className="chat-suggestions">
            <h3>Sugestões para começar:</h3>
            <div className="suggestions-grid">
              {suggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={index}
                    className="suggestion-card glass-card"
                    onClick={() => setMessage(suggestion.text)}
                  >
                    <div className="suggestion-icon">
                      <Icon size={20} />
                    </div>
                    <div className="suggestion-content">
                      <span className="suggestion-category">{suggestion.category}</span>
                      <span className="suggestion-text">{suggestion.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Chat Input */}
        <div className="chat-input-container">
          <form className="chat-input glass-card" onSubmit={handleSendMessage}>
            <div className="input-wrapper">
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Descreva seus objetivos, tempo disponível, equipamentos..."
                className="message-input"
                rows="1"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <button
                type="submit"
                className="send-button"
                disabled={!message.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader size={20} className="spinner" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
            <div className="input-hint">
              <MessageCircle size={14} />
              <span>
                Seja específico sobre seus objetivos, limitações e preferências. 
                Pressione Enter para enviar, Shift+Enter para nova linha.
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
