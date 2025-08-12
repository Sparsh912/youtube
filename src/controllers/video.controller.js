import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose, { isValidObjectId } from "mongoose";
// import { ObjectId } from "mongodb";


//get all videos based on query, sort, pagination
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //req.query contains data appended after ? in the URL. Unlike route parameters, these are typically used for optional data like searches or filtering.
    // URL:
    // /search?category=books&sort=price_desc
    // Then req.query is:
    // { category: "books", sort: "price_desc" }

    const pipeline = [];
    //Video.aggregate([{},{},{}]) since array of object
    //Therefore Video.aggregate(pipeline)


    // For using Full Text based search u need to create a search index in mongoDB atlas
    // you can include field mappings in search index (e.g title,description)
    //Field mapping specify which fields within your documents should be indexed for text search 
    // This helps in searching only in titles , desc providing faster search results 
    // Here the name of search index is "search-videos"
    if (query) {
        pipeline.push({
            $search: {
                index: "search-videos",
                text: {
                    query: query,
                    path: ["title", "description"] //search only in title , desc 
                }
            }
        });
    }

    if (userId) {
        if (!isValidObjectId(userId)) {  //isValidObjectId() is a utility function provided by Mongoose to quickly check if a value is a valid MongoDB ObjectId.
            throw new ApiError(400, "Invalid userId");
        }

        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId) //---> deprecated
                // owner : new ObjectId(userId)
            }
        });
    }

    // only fetching those video which are true as ispublished
    pipeline.push({
        $match: {
            isPublised: true
        }
    });

    // sortBy can be views , createdAt , duration
    // sortType can be asc(-1) or des(1)
    if (sortBy && sortType) {
        pipeline.push({
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1
            }
        })
    } else {
        pipeline.push({ $sort: { createdAt: -1 } });
    }

    pipeline.push(
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [{
                    $project: {
                        username: 1,
                        "avatar.url": 1
                    }
                }]
            }
        }, {
            $unwind : "$ownerDetails"
        }
    )

    const videoAggregate = Video.aggregate(pipeline);

    const options = {
        page : parseInt(page , 10),
        limit : parseInt(limit, 10)
    };

    const video = await Video.aggregatePaginate(videoAggregate, options);

    return res
    .status(200)
    .json(new ApiResponse(200 , video , "Videos fetched successfully"));

})

//get video, upload to cloudinary, create video
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
})

export {
    getAllVideos,
    publishAVideo,
}