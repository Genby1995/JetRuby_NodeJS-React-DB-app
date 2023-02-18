import configConstructor from "../config/configConstructor.js";
import RepoModel from "../models/Repo_model.js";
import ApiError from "../exeptions/api_error.js";
import axios from "axios";
import moment from "moment/moment.js";
import { startTimer, timer } from "../index.js";

class DataService {
    async getAll() {
        let data = await RepoModel.find();
        if (!data || data.length < 1) {
            throw ApiError.NotFound("error - Data is not found in DB");
        }
        data.sort((a, b) => +b.stargazers_count - +a.stargazers_count);
        return data;
    }

    async getConfig(repoId) {
        const config = await configConstructor.getConfig();
        if (!config) {
            throw ApiError.NotFound("error - Config is not found on server");
        }
        return config;
    }

    async getOneId(repoId) {
        const data = await RepoModel.findOne({ repoId: repoId });
        if (!data) {
            throw ApiError.NotFound(
                "error - Data about this ID is not found in DB"
            );
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
            startTimer("isForced");
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
                    if (!isForced) return "error - No data on GitHub";
                    throw ApiError.GITProblem("error - No data on GitHub");
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
                            "error - GitHub API complains about too many requests. Waiting or increasing of update period is neaded:" +
                                err?.response?.data?.message
                        );
                    throw ApiError.GitProblem(
                        "error - GitHub API complains about too many requests. Waiting or increasing of update period is neaded: " +
                            err?.response?.data?.message
                    );
                }
                if (!isForced)
                    return console.log(
                        err?.response?.status,
                        err?.response?.data?.message
                    );
                throw ApiError.GitProblem(
                    "error - Problem with GitHub request: " +
                        err?.response?.data?.message
                );
            });

        if (gitdata || gitdata?.length > 1) {
            await RepoModel.deleteMany({});
            let result = await RepoModel.create(gitdata);
            return result;
        } else {
            if (!isForced) return;
            throw ApiError.GitProblem("error - No data on GitHub");
        }
    }
}

export default new DataService();
