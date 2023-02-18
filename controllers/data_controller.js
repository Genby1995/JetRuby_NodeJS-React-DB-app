import dataService from "../service/data_service.js";

class DataController {
    async getAll(req, res, next) {
        try {
            const data = await dataService.getAll();
            return res.status(200).json({
                message:
                    "success - Last trending repositories from DB recieved",
                data: data,
            });
        } catch (e) {
            next(e);
        }
    }

    async getOneId(req, res, next) {
        const repoId = req.params.id.slice(2);
        try {
            const data = await dataService.getOneId(repoId);
            return res.status(200).json({
                message: "success - Repository with given ID from DB recieved",
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
                message:
                    "success - Last trending repositories from GitHub recieved",
                data: data,
            });
        } catch (e) {
            next(e);
        }
    }

    async getConfig(req, res, next) {
        try {
            const config = await dataService.getConfig();
            return res.status(200).json({
                message: "success - Actual server config recieved",
                config: config,
            });
        } catch (e) {
            next(e);
        }
    }
}

export default new DataController();
