const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a project name'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Automatically add admin as a member
projectSchema.pre('save', function (next) {
  if (this.isNew && !this.members.includes(this.adminId)) {
    this.members.push(this.adminId);
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
