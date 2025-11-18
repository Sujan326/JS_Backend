import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const match = { isPublished: true };
  console.log("match at the starting of the code: ", match);
  
  //! match the title / description with the query provided
  if (query) {
    match.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }
  
  //! Filter based on userId
  if (userId) {
    match.owner = userId;
  }
  
  //! Aggregation Pipeline
  const pipeline = [{ $match: match }];
  console.log("Pipeline: ", pipeline)
  
  //! Sorting
  const sortStage = {};
  
  if (sortBy) {
    sortStage[sortBy] = sortType === "asc" ? 1 : -1;
  }
  
  if (sortBy) {
    pipeline.push({ $sort: sortStage });
  }
  
  //! Aggregate Pagination
  const options = {
    page,
    limit,
  };
  
  const video = await Video.aggregatePaginate(
    Video.aggregate(pipeline),
    options
  );
  console.log("match at the ending of the code: ", match);
  console.log("Videos: ", video);

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  //! Extract fields from req.body
  const { title, description } = req.body;
  console.log("Response body: ", req.body);

  //! Validation
  if (!title) {
    throw new ApiError(400, "Title is missing");
  }

  if (!description) {
    throw new ApiError(400, "Description is missing");
  }

  //! Extract files from multer
  const videoFilePath = req.files?.videoFile?.[0]?.path;
  const thumbnailFilePath = req.files?.thumbnail?.[0]?.path;

  if (!videoFilePath || !thumbnailFilePath) {
    throw new ApiError(400, "Video or Thumbnail File Path does not exists");
  }

  //! Upload on cloudinary
  const uploadedVideoFile = await uploadOnCloudinary(videoFilePath);
  const uploadedThumbnailFile = await uploadOnCloudinary(thumbnailFilePath);

  console.log("Video on Cloudinary: ", uploadedVideoFile);
  console.log("Thumbnail on Cloudinary: ", uploadedThumbnailFile);

  if (!uploadedVideoFile || !uploadedThumbnailFile) {
    throw new ApiError(400, "Video or Thumbnail file is required");
  }

  const video = await Video.create({
    videoFile: uploadedVideoFile.url,
    thumbnail: uploadedThumbnailFile.url,
    title,
    description,
    duration: uploadedVideoFile.duration,
    owner: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
