const mongoose = require("mongoose");

const ComprehensiveStudentSchema = new mongoose.Schema({
  // Authentication fields
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  selectedMetrics: {
    type: [String],
    default: []
  },

  // Student profile information
  name: {
    type: String,
    trim: true
  },
  age: {
    type: Number,
    // min: 0,
    // max: 100
  },
  dob: {
    type: String
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', null],
    default: null
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', null],
    default: null
  },
  phone: {
    type: String,
    trim: true
  },
  fatherName: {
    type: String,
    trim: true
  },
  instituteName: {
    type: String,
    trim: true
  },
  admissionNumber: {
    type: String,
    unique: true,
    trim: true
  },
  course: {
    type: String,
    trim: true
  },
  sports: {
    type: [String],
    default: []
  },

  // Health metrics
  height: {
    type: Number,
    // min: 100,
    // max: 250
  },
  weight: {
    type: Number,
    // min: 20,
    // max: 200
  },
  bmi: {
    type: Number
  },
  bloodPressure: {
    systolic: {
      value: Number,
      status: {
        type: String,
        enum: ['normal', 'low', 'high'],
        default: 'normal'
      }
    },
    diastolic: {
      value: Number,
      status: {
        type: String,
        enum: ['normal', 'low', 'high'],
        default: 'normal'
      }
    }
  },
  heartRate: {
    value: Number,
    status: {
      type: String,
      enum: ['normal', 'low', 'high'],
      default: 'normal'
    }
  },
  temperature: {
    value: Number,
    status: {
      type: String,
      enum: ['normal', 'low', 'high'],
      default: 'normal'
    }
  },
  oxygenSaturation: {
    value: Number,
    status: {
      type: String,
      enum: ['normal', 'low', 'high'],
      default: 'normal'
    }
  },
  vision: {
    type: String,
    enum: ["normal", "glasses", "impaired", ""],
    default: ""
  },
  hearing: {
    type: String,
    enum: ["normal", "mild", "moderate", "severe", ""],
    default: ""
  },
  allergies: {
    type: [String],
    default: []
  },
  medications: {
    type: [String],
    default: []
  },
  chronicConditions: {
    type: [String],
    default: []
  },
  immunizations: {
    type: [String],
    default: []
  },
  dietaryRestrictions: {
    type: [String],
    default: []
  },
  physicalActivity: {
    type: Number,
    // min: 0,
    // max: 168
  },
  sleepHours: {
    type: Number,
    // min: 0,
    // max: 24
  },
  mentalHealthNotes: {
    type: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  lastCheckupDate: {
    type: Date
  },
  healthStatus: {
    type: String,
    enum: ['healthy', 'unhealthy', 'unknown'],
    default: 'unknown'
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for better query performance
ComprehensiveStudentSchema.index({ email: 1 });
ComprehensiveStudentSchema.index({ admissionNumber: 1 });

// BMI calculation and health status middleware
ComprehensiveStudentSchema.pre('save', function(next) {
  // Calculate BMI if height and weight exist
  if (this.height && this.weight) {
    const heightInMeters = this.height / 100;
    this.bmi = parseFloat((this.weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  // Update metric statuses based on values
  const updateMetricStatus = (value, normalRange) => {
    if (value === undefined || value === null) return 'normal';
    if (value < normalRange[0]) return 'low';
    if (value > normalRange[1]) return 'high';
    return 'normal';
  };

  // Define normal ranges for metrics
  const normalRanges = {
    bloodPressureSystolic: [90, 120],
    bloodPressureDiastolic: [60, 80],
    heartRate: [60, 100],
    temperature: [36.1, 37.2],
    oxygenSaturation: [95, 100]
  };

  // Update status for each metric
  if (this.bloodPressure?.systolic?.value !== undefined) {
    this.bloodPressure.systolic.status = updateMetricStatus(
      this.bloodPressure.systolic.value,
      normalRanges.bloodPressureSystolic
    );
  }
  
  if (this.bloodPressure?.diastolic?.value !== undefined) {
    this.bloodPressure.diastolic.status = updateMetricStatus(
      this.bloodPressure.diastolic.value,
      normalRanges.bloodPressureDiastolic
    );
  }

  if (this.heartRate?.value !== undefined) {
    this.heartRate.status = updateMetricStatus(
      this.heartRate.value,
      normalRanges.heartRate
    );
  }

  if (this.temperature?.value !== undefined) {
    this.temperature.status = updateMetricStatus(
      this.temperature.value,
      normalRanges.temperature
    );
  }

  if (this.oxygenSaturation?.value !== undefined) {
    this.oxygenSaturation.status = updateMetricStatus(
      this.oxygenSaturation.value,
      normalRanges.oxygenSaturation
    );
  }

  // Determine overall health status
  const metricsToCheck = [
    this.bloodPressure?.systolic?.status,
    this.bloodPressure?.diastolic?.status,
    this.heartRate?.status,
    this.temperature?.status,
    this.oxygenSaturation?.status
  ];

  const hasAbnormalMetrics = metricsToCheck.some(
    status => status === 'low' || status === 'high'
  );

  this.healthStatus = hasAbnormalMetrics ? 'unhealthy' : 'healthy';
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("ComprehensiveStudent", ComprehensiveStudentSchema);