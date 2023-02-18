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
            const date = await dataService.addMessage(text, author);
            return res.status(200).json({
                message: "Last trending repositories are sent",
                data: data,
            });
        } catch (e) {
            next(e);
        }
    }
}

export default new DataController();
