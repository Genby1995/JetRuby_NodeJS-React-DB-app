import dataService from "../service/data_service.js";

class DataController {
    async getAll(req, res, next) {
        try {
            const data = await dataService.getAll();
            return res.status(200).json({
                message: "Last trending repositories are sent",
                data: data,
            });
        } catch (e) {
            next(e);
        }
    }

    async getOneId(req, res, next) {
        const repoId = req.params.id;
        console.log(repoId);
        try {
            const data = await dataService.getOneId(repoId);
            return res.status(200).json({
                message: "Repository with given ID is sent",
                data: data,
            });
        } catch (e) {
            next(e);
        }
    }

    async updateData(req, res, next) {
        const { repoMaxAge, timerPeriod, repoCount } = req.body;
        try {
            const data = await dataService.updateData(
                repoMaxAge,
                timerPeriod,
                repoCount,
                true
            );
            return res.status(200).json({
                message: "Last trending repositories are sent",
                data: data,
            });
        } catch (e) {
            next(e);
        }
    }

    async addData(req, res, next) {
        console.log(req.body);
        const { repoId, full_name, html_url, stargazers_count } = req.body;
        try {
            const repoData = await dataService.addData(
                repoId,
                full_name,
                html_url,
                stargazers_count
            );
            return res.status(200).json({
                message: "Repo is added",
                data: repoData,
            });
        } catch (e) {
            next(e);
        }
    }
}

export default new DataController();
