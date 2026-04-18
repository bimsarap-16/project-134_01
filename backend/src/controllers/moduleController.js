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

/**
 * @desc    Get all modules (paginated)
 * @route   GET /api/modules
 * @access  All authenticated users
 */
const getModules = async (req, res, next) => {
    try {
        const result = await paginate(Module, {}, req.query, (q) =>
            q.populate('createdBy', 'name email')
        );
        return sendSuccess(res, result, 'Modules fetched successfully.');
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get a single module by ID
 * @route   GET /api/modules/:id
 * @access  All authenticated users
 */
const getModuleById = async (req, res, next) => {
    try {
        const module = await Module.findById(req.params.id).populate('createdBy', 'name email');
        if (!module) {
            return sendError(res, 'Module not found.', 404);
        }
        return sendSuccess(res, module, 'Module fetched successfully.');
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update a module
 * @route   PUT /api/modules/:id
 * @access  Admin
 */
const updateModule = async (req, res, next) => {
  try {
    const { moduleName, moduleCode, semester, description, topics } = req.body;

    const module = await Module.findById(req.params.id);
    if (!module) return sendError(res, "Module not found.", 404);

    // if moduleCode changed, check duplicate
    if (moduleCode && moduleCode.toUpperCase() !== module.moduleCode) {
      const exists = await Module.findOne({ moduleCode: moduleCode.toUpperCase() });
      if (exists) {
        return sendError(res, "The module code you entered already exists.", 400);
      }
      module.moduleCode = moduleCode;
    }

    module.moduleName = moduleName || module.moduleName;
    module.semester = semester || module.semester;
    module.description = description !== undefined ? description : module.description;
    if (topics !== undefined) module.topics = topics;

    await module.save();
    return sendSuccess(res, module, "Module updated successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a module
 * @route   DELETE /api/modules/:id
 * @access  Admin
 */
const deleteModule = async (req, res, next) => {
    try {
        const module = await Module.findById(req.params.id);
        if (!module) {
            return sendError(res, 'Module not found.', 404);
        }

        await module.deleteOne();
        return sendSuccess(res, null, 'Module deleted successfully.');
    } catch (error) {
        next(error);
    }
};

module.exports = { createModule, getModules, getModuleById, updateModule, deleteModule };
