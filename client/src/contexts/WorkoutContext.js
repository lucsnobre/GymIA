import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const WorkoutContext = createContext();

// Action Types
const WORKOUT_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_PLANS: 'SET_PLANS',
  ADD_PLAN: 'ADD_PLAN',
  UPDATE_PLAN: 'UPDATE_PLAN',
  DELETE_PLAN: 'DELETE_PLAN',
  SET_ACTIVE_PLAN: 'SET_ACTIVE_PLAN',
  SET_STATISTICS: 'SET_STATISTICS',
  SET_CHAT_HISTORY: 'SET_CHAT_HISTORY',
  ADD_CHAT_MESSAGE: 'ADD_CHAT_MESSAGE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial State
const initialState = {
  plans: [],
  activePlan: null,
  statistics: {
    totalPlans: 0,
    activePlans: 0,
    completedPlans: 0,
    totalWorkouts: 0
  },
  chatHistory: [],
  loading: false,
  error: null
};

// Reducer
function workoutReducer(state, action) {
  switch (action.type) {
    case WORKOUT_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case WORKOUT_ACTIONS.SET_PLANS:
      return {
        ...state,
        plans: action.payload,
        loading: false
      };

    case WORKOUT_ACTIONS.ADD_PLAN:
      return {
        ...state,
        plans: [action.payload, ...state.plans],
        statistics: {
          ...state.statistics,
          totalPlans: state.statistics.totalPlans + 1,
          activePlans: action.payload.status === 'active' ? state.statistics.activePlans + 1 : state.statistics.activePlans
        }
      };

    case WORKOUT_ACTIONS.UPDATE_PLAN:
      return {
        ...state,
        plans: state.plans.map(plan => 
          plan.id === action.payload.id ? action.payload : plan
        ),
        activePlan: state.activePlan?.id === action.payload.id ? action.payload : state.activePlan
      };

    case WORKOUT_ACTIONS.DELETE_PLAN:
      const deletedPlan = state.plans.find(plan => plan.id === action.payload);
      return {
        ...state,
        plans: state.plans.filter(plan => plan.id !== action.payload),
        activePlan: state.activePlan?.id === action.payload ? null : state.activePlan,
        statistics: {
          ...state.statistics,
          totalPlans: state.statistics.totalPlans - 1,
          activePlans: deletedPlan?.status === 'active' ? state.statistics.activePlans - 1 : state.statistics.activePlans,
          completedPlans: deletedPlan?.status === 'completed' ? state.statistics.completedPlans - 1 : state.statistics.completedPlans
        }
      };

    case WORKOUT_ACTIONS.SET_ACTIVE_PLAN:
      return {
        ...state,
        activePlan: action.payload
      };

    case WORKOUT_ACTIONS.SET_STATISTICS:
      return {
        ...state,
        statistics: action.payload
      };

    case WORKOUT_ACTIONS.SET_CHAT_HISTORY:
      return {
        ...state,
        chatHistory: action.payload
      };

    case WORKOUT_ACTIONS.ADD_CHAT_MESSAGE:
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload]
      };

    case WORKOUT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case WORKOUT_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
}

// Context Provider
export function WorkoutProvider({ children }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState);
  const { isAuthenticated, user, api } = useAuth();

  // Load user plans on mount and auth change
  useEffect(() => {
    if (isAuthenticated) {
      loadPlans();
      loadStatistics();
      loadChatHistory();
    } else {
      // Reset state when logged out
      dispatch({ type: WORKOUT_ACTIONS.SET_PLANS, payload: [] });
      dispatch({ type: WORKOUT_ACTIONS.SET_STATISTICS, payload: initialState.statistics });
      dispatch({ type: WORKOUT_ACTIONS.SET_CHAT_HISTORY, payload: [] });
      dispatch({ type: WORKOUT_ACTIONS.SET_ACTIVE_PLAN, payload: null });
    }
  }, [isAuthenticated]);

  // API Functions
  const loadPlans = async () => {
    try {
      dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: true });
      const response = await api.get('/api/plans');
      dispatch({ type: WORKOUT_ACTIONS.SET_PLANS, payload: response.data.plans || [] });
    } catch (error) {
      console.error('Error loading plans:', error);
      dispatch({ type: WORKOUT_ACTIONS.SET_ERROR, payload: 'Erro ao carregar planos' });
      toast.error('Erro ao carregar planos');
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await api.get('/api/plans/statistics');
      dispatch({ type: WORKOUT_ACTIONS.SET_STATISTICS, payload: response.data });
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const loadChatHistory = async () => {
    try {
      const response = await api.get('/api/chat/history');
      dispatch({ type: WORKOUT_ACTIONS.SET_CHAT_HISTORY, payload: response.data.messages || [] });
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const createPlan = async (planData) => {
    try {
      dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: true });
      const response = await api.post('/api/plans', planData);
      dispatch({ type: WORKOUT_ACTIONS.ADD_PLAN, payload: response.data.plan });
      toast.success('Plano criado com sucesso!');
      return response.data.plan;
    } catch (error) {
      console.error('Error creating plan:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao criar plano';
      dispatch({ type: WORKOUT_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const updatePlan = async (planId, updates) => {
    try {
      dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: true });
      const response = await api.put(`/api/plans/${planId}`, updates);
      dispatch({ type: WORKOUT_ACTIONS.UPDATE_PLAN, payload: response.data.plan });
      toast.success('Plano atualizado com sucesso!');
      return response.data.plan;
    } catch (error) {
      console.error('Error updating plan:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar plano';
      dispatch({ type: WORKOUT_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const deletePlan = async (planId) => {
    try {
      dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: true });
      await api.delete(`/api/plans/${planId}`);
      dispatch({ type: WORKOUT_ACTIONS.DELETE_PLAN, payload: planId });
      toast.success('Plano excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting plan:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao excluir plano';
      dispatch({ type: WORKOUT_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const duplicatePlan = async (planId) => {
    try {
      dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: true });
      const response = await api.post(`/api/plans/${planId}/duplicate`);
      dispatch({ type: WORKOUT_ACTIONS.ADD_PLAN, payload: response.data.plan });
      toast.success('Plano duplicado com sucesso!');
      return response.data.plan;
    } catch (error) {
      console.error('Error duplicating plan:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao duplicar plano';
      dispatch({ type: WORKOUT_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const savePlanFromChat = async (workoutPlan) => {
    try {
      const planData = {
        name: workoutPlan.name || 'Plano Gerado pela IA',
        description: workoutPlan.description || 'Plano personalizado gerado pelo assistente de IA',
        exercises: workoutPlan.exercises || [],
        duration: workoutPlan.duration || '4 semanas',
        difficulty: workoutPlan.difficulty || 'intermediate',
        goals: workoutPlan.goals || [],
        status: 'active',
        source: 'ai_generated'
      };

      return await createPlan(planData);
    } catch (error) {
      console.error('Error saving plan from chat:', error);
      throw error;
    }
  };

  const sendChatMessage = async (message, sessionId = null) => {
    try {
      dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: true });
      
      // Add user message to chat history
      const userMessage = {
        id: Date.now(),
        message,
        message_type: 'user',
        timestamp: new Date().toISOString()
      };
      dispatch({ type: WORKOUT_ACTIONS.ADD_CHAT_MESSAGE, payload: userMessage });

      const response = await api.post('/api/chat/message', { message, sessionId });
      
      // Add AI response to chat history
      const aiMessage = {
        id: Date.now() + 1,
        message: 'Plano de treino personalizado',
        response: response.data.workoutPlan,
        message_type: 'assistant',
        timestamp: new Date().toISOString()
      };
      dispatch({ type: WORKOUT_ACTIONS.ADD_CHAT_MESSAGE, payload: aiMessage });

      return response.data;
    } catch (error) {
      console.error('Error sending chat message:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao enviar mensagem';
      dispatch({ type: WORKOUT_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const setActivePlan = (plan) => {
    dispatch({ type: WORKOUT_ACTIONS.SET_ACTIVE_PLAN, payload: plan });
  };

  const clearError = () => {
    dispatch({ type: WORKOUT_ACTIONS.CLEAR_ERROR });
  };

  // Local Storage Functions (for guest users)
  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(`gymia_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const loadFromLocalStorage = (key) => {
    try {
      const data = localStorage.getItem(`gymia_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  };

  const clearLocalStorage = () => {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('gymia_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  // Guest Functions
  const createGuestPlan = (planData) => {
    const guestPlan = {
      id: Date.now(),
      ...planData,
      created_at: new Date().toISOString(),
      isGuest: true
    };

    const existingPlans = loadFromLocalStorage('guest_plans') || [];
    const updatedPlans = [guestPlan, ...existingPlans];
    saveToLocalStorage('guest_plans', updatedPlans);
    
    dispatch({ type: WORKOUT_ACTIONS.ADD_PLAN, payload: guestPlan });
    toast.success('Plano salvo localmente!');
    return guestPlan;
  };

  const loadGuestPlans = () => {
    const guestPlans = loadFromLocalStorage('guest_plans') || [];
    dispatch({ type: WORKOUT_ACTIONS.SET_PLANS, payload: guestPlans });
  };

  // Context Value
  const contextValue = {
    // State
    ...state,
    
    // Actions
    loadPlans,
    createPlan,
    updatePlan,
    deletePlan,
    duplicatePlan,
    savePlanFromChat,
    sendChatMessage,
    setActivePlan,
    clearError,
    
    // Statistics
    loadStatistics,
    
    // Chat
    loadChatHistory,
    
    // Guest Functions
    createGuestPlan,
    loadGuestPlans,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage
  };

  return (
    <WorkoutContext.Provider value={contextValue}>
      {children}
    </WorkoutContext.Provider>
  );
}

// Custom Hook
export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}

export default WorkoutContext;
