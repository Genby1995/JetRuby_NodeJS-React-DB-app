import * as fs from "fs";

class ConfigConstructor {
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
                '{"timerPeriod": 10000, "repoCount": 10, "repoMaxAge": 86400000}'
            );
        }
    }

    async updateConfig({ timerPeriod, repoCount, repoMaxAge }) {
        const newConfig = {
            timerPeriod: timerPeriod,
            repoCount: repoCount,
            repoMaxAge: repoMaxAge,
        };
        await fs.promises.writeFile(
            this.filename,
            JSON.stringify(newConfig, null, 2)
        );
        return newConfig;
    }

    async getConfig() {
        const jsonRecords = await fs.promises.readFile(this.filename, {
            encoding: "utf8",
        });

        const data = JSON.parse(jsonRecords);
        return data;
    }
}

export default new ConfigConstructor("./config/config.json");
