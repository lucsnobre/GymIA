const express = require('express');
const Joi = require('joi');
const { getDB } = require('../models/database');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const aiService = require('../services/aiService');

const router = express.Router();

// Validation schemas
const chatMessageSchema = Joi.object({
  message: Joi.string().min(1).max(2000).required(),
  sessionId: Joi.number().integer().optional()
});

/**
 * @route POST /api/chat/message
 * @desc Send message to AI and get workout plan
 * @access Public (with optional auth)
 */
router.post('/message', optionalAuth, async (req, res) => {
  try {
    // Validate input
    const { error, value } = chatMessageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details[0].message
      });
    }

    const { message, sessionId } = value;
    const db = getDB();
    let currentSessionId = sessionId;

    // Get user profile if authenticated
    let userProfile = {};
    if (req.user) {
      const profileResult = await db.query(
        'SELECT * FROM user_profiles WHERE user_id = $1',
        [req.user.id]
      );
      userProfile = profileResult.rows[0] || {};
    }

    // Create or get chat session
    if (req.user && !currentSessionId) {
      const sessionResult = await db.query(
        'INSERT INTO chat_sessions (user_id, session_data) VALUES ($1, $2) RETURNING id',
        [req.user.id, JSON.stringify({ created_at: new Date().toISOString() })]
      );
      currentSessionId = sessionResult.rows[0].id;
    }

    // Save user message if authenticated
    if (req.user && currentSessionId) {
      await db.query(
        'INSERT INTO chat_messages (session_id, user_id, message, message_type) VALUES ($1, $2, $3, $4)',
        [currentSessionId, req.user.id, message, 'user']
      );
    }

    // Generate AI response
    console.log('🤖 Generating workout plan for message:', message.substring(0, 100) + '...');
    const workoutPlan = await aiService.generateWorkoutPlan(message, userProfile);

    // Save AI response if authenticated
    if (req.user && currentSessionId) {
      await db.query(
        'INSERT INTO chat_messages (session_id, user_id, message, response, message_type) VALUES ($1, $2, $3, $4, $5)',
        [currentSessionId, req.user.id, message, JSON.stringify(workoutPlan), 'assistant']
      );
    }

    res.json({
      message: 'Workout plan generated successfully',
      sessionId: currentSessionId,
      workoutPlan,
      canSave: !!req.user
    });
  } catch (error) {
    console.error('Chat message error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process chat message'
    });
  }
});

/**
 * @route GET /api/chat/sessions
 * @desc Get user's chat sessions
 * @access Private
 */
router.get('/sessions', authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    
    const result = await db.query(`
      SELECT 
        cs.id,
        cs.session_data,
        cs.created_at,
        COUNT(cm.id) as message_count,
        MAX(cm.created_at) as last_message_at
      FROM chat_sessions cs
      LEFT JOIN chat_messages cm ON cs.id = cm.session_id
      WHERE cs.user_id = $1
      GROUP BY cs.id, cs.session_data, cs.created_at
      ORDER BY cs.created_at DESC
      LIMIT 20
    `, [req.user.id]);

    res.json({
      sessions: result.rows
    });
  } catch (error) {
    console.error('Get chat sessions error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get chat sessions'
    });
  }
});

/**
 * @route GET /api/chat/sessions/:sessionId/messages
 * @desc Get messages from a specific chat session
 * @access Private
 */
router.get('/sessions/:sessionId/messages', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const db = getDB();

    // Verify session belongs to user
    const sessionCheck = await db.query(
      'SELECT id FROM chat_sessions WHERE id = $1 AND user_id = $2',
      [sessionId, req.user.id]
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Chat session not found'
      });
    }

    // Get messages
    const result = await db.query(`
      SELECT 
        id,
        message,
        response,
        message_type,
        created_at
      FROM chat_messages
      WHERE session_id = $1
      ORDER BY created_at ASC
    `, [sessionId]);

    res.json({
      sessionId: parseInt(sessionId),
      messages: result.rows
    });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get chat messages'
    });
  }
});

/**
 * @route DELETE /api/chat/sessions/:sessionId
 * @desc Delete a chat session
 * @access Private
 */
router.delete('/sessions/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const db = getDB();

    // Verify session belongs to user and delete
    const result = await db.query(
      'DELETE FROM chat_sessions WHERE id = $1 AND user_id = $2 RETURNING id',
      [sessionId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Chat session not found'
      });
    }

    res.json({
      message: 'Chat session deleted successfully'
    });
  } catch (error) {
    console.error('Delete chat session error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete chat session'
    });
  }
});

/**
 * @route POST /api/chat/quick-plan
 * @desc Generate quick workout plan without saving (for demo/guest users)
 * @access Public
 */
router.post('/quick-plan', async (req, res) => {
  try {
    const { error, value } = Joi.object({
      message: Joi.string().min(1).max(2000).required(),
      profile: Joi.object({
        age: Joi.number().integer().min(13).max(100).optional(),
        fitness_level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced').optional(),
        available_days: Joi.number().integer().min(1).max(7).optional(),
        session_duration: Joi.number().integer().min(15).max(180).optional(),
        goals: Joi.array().items(Joi.string()).optional(),
        equipment: Joi.array().items(Joi.string()).optional()
      }).optional()
    }).validate(req.body);

    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details[0].message
      });
    }

    const { message, profile = {} } = value;

    console.log('🚀 Generating quick workout plan for guest user');
    const workoutPlan = await aiService.generateWorkoutPlan(message, profile);

    res.json({
      message: 'Quick workout plan generated successfully',
      workoutPlan,
      note: 'Register to save and track your workout plans!'
    });
  } catch (error) {
    console.error('Quick plan error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate quick workout plan'
    });
  }
});

module.exports = router;
