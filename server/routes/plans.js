const express = require('express');
const Joi = require('joi');
const { getDB } = require('../models/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const savePlanSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(1000).optional(),
  planData: Joi.object().required()
});

const updatePlanSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  description: Joi.string().max(1000).optional(),
  planData: Joi.object().optional(),
  isActive: Joi.boolean().optional()
});

/**
 * @route POST /api/plans
 * @desc Save a workout plan
 * @access Private
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const { error, value } = savePlanSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details[0].message
      });
    }

    const { title, description, planData } = value;
    const db = getDB();

    // Save workout plan
    const result = await db.query(
      'INSERT INTO workout_plans (user_id, title, description, plan_data) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, title, description, JSON.stringify(planData)]
    );

    const savedPlan = result.rows[0];

    res.status(201).json({
      message: 'Workout plan saved successfully',
      plan: {
        id: savedPlan.id,
        title: savedPlan.title,
        description: savedPlan.description,
        planData: savedPlan.plan_data,
        isActive: savedPlan.is_active,
        createdAt: savedPlan.created_at,
        updatedAt: savedPlan.updated_at
      }
    });
  } catch (error) {
    console.error('Save plan error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to save workout plan'
    });
  }
});

/**
 * @route GET /api/plans
 * @desc Get user's workout plans
 * @access Private
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, active } = req.query;
    const offset = (page - 1) * limit;
    const db = getDB();

    let query = `
      SELECT 
        id,
        title,
        description,
        plan_data,
        is_active,
        created_at,
        updated_at
      FROM workout_plans 
      WHERE user_id = $1
    `;
    
    const params = [req.user.id];

    // Filter by active status if provided
    if (active !== undefined) {
      query += ' AND is_active = $2';
      params.push(active === 'true');
    }

    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(parseInt(limit), offset);

    const result = await db.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM workout_plans WHERE user_id = $1';
    const countParams = [req.user.id];
    
    if (active !== undefined) {
      countQuery += ' AND is_active = $2';
      countParams.push(active === 'true');
    }

    const countResult = await db.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      plans: result.rows.map(plan => ({
        id: plan.id,
        title: plan.title,
        description: plan.description,
        planData: plan.plan_data,
        isActive: plan.is_active,
        createdAt: plan.created_at,
        updatedAt: plan.updated_at
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get workout plans'
    });
  }
});

/**
 * @route GET /api/plans/:id
 * @desc Get a specific workout plan
 * @access Private
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();

    const result = await db.query(
      'SELECT * FROM workout_plans WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Workout plan not found'
      });
    }

    const plan = result.rows[0];

    res.json({
      plan: {
        id: plan.id,
        title: plan.title,
        description: plan.description,
        planData: plan.plan_data,
        isActive: plan.is_active,
        createdAt: plan.created_at,
        updatedAt: plan.updated_at
      }
    });
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get workout plan'
    });
  }
});

/**
 * @route PUT /api/plans/:id
 * @desc Update a workout plan
 * @access Private
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // Validate input
    const { error, value } = updatePlanSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details[0].message
      });
    }

    const { id } = req.params;
    const { title, description, planData, isActive } = value;
    const db = getDB();

    // Check if plan exists and belongs to user
    const checkResult = await db.query(
      'SELECT id FROM workout_plans WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Workout plan not found'
      });
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${paramIndex++}`);
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push(`description = $${paramIndex++}`);
      updateValues.push(description);
    }
    if (planData !== undefined) {
      updateFields.push(`plan_data = $${paramIndex++}`);
      updateValues.push(JSON.stringify(planData));
    }
    if (isActive !== undefined) {
      updateFields.push(`is_active = $${paramIndex++}`);
      updateValues.push(isActive);
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    updateValues.push(id, req.user.id);

    const updateQuery = `
      UPDATE workout_plans 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex++} AND user_id = $${paramIndex++}
      RETURNING *
    `;

    const result = await db.query(updateQuery, updateValues);
    const updatedPlan = result.rows[0];

    res.json({
      message: 'Workout plan updated successfully',
      plan: {
        id: updatedPlan.id,
        title: updatedPlan.title,
        description: updatedPlan.description,
        planData: updatedPlan.plan_data,
        isActive: updatedPlan.is_active,
        createdAt: updatedPlan.created_at,
        updatedAt: updatedPlan.updated_at
      }
    });
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update workout plan'
    });
  }
});

/**
 * @route DELETE /api/plans/:id
 * @desc Delete a workout plan
 * @access Private
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();

    const result = await db.query(
      'DELETE FROM workout_plans WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Workout plan not found'
      });
    }

    res.json({
      message: 'Workout plan deleted successfully'
    });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete workout plan'
    });
  }
});

module.exports = router;
