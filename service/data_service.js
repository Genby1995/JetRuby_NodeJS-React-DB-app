import configConstructor from "../config/configConstructor.js";
import RepoModel from "../models/Repo_model.js";
import ApiError from "../exeptions/api_error.js";
import axios from "axios";
import moment from "moment/moment.js";
import { startTimer, timer } from "../index.js";

class DataService {
    async getAll() {
        const data = await RepoModel.find();
        if (!data || data.length < 1) {
            throw ApiError.NotFound("Data not found in DB");
        }
        return data;
    }

    async getOneId(repoId) {
        const data = await RepoModel.findOne({ repoId: repoId });
        if (!data) {
            throw ApiError.NotFound("Data about this ID not found in DB");
        }
        return data;
    }

    async updateData(repoMaxAge, timerPeriod, repoCount, isForced) {
        if (isForced) {
            await configConstructor.updateConfig({
                repoMaxAge,
                timerPeriod,
                repoCount,
            });
            clearInterval(timer);
            startTimer();
        }
        let repoMaxAgeStr = moment(new Date(new Date() - repoMaxAge)).format(
            "YYYY-MM-DD"
        );
        const gitdata = await axios
            .get(
                "https://api.github.com/search/repositories" +
                    `?q=created:>${repoMaxAgeStr}` +
                    "&sort=stars" +
                    "&order=desc" +
                    "&page=1" +
                    `&per_page=${repoCount}`
            )
            .then((res) => {
                if (!res?.data?.items) {
                    if (!isForced) return "No data on GitHub";
                    throw ApiError.GITProblem("No data on GitHub");
                }
                const addResult = res.data.items.map((item) => {
                    return {
                        repoId: item.id,
                        full_name: item.full_name,
                        html_url: item.html_url,
                        stargazers_count: item.stargazers_count,
                    };
                });
                return addResult;
            })
            .catch((err) => {
                if (err?.response?.status === 403) {
                    if (!isForced)
                        return console.log(
                            "GitHub API complains about too many requests. Waiting or increasing of update period is neaded:" +
                                err?.response?.data?.message
                        );
                    throw ApiError.GitProblem(
                        "GitHub API complains about too many requests. Waiting or increasing of update period is neaded: " +
                            err?.response?.data?.message
                    );
                }
                if (!isForced)
                    return console.log(
                        err?.response?.status,
                        err?.response?.data?.message
                    );
                throw ApiError.GitProblem(
                    "Problem with GitHub request: " +
                        err?.response?.data?.message
                );
            });

        if (gitdata || gitdata?.length > 1) {
            await RepoModel.deleteMany({});
            let result = await RepoModel.create([...gitdata]);
            return result;
        } else {
            if (!isForced) return;
            throw ApiError.GitProblem("No data on GitHub");
        }
    }
}

export default new DataService();
