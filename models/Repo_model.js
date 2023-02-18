import mongoose from "mongoose";

const RepoSchema = new mongoose.Schema(
    {
        repoId: {
            type: String,
            require: true,
        },
        full_name: {
            type: String,
            require: true,
            min: 1,
            max: 255,
            default: "",
        },
        html_url: {
            type: String,
            require: true,
            min: 1,
            max: 255,
            default: "",
        },
        stargazers_count: {
            type: Number,
            require: true,
            default: 0,
        },
    }
    // { timestamps: true }
);

export default mongoose.model("Repo", RepoSchema);
