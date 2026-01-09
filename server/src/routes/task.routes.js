const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
} = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');

// Middleware to handle validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};

router
    .route('/')
    .get(protect, getTasks)
    .post(
        protect,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('description', 'Description is required').not().isEmpty(),
        ],
        validate,
        createTask
    );

router
    .route('/:id')
    .put(protect, updateTask)
    .delete(protect, deleteTask);

module.exports = router;
