import Job from "../models/jobApplication.model.js"
import ApiError from "../utils/apiError.js"
import mongoose from "mongoose"


export const createJobController = async (req, res) => {
  const { company, title, status, type, notes, location } = req.body
  if (!company.trim()) {
    throw new ApiError(400, "Company is required")
  }

  if (!title.trim()) {
    throw new ApiError(400, "Title is required")
  }

  if (!status.trim()) {
    throw new ApiError(400, "Status is required")
  }

  if (!type.trim()) {
    throw new ApiError(400, "Type is required")
  }

  if (!notes.trim()) {
    throw new ApiError(400, "Notes is required")
  }

  if (!location.trim()) {
    throw new ApiError(400, "Location is required")
  }

  let userId = req.user
  if (!userId) {
    throw new ApiError(401, "Unauthorized user")
  }

  const newJob = await Job.create({
    company,
    title,
    status,
    type,
    notes,
    location,
    user: userId
  })

  return res.status(201).json({
    success: true,
    message: "Job created successfully",
    job: newJob
  })

}

export const updateJobController = async (req, res) => {
  const { id } = req.params
  let userId = req.user
  if (!userId) {
    throw new ApiError(401, "Unauthorized user")
  }

  const {
    company,
    title,
    status,
    type,
    location,
    notes } = req.body

  if (!id) {
    throw new ApiError(400, "Job ID is required")
  }

  const updatedJob = await Job.findOneAndUpdate(
    {
      _id: id,
      user: userId
    },
    {
      company,
      title,
      status,
      type,
      location,
      notes,
    },
    {
      new: true,
      runValidators: true
    }
  )

  if (!updatedJob) {
    throw new ApiError(404, "Job application not found");
  }

  return res.status(200).json({
    success: true,
    message: "Job application updated successfully",
    job: updatedJob,
  });
}

export const deletejobController = async (req, res) => {
  const { id } = req.params
  if (!id) {
    throw new ApiError(400, "Job ID is required")
  }

  let userId = req.user
  if (!userId) {
    throw new ApiError(401, "Unauthorized user")
  }

  await Job.findOneAndDelete(
    {
      _id: id,
      user: userId
    },
  )

  return res.status(200).json({
    success: true,
    message: "Job deleted successfully"
  })
}

export const getJobController = async (req, res) => {

  // Query params se current page le rahe hain.
  // Agar page nahi mila ya invalid hua to minimum page 1 rahega.
  const page = Math.max(Number(req.query.page) || 1, 1)

  // Query params se ek page par kitni jobs chahiye wo le rahe hain.
  // Agar limit nahi mili ya invalid hui to minimum limit 1 rahegi.
  const limit = Math.max(Number(req.query.limit) || 1, 1)

  // Previous pages ke kitne records skip karne hain wo calculate kar rahe hain.
  const skip = (page - 1) * limit

  // Sirf logged-in user ki jobs fetch karne ke liye filter bana rahe hain.
  const filter = {
    user: req.userId
  }

  // Logged-in user ki total job applications ka count nikal rahe hain.
  const totalJobs = await Job.countDocuments(filter)

  // User ki jobs fetch kar rahe hain:
  // latest jobs first, required records skip karke, aur given limit tak data return hoga.
  const jobs = await Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)

  // Total jobs aur limit ke basis par total pages calculate kar rahe hain.
  const totalPages = Math.ceil(totalJobs / limit)

  // Pagination metadata aur current page ki jobs frontend ko return kar rahe hain.
  return res.status(200).json({
    success: true,
    page,
    limit,
    totalJobs,
    jobs,
    totalPages
  })

}

export const getSingleJobController = async (req, res) => {
  const { id } = req.params

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid job id")
  }

  const job = await Job.findOne({
    _id: id,
    user: req.user
  })

  if (!job) {
    throw new ApiError(404, "Job not found")
  }

  return res.status(200).json({
    success: true,
    job,
  })
}