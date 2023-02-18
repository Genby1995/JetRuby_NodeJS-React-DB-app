import * as fs from "fs";
import { timerId, timerSettings } from "../index.js";

class StoreConstructor {
    constructor(filename) {
        if (!filename) {
            throw new Error("Filename is required to create a datastore!");
        }
        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(
                this.filename,
                '{"timerPeriod": 900000, "repoCount": 50, "repoMaxAge": 86400000}'
            );
        }
    }

    async updateData({ timerPeriod, repoCount, repoMaxAge }) {
        const newData = {
            timerPeriod: timerPeriod,
            repoCount: repoCount,
            repoMaxAge: repoMaxAge,
        };

        timerSettings
        timerId

        await fs.promises.writeFile(
            this.filename,
            JSON.stringify(newData, null, 2)
        );
        return newData;
    }

    async getData() {
        const jsonRecords = await fs.promises.readFile(this.filename, {
            encoding: "utf8",
        });

        console.log(jsonRecords);

        const data = JSON.parse(jsonRecords);
        return data;
    }
}

export default new StoreConstructor("./changeable_settings/datastore.json");
