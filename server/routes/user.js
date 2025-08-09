const express = require('express');
const Joi = require('joi');
const { getDB } = require('../models/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const updateProfileSchema = Joi.object({
  age: Joi.number().integer().min(13).max(100).optional(),
  weight: Joi.number().min(30).max(300).optional(),
  height: Joi.number().min(100).max(250).optional(),
  fitness_level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced').optional(),
  goals: Joi.array().items(Joi.string()).optional(),
  medical_conditions: Joi.array().items(Joi.string()).optional(),
  available_days: Joi.number().integer().min(1).max(7).optional(),
  session_duration: Joi.number().integer().min(15).max(180).optional(),
  equipment: Joi.array().items(Joi.string()).optional()
});

/**
 * @route GET /api/user/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const db = getDB();
    
    const result = await db.query(
      'SELECT * FROM user_profiles WHERE user_id = $1',
      [req.user.id]
    );

    const profile = result.rows[0] || {};

    res.json({
      profile: {
        age: profile.age,
        weight: profile.weight,
        height: profile.height,
        fitness_level: profile.fitness_level,
        goals: profile.goals || [],
        medical_conditions: profile.medical_conditions || [],
        available_days: profile.available_days,
        session_duration: profile.session_duration,
        equipment: profile.equipment || [],
        created_at: profile.created_at,
        updated_at: profile.updated_at
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get user profile'
    });
  }
});

/**
 * @route PUT /api/user/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details[0].message
      });
    }

    const db = getDB();

    // Check if profile exists
    const existingProfile = await db.query(
      'SELECT id FROM user_profiles WHERE user_id = $1',
      [req.user.id]
    );

    if (existingProfile.rows.length === 0) {
      // Create profile if it doesn't exist
      await db.query(
        'INSERT INTO user_profiles (user_id) VALUES ($1)',
        [req.user.id]
      );
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    Object.keys(value).forEach(key => {
      if (value[key] !== undefined) {
        updateFields.push(`${key} = $${paramIndex++}`);
        updateValues.push(value[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'No valid fields to update'
      });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    updateValues.push(req.user.id);

    const updateQuery = `
      UPDATE user_profiles 
      SET ${updateFields.join(', ')}
      WHERE user_id = $${paramIndex}
      RETURNING *
    `;

    const result = await db.query(updateQuery, updateValues);
    const updatedProfile = result.rows[0];

    res.json({
      message: 'Profile updated successfully',
      profile: {
        age: updatedProfile.age,
        weight: updatedProfile.weight,
        height: updatedProfile.height,
        fitness_level: updatedProfile.fitness_level,
        goals: updatedProfile.goals || [],
        medical_conditions: updatedProfile.medical_conditions || [],
        available_days: updatedProfile.available_days,
        session_duration: updatedProfile.session_duration,
        equipment: updatedProfile.equipment || [],
        created_at: updatedProfile.created_at,
        updated_at: updatedProfile.updated_at
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update user profile'
    });
  }
});

/**
 * @route GET /api/user/stats
 * @desc Get user statistics
 * @access Private
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const db = getDB();

    // Get workout plans count
    const plansResult = await db.query(
      'SELECT COUNT(*) as total_plans, COUNT(CASE WHEN is_active = true THEN 1 END) as active_plans FROM workout_plans WHERE user_id = $1',
      [req.user.id]
    );

    // Get chat sessions count
    const sessionsResult = await db.query(
      'SELECT COUNT(*) as total_sessions FROM chat_sessions WHERE user_id = $1',
      [req.user.id]
    );

    // Get total messages count
    const messagesResult = await db.query(
      'SELECT COUNT(*) as total_messages FROM chat_messages WHERE user_id = $1',
      [req.user.id]
    );

    // Get recent activity
    const recentActivity = await db.query(`
      SELECT 
        'plan' as type,
        title as name,
        created_at
      FROM workout_plans 
      WHERE user_id = $1
      UNION ALL
      SELECT 
        'chat' as type,
        'Chat Session' as name,
        created_at
      FROM chat_sessions 
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 5
    `, [req.user.id]);

    const stats = plansResult.rows[0];
    const sessions = sessionsResult.rows[0];
    const messages = messagesResult.rows[0];

    res.json({
      stats: {
        totalPlans: parseInt(stats.total_plans),
        activePlans: parseInt(stats.active_plans),
        totalSessions: parseInt(sessions.total_sessions),
        totalMessages: parseInt(messages.total_messages),
        recentActivity: recentActivity.rows
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get user statistics'
    });
  }
});

module.exports = router;
