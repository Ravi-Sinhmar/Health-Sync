const Student = require("../models/Student")
const HealthData = require("../models/HealthData")
const jwt = require('jsonwebtoken');

const dotenv = require("dotenv")
dotenv.config()
const URL = process.env.NODE_ENV == 'Production' ? process.env.Remote_url : 'http://localhost:5173'


exports.saveStudentProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      age,
      dob,
      bloodGroup,
      gender,
      phone,
      fatherName,
      instituteName,
      admissionNumber,
      course,
      sports,
    } = req.body;

    // Check if student profile already exists
    let student = await Student.findOne({ email });

    if (student) {
      // Update existing profile
      student = await Student.findOneAndUpdate(
        { email },
        {
          name,
          age,
          dob,
          bloodGroup,
          gender,
          phone,
          fatherName,
          instituteName,
          admissionNumber,
          course,
          sports,
        },
        { new: true }
      );
    } else {
      // Create new student profile
      student = new Student({
        name,
        email,
        age,
        dob,
        bloodGroup,
        gender,
        phone,
        fatherName,
        instituteName,
        admissionNumber,
        course,
        sports,
      });
      await student.save();

      // Create empty health data record
      const healthData = new HealthData({  // Assuming you have a HealthData model
        studentEmail: email,
        metrics: {},
      });
      await healthData.save();
    }

    // Set authentication cookie
    const token = jwt.sign(
      { id: student._id, email: student.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true, // Prevent client-side access for security
      secure: true, // Ensure HTTPS is used
      sameSite: 'none', // Required for cross-origin cookies
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      domain: undefined, // Let the browser automatically use the correct domain
    });
    
    res.status(201).json({
      message: "Student profile saved successfully",
      student,
      token, // Optionally send token in response if needed for client-side
    });
  } catch (error) {
    console.error("Save student profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.updateHealthData = async (req, res) => {
 
  const { admissionNumber } = req.body; // Extract admissionNumber from the request body
  const healthData = req.body; // Extract health data to be updated

  try {
      // Validate admissionNumber and healthData
      if (!admissionNumber || !healthData) {
          return res.status(400).json({ error: "Admission number and health data are required." });
      }

      // Find the student by admission number
      const student = await Student.findOne({ admissionNumber });

      if (!student) {
          return res.status(404).json({ error: "Student not found." });
      }

      // Update the health data
      student.name = healthData.name || student.name;
      student.age = healthData.age || student.age;
      student.gender = healthData.gender || student.gender;
      student.height = healthData.height || student.height;
      student.weight = healthData.weight || student.weight;
      student.bmi = healthData.bmi || student.bmi;
      student.bloodPressure = healthData.bloodPressure || student.bloodPressure;
      student.heartRate = healthData.heartRate || student.heartRate;
      student.temperature = healthData.temperature || student.temperature;
      student.oxygenSaturation = healthData.oxygenSaturation || student.oxygenSaturation;
      student.vision = healthData.vision || student.vision;
      student.hearing = healthData.hearing || student.hearing;
      student.allergies = healthData.allergies || student.allergies;
      student.medications = healthData.medications || student.medications;
      student.chronicConditions = healthData.chronicConditions || student.chronicConditions;
      student.immunizations = healthData.immunizations || student.immunizations;
      student.dietaryRestrictions = healthData.dietaryRestrictions || student.dietaryRestrictions;
      student.physicalActivity = healthData.physicalActivity || student.physicalActivity;
      student.sleepHours = healthData.sleepHours || student.sleepHours;
      student.mentalHealthNotes = healthData.mentalHealthNotes || student.mentalHealthNotes;
      student.emergencyContact = healthData.emergencyContact || student.emergencyContact;
  
      // Save the updated document
      await student.save();

      res.status(200).json({ message: "Health data updated successfully.", student });
  } catch (error) {
      res.status(500).json({ error: "An error occurred while updating health data.", details: error.message });
  }
};

exports.userData = async (req, res) => {
 
  const { email } = req.body; // Extract admissionNumber from the request body
  const allData = req.body; // Extract health data to be updated

  try {
      // Validate admissionNumber and healthData
      if (!email || !allData) {
          return res.status(400).json({ error: "Admission number and health data are required." });
      }

      // Find the student by admission number
      const student = await Student.findOne({ email });

      if (!student) {
          return res.status(404).json({ error: "Student not found." });
      }

      // Update the health data
      student.name = allData.name || student.name;
      student.age = allData.age || student.age;
      student.gender = allData.gender || student.gender;
      student.dob = allData.dob || student.dob;
      student.bloodGroup = allData.bloodGroup || student.bloodGroup;
      student.phone = allData.phone || student.phone;
      student.instituteName = allData.instituteName || student.instituteName;
      student.admissionNumber = allData.admissionNumber || student.admissionNumber;
      student.course = allData.course || student.course;
      student.sports = allData.sports || student.sports;
      student.fatherName = allData.fatherName || student.fatherName;
      student.address = allData.address || student.address;
      
      // Save the updated document
      await student.save();

      res.status(200).json({ message: "Health data updated successfully.", student });
  } catch (error) {
      res.status(500).json({ error: "An error occurred while updating health data.", details: error.message });
  }
};


exports.getAllStudents = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const search = req.query.search || ""

    // Build search query
    let query = {}
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { instituteName: { $regex: search, $options: "i" } },
        ],
      }
    }

    // Get total count for pagination
    const total = await Student.countDocuments(query)

    // Get paginated students with basic info
    const students = await Student.find(query, {
      name: 1,
      email: 1,
      phone: 1,
      instituteName: 1,
      createdAt: 1,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // Calculate total pages
    const totalPages = Math.ceil(total / limit)

    res.status(200).json({
      students,
      total,
      totalPages,
      currentPage: page,
      limit,
    })
  } catch (error) {
    console.error("Get all students error:", error)
    res.status(500).json({ message: "Server error" })
  }
}



// exports.getAllStudents = async (req, res) => {
//   try {
//     // Get all students with basic info
//     const students = await Student.find(
//       {},
//       {
//         name: 1,
//         email: 1,
//         phone: 1,
//         instituteName: 1,
//         createdAt: 1,
//       },
//     )

//     // Get health status for each student
//     const studentsWithStatus = await Promise.all(
//       students.map(async (student) => {
//         const healthData = await HealthData.findOne({ studentEmail: student.email })
//         let healthStatus = "healthy"

//         if (healthData && healthData.metrics) {
//           // Check if any metric has abnormal status
//           const hasAbnormalMetrics = Object.values(healthData.metrics).some(
//             (metric) => metric.status === "low" || metric.status === "high",
//           )

//           if (hasAbnormalMetrics) {
//             healthStatus = "unhealthy"
//           }
//         }

//         return {
//           ...student.toObject(),
//           healthStatus,
//         }
//       }),
//     )

//     res.status(200).json(studentsWithStatus)
//   } catch (error) {
//     console.error("Get all students error:", error)
//     res.status(500).json({ message: "Server error" })
//   }
// }

exports.getStudentProfile = async (req, res) => {
  try {
    const { email } = req.user;

    // Find student profile
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Get student profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getBasicStudentProfile = async (req, res) => {
  try {
    const { email } = req.params

    // Find student profile with only basic info
    const student = await Student.findOne(
      { email },
      {
        name: 1,
        email: 1,
      },
    )

    if (!student) {
      return res.status(404).json({ message: "Student profile not found" })
    }

    res.status(200).json(student)
  } catch (error) {
    console.error("Get basic student profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

exports.getHealthData = async (req, res) => {
  try {
    const { email } = req.params
    const detailed = req.query.detailed === "true"

    // Find health data
    let healthData = await HealthData.findOne({ studentEmail: email })

    if (!healthData) {
      // Create empty health data if not exists
      healthData = new Student({
        studentEmail: email,
        metrics: {},
      })
      await healthData.save()
    }

    // If not detailed, return only key metrics
    if (!detailed && healthData.metrics) {
      const keyMetrics = ["weight", "height", "bmi", "bloodPressure"]
      const filteredMetrics = {}

      keyMetrics.forEach((key) => {
        if (healthData.metrics[key]) {
          filteredMetrics[key] = healthData.metrics[key]
        }
      })

      healthData.metrics = filteredMetrics
    }

    res.status(200).json(healthData)
  } catch (error) {
    console.error("Get health data error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

exports.saveMetrics = async (req, res) => {
  try {
    const { metrics } = req.body
    const email = req.user.email

    // Update selected metrics in user profile
    await Student.findOneAndUpdate({ email }, { selectedMetrics: metrics })

    res.status(200).json({ message: "Metrics saved successfully" })
  } catch (error) {
    console.error("Save metrics error:", error)
    res.status(500).json({ message: "Server error" })
  }
}



