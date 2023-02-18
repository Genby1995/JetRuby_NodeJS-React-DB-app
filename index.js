import express from "express";
import mongoose from "mongoose";
import router from "./router/router.js";
import storeConstructor from "./changeable_settings/storeConstructor.js";

const PORT = process.env.PORT || 8000;
const MONGO_URL =
    process.env.MONGO_URL ||
    "mongodb+srv://Genby1995:Genby1995@genby1995.xj9l6du.mongodb.net/jetruby";
const app = express();

export let timerSettings = await storeConstructor.getData();
storeConstructor.updateData(timerSettings);
export let timerId = null;

app.use("/api", router);
app.listen(PORT, () => {
    console.log("Server has been started!");
});

async function start() {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(
            MONGO_URL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
            () => {
                console.log("Connected to MongoDB!");
            }
        );
    } catch (e) {
        console.log("Error with MongoDB connection:" + e);
    }
}

const tick = () => {
    console.log("Tick");
    return (timerId = setTimeout(tick, timerSettings.timerPeriod || 10));
};

start();
tick();
