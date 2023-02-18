import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import router from "./router/router.js";
import cors from "cors";
import configConstructor from "./config/configConstructor.js";
import error_middleware from "./middlewares/error_middleware.js";
import bodyParser from "body-parser";
import dataService from "./service/data_service.js";

dotenv.config();

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;
const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api", router);
app.use(error_middleware);

async function start() {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(
            MONGO_URL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                dbName: "jetruby",
            },
            () => {
                console.log("Connected to MongoDB!");
                startTimer();
            }
        );
        app.listen(PORT, () => {
            console.log(`Server has been started on PORT:${PORT}!`);
        });
    } catch (e) {
        console.log("Error with MongoDB connection:" + e);
    }
}

//Timer logic
export let timer = null;
export const startTimer = async (isForsed) => {
    try {
        let config = await configConstructor.getConfig();
        if (!isForsed) {
            dataService.updateData(
                config.repoMaxAge,
                config.timerPeriod,
                config.repoCount,
                false
            );
        }
        console.log("DB data refreshed with settings:", config);
        return (timer = setTimeout(
            startTimer,
            config.timerPeriod || 1000 * 60
        ));
    } catch (error) {
        console.log("Error with updating data:" + error);
        return (timer = setTimeout(startTimer, 5000));
    }
};

start();
