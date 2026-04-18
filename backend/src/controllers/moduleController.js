const Module = require('../models/Module');
const { sendSuccess, sendError } = require('../utils/response');
const paginate = require('../utils/paginate');

/**
 * @desc    Create a module
 * @route   POST /api/modules
 * @access  Admin
 */
const createModule = async (req, res, next) => {
  try {
    const { moduleName, moduleCode, semester, description, topics } = req.body;

    const module = await Module.create({
      moduleName,
      moduleCode,
      semester,
      description,
      topics: topics || [],
      createdBy: req.user._id,
    });

    return sendSuccess(res, module, "Module created successfully.", 201);
  } catch (error) {
    next(error);
  }
};