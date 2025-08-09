import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

// Workout Context
const WorkoutContext = createContext();

// Workout Actions
const WORKOUT_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_CURRENT_PLAN: 'SET_CURRENT_PLAN',
  SET_PLANS: 'SET_PLANS',
  ADD_PLAN: 'ADD_PLAN',
  UPDATE_PLAN: 'UPDATE_PLAN',
  DELETE_PLAN: 'DELETE_PLAN',
  SET_CHAT_SESSIONS: 'SET_CHAT_SESSIONS',
  ADD_CHAT_SESSION: 'ADD_CHAT_SESSION',
  SET_CURRENT_SESSION: 'SET_CURRENT_SESSION',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial State
const initialState = {
  currentPlan: null,
  plans: [],
  chatSessions: [],
  currentSession: null,
  messages: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  }
};

// Workout Reducer
function workoutReducer(state, action) {
  switch (action.type) {
    case WORKOUT_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case WORKOUT_ACTIONS.SET_CURRENT_PLAN:
      return {
        ...state,
        currentPlan: action.payload,
        loading: false
      };

    case WORKOUT_ACTIONS.SET_PLANS:
      return {
        ...state,
        plans: action.payload.plans,
        pagination: action.payload.pagination,
        loading: false
      };

    case WORKOUT_ACTIONS.ADD_PLAN:
      return {
        ...state,
        plans: [action.payload, ...state.plans],
        loading: false
      };

    case WORKOUT_ACTIONS.UPDATE_PLAN:
      return {
        ...state,
        plans: state.plans.map(plan =>
          plan.id === action.payload.id ? action.payload : plan
        ),
        currentPlan: state.currentPlan?.id === action.payload.id ? action.payload : state.currentPlan,
        loading: false
      };

    case WORKOUT_ACTIONS.DELETE_PLAN:
      return {
        ...state,
        plans: state.plans.filter(plan => plan.id !== action.payload),
        currentPlan: state.currentPlan?.id === action.payload ? null : state.currentPlan,
        loading: false
      };

    case WORKOUT_ACTIONS.SET_CHAT_SESSIONS:
      return {
        ...state,
        chatSessions: action.payload,
        loading: false
      };

    case WORKOUT_ACTIONS.ADD_CHAT_SESSION:
      return {
        ...state,
        chatSessions: [action.payload, ...state.chatSessions],
        currentSession: action.payload
      };

    case WORKOUT_ACTIONS.SET_CURRENT_SESSION:
      return {
        ...state,
        currentSession: action.payload.session,
        messages: action.payload.messages || []
      };

    case WORKOUT_ACTIONS.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload]
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

// Workout Provider Component
export function WorkoutProvider({ children }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Generate workout plan with AI
  const generateWorkoutPlan = async (message, profile = {}) => {
    dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const endpoint = isAuthenticated ? '/api/chat/message' : '/api/chat/quick-plan';
      const payload = isAuthenticated 
        ? { message, sessionId: state.currentSession?.id }
        : { message, profile };

      const response = await axios.post(endpoint, payload);
      
      // Add message to current session if authenticated
      if (isAuthenticated && response.data.sessionId) {
        dispatch({
          type: WORKOUT_ACTIONS.ADD_MESSAGE,
          payload: {
            message,
            response: response.data.workoutPlan,
            type: 'user',
            timestamp: new Date().toISOString()
          }
        });
      }

      dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: false });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao gerar plano de treino';
      dispatch({ type: WORKOUT_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Save workout plan
  const savePlan = async (planData) => {
    dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await axios.post('/api/plans', planData);
      
      dispatch({
        type: WORKOUT_ACTIONS.ADD_PLAN,
        payload: response.data.plan
      });
      
      toast.success('Plano salvo com sucesso!');
      return { success: true, data: response.data.plan };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao salvar plano';
      dispatch({ type: WORKOUT_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Load user's workout plans
  const loadPlans = async (page = 1, limit = 10, active = undefined) => {
    dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const params = new URLSearchParams({ page, limit });
      if (active !== undefined) params.append('active', active);
      
      const response = await axios.get(`/api/plans?${params}`);
      
      dispatch({
        type: WORKOUT_ACTIONS.SET_PLANS,
        payload: response.data
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao carregar planos';
      dispatch({ type: WORKOUT_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Load specific workout plan
  const loadPlan = async (planId) => {
    dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await axios.get(`/api/plans/${planId}`);
      
      dispatch({
        type: WORKOUT_ACTIONS.SET_CURRENT_PLAN,
        payload: response.data.plan
      });
      
      return { success: true, data: response.data.plan };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao carregar plano';
      dispatch({ type: WORKOUT_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Update workout plan
  const updatePlan = async (planId, updateData) => {
    dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await axios.put(`/api/plans/${planId}`, updateData);
      
      dispatch({
        type: WORKOUT_ACTIONS.UPDATE_PLAN,
        payload: response.data.plan
      });
      
      toast.success('Plano atualizado com sucesso!');
      return { success: true, data: response.data.plan };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar plano';
      dispatch({ type: WORKOUT_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Delete workout plan
  const deletePlan = async (planId) => {
    dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: true });
    
    try {
      await axios.delete(`/api/plans/${planId}`);
      
      dispatch({
        type: WORKOUT_ACTIONS.DELETE_PLAN,
        payload: planId
      });
      
      toast.success('Plano excluído com sucesso!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao excluir plano';
      dispatch({ type: WORKOUT_ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Load chat sessions
  const loadChatSessions = async () => {
    if (!isAuthenticated) return;
    
    dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await axios.get('/api/chat/sessions');
      
      dispatch({
        type: WORKOUT_ACTIONS.SET_CHAT_SESSIONS,
        payload: response.data.sessions
      });
      
      return { success: true, data: response.data.sessions };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao carregar conversas';
      dispatch({ type: WORKOUT_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Load chat session messages
  const loadChatMessages = async (sessionId) => {
    dispatch({ type: WORKOUT_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const response = await axios.get(`/api/chat/sessions/${sessionId}/messages`);
      
      dispatch({
        type: WORKOUT_ACTIONS.SET_CURRENT_SESSION,
        payload: {
          session: { id: sessionId },
          messages: response.data.messages
        }
      });
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao carregar mensagens';
      dispatch({ type: WORKOUT_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Delete chat session
  const deleteChatSession = async (sessionId) => {
    try {
      await axios.delete(`/api/chat/sessions/${sessionId}`);
      
      dispatch({
        type: WORKOUT_ACTIONS.SET_CHAT_SESSIONS,
        payload: state.chatSessions.filter(session => session.id !== sessionId)
      });
      
      if (state.currentSession?.id === sessionId) {
        dispatch({
          type: WORKOUT_ACTIONS.SET_CURRENT_SESSION,
          payload: { session: null, messages: [] }
        });
      }
      
      toast.success('Conversa excluída com sucesso!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro ao excluir conversa';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Save plan to localStorage for guest users
  const saveToLocalStorage = (planData) => {
    try {
      const existingPlans = JSON.parse(localStorage.getItem('gymia_guest_plans') || '[]');
      const newPlan = {
        id: Date.now(),
        ...planData,
        createdAt: new Date().toISOString()
      };
      
      const updatedPlans = [newPlan, ...existingPlans.slice(0, 4)]; // Keep only 5 plans
      localStorage.setItem('gymia_guest_plans', JSON.stringify(updatedPlans));
      
      toast.success('Plano salvo localmente! Faça login para salvar permanentemente.');
      return { success: true, data: newPlan };
    } catch (error) {
      toast.error('Erro ao salvar plano localmente');
      return { success: false, error: 'Storage error' };
    }
  };

  // Load plans from localStorage for guest users
  const loadFromLocalStorage = () => {
    try {
      const plans = JSON.parse(localStorage.getItem('gymia_guest_plans') || '[]');
      return { success: true, data: plans };
    } catch (error) {
      return { success: false, data: [] };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: WORKOUT_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    generateWorkoutPlan,
    savePlan,
    loadPlans,
    loadPlan,
    updatePlan,
    deletePlan,
    loadChatSessions,
    loadChatMessages,
    deleteChatSession,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearError
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
}

// Custom hook to use workout context
export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}

export default WorkoutContext;
