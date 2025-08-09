const axios = require('axios');

/**
 * AI Service for generating personalized workout plans
 * Currently uses Hugging Face API with free models
 * Can be easily migrated to OpenAI GPT or other paid APIs
 */
class AIService {
  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY;
    this.model = process.env.HUGGINGFACE_MODEL || 'microsoft/DialoGPT-medium';
    this.baseURL = 'https://api-inference.huggingface.co/models';
  }

  /**
   * Generate workout plan based on user input
   * @param {string} userMessage - Raw user message
   * @param {Object} userProfile - User profile data
   * @returns {Promise<Object>} Generated workout plan
   */
  async generateWorkoutPlan(userMessage, userProfile = {}) {
    try {
      // Create structured prompt for scientific workout generation
      const prompt = this.buildWorkoutPrompt(userMessage, userProfile);
      
      // Call Hugging Face API
      const response = await this.callHuggingFaceAPI(prompt);
      
      // Process and structure the response
      const workoutPlan = this.processWorkoutResponse(response, userProfile);
      
      return workoutPlan;
    } catch (error) {
      console.error('Error generating workout plan:', error);
      
      // Fallback to template-based plan if AI fails
      return this.generateFallbackPlan(userMessage, userProfile);
    }
  }

  /**
   * Build structured prompt for workout generation
   * Incorporates scientific principles and user context
   */
  buildWorkoutPrompt(userMessage, userProfile) {
    const scientificContext = `
    Based on scientific research on high-frequency, low-volume training:
    - Higher training frequency (4-6x/week per muscle group) is more effective than low frequency
    - Lower volume per session prevents excessive fatigue and allows for better recovery
    - Progressive overload should be applied gradually
    - Compound movements should form the foundation of training
    - Rest periods: 2-3 minutes for compound exercises, 1-2 minutes for isolation
    `;

    const userContext = `
    User Profile:
    - Age: ${userProfile.age || 'Not specified'}
    - Fitness Level: ${userProfile.fitness_level || 'Beginner'}
    - Available Days: ${userProfile.available_days || 3} days per week
    - Session Duration: ${userProfile.session_duration || 60} minutes
    - Goals: ${userProfile.goals?.join(', ') || 'General fitness'}
    - Equipment: ${userProfile.equipment?.join(', ') || 'Basic gym equipment'}
    `;

    const userRequest = `User Message: "${userMessage}"`;

    const instructions = `
    Create a detailed workout plan that follows these guidelines:
    1. Use high-frequency, low-volume principles
    2. Include specific exercises, sets, reps, and rest periods
    3. Provide progression guidelines
    4. Consider the user's constraints and goals
    5. Format as a structured weekly plan
    
    Generate a comprehensive workout plan:
    `;

    return `${scientificContext}\n${userContext}\n${userRequest}\n${instructions}`;
  }

  /**
   * Call Hugging Face API
   * @param {string} prompt - Structured prompt
   * @returns {Promise<string>} AI response
   */
  async callHuggingFaceAPI(prompt) {
    const response = await axios.post(
      `${this.baseURL}/${this.model}`,
      {
        inputs: prompt,
        parameters: {
          max_length: 1000,
          temperature: 0.7,
          do_sample: true,
          top_p: 0.9,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    if (response.data && response.data[0] && response.data[0].generated_text) {
      return response.data[0].generated_text;
    }
    
    throw new Error('Invalid response from Hugging Face API');
  }

  /**
   * Process AI response into structured workout plan
   */
  processWorkoutResponse(aiResponse, userProfile) {
    // Parse AI response and structure it
    const plan = {
      title: this.extractTitle(aiResponse) || 'Plano Personalizado de Treino',
      description: this.extractDescription(aiResponse),
      frequency: userProfile.available_days || 3,
      duration: userProfile.session_duration || 60,
      level: userProfile.fitness_level || 'Beginner',
      principles: [
        'Alta frequência',
        'Baixo volume por sessão',
        'Progressão gradual',
        'Foco em exercícios compostos'
      ],
      weeks: this.parseWorkoutWeeks(aiResponse, userProfile),
      tips: this.extractTips(aiResponse),
      created_at: new Date().toISOString()
    };

    return plan;
  }

  /**
   * Generate fallback plan when AI fails
   */
  generateFallbackPlan(userMessage, userProfile) {
    const days = userProfile.available_days || 3;
    const duration = userProfile.session_duration || 60;
    
    return {
      title: 'Plano de Treino Científico',
      description: 'Plano baseado em princípios de alta frequência e baixo volume, adaptado às suas necessidades.',
      frequency: days,
      duration: duration,
      level: userProfile.fitness_level || 'Beginner',
      principles: [
        'Alta frequência de treino',
        'Baixo volume por sessão',
        'Progressão gradual',
        'Exercícios compostos prioritários'
      ],
      weeks: this.generateTemplateWeeks(days, duration),
      tips: [
        'Mantenha a consistência no treino',
        'Foque na execução correta dos exercícios',
        'Aumente a carga progressivamente',
        'Descanse adequadamente entre as sessões'
      ],
      created_at: new Date().toISOString()
    };
  }

  /**
   * Generate template workout weeks
   */
  generateTemplateWeeks(days, duration) {
    const exercises = {
      upper: [
        { name: 'Supino reto', sets: 3, reps: '8-10', rest: '2-3min' },
        { name: 'Remada curvada', sets: 3, reps: '8-10', rest: '2-3min' },
        { name: 'Desenvolvimento militar', sets: 3, reps: '10-12', rest: '2min' },
        { name: 'Rosca direta', sets: 2, reps: '12-15', rest: '1-2min' },
        { name: 'Tríceps testa', sets: 2, reps: '12-15', rest: '1-2min' }
      ],
      lower: [
        { name: 'Agachamento', sets: 3, reps: '8-10', rest: '2-3min' },
        { name: 'Levantamento terra', sets: 3, reps: '6-8', rest: '3min' },
        { name: 'Leg press', sets: 3, reps: '12-15', rest: '2min' },
        { name: 'Panturrilha em pé', sets: 3, reps: '15-20', rest: '1min' }
      ],
      full: [
        { name: 'Agachamento', sets: 3, reps: '8-10', rest: '2-3min' },
        { name: 'Supino inclinado', sets: 3, reps: '8-10', rest: '2-3min' },
        { name: 'Remada sentada', sets: 3, reps: '10-12', rest: '2min' },
        { name: 'Desenvolvimento com halteres', sets: 2, reps: '12-15', rest: '2min' }
      ]
    };

    const weeks = [];
    for (let week = 1; week <= 4; week++) {
      const weekPlan = {
        week: week,
        days: []
      };

      for (let day = 1; day <= days; day++) {
        const exerciseType = days >= 4 ? (day % 2 === 1 ? 'upper' : 'lower') : 'full';
        weekPlan.days.push({
          day: day,
          name: days >= 4 ? (day % 2 === 1 ? 'Treino Superior' : 'Treino Inferior') : 'Treino Completo',
          exercises: exercises[exerciseType],
          duration: duration
        });
      }
      weeks.push(weekPlan);
    }

    return weeks;
  }

  // Helper methods for parsing AI responses
  extractTitle(response) {
    const titleMatch = response.match(/(?:título|title|plano):\s*([^\n]+)/i);
    return titleMatch ? titleMatch[1].trim() : null;
  }

  extractDescription(response) {
    const descMatch = response.match(/(?:descrição|description):\s*([^\n]+)/i);
    return descMatch ? descMatch[1].trim() : 'Plano de treino personalizado baseado em princípios científicos.';
  }

  extractTips(response) {
    const tips = [];
    const tipMatches = response.match(/(?:dica|tip|dicas):\s*([^\n]+)/gi);
    if (tipMatches) {
      tipMatches.forEach(match => {
        const tip = match.replace(/(?:dica|tip|dicas):\s*/i, '').trim();
        if (tip) tips.push(tip);
      });
    }
    return tips.length > 0 ? tips : [
      'Mantenha a consistência',
      'Foque na técnica correta',
      'Progrida gradualmente'
    ];
  }

  parseWorkoutWeeks(response, userProfile) {
    // This would contain more sophisticated parsing logic
    // For now, return template weeks
    return this.generateTemplateWeeks(
      userProfile.available_days || 3,
      userProfile.session_duration || 60
    );
  }
}

/**
 * MIGRATION GUIDE TO OPENAI GPT
 * 
 * To migrate from Hugging Face to OpenAI GPT:
 * 
 * 1. Install OpenAI SDK:
 *    npm install openai
 * 
 * 2. Replace the callHuggingFaceAPI method with:
 * 
 * async callOpenAI(prompt) {
 *   const { Configuration, OpenAIApi } = require('openai');
 *   const configuration = new Configuration({
 *     apiKey: process.env.OPENAI_API_KEY,
 *   });
 *   const openai = new OpenAIApi(configuration);
 * 
 *   const response = await openai.createCompletion({
 *     model: "text-davinci-003",
 *     prompt: prompt,
 *     max_tokens: 1000,
 *     temperature: 0.7,
 *   });
 * 
 *   return response.data.choices[0].text;
 * }
 * 
 * 3. Update environment variables:
 *    OPENAI_API_KEY=your-openai-api-key
 * 
 * 4. Replace the API call in generateWorkoutPlan method
 */

module.exports = new AIService();
