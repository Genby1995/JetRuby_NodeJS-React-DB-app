import dataService from "../service/data_service.js";

class DataController {
    async getAll(req, res, next) {
        try {
            const data = await dataService.getAll();
            return res.status(200).json({
                message: "SUCSESS: Last trending repositories from DB are sent",
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
                message: "SUCSESS: Repository with given ID from DB is sent",
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
                    "SUCSESS: Last trending repositories from GitHub are sent",
                data: data,
            });
        } catch (e) {
            next(e);
        }
    }
}

export default new DataController();
