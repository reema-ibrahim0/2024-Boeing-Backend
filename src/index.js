import cors from "cors";
import express from "express";
// Load environment variables
import "./loadEnvironment.js";
import db from "./db/conn.js";
import { z } from "zod";
import parseSchema from "./utils/parseSchema.js";
import addLineSchema from "./schemas/addLineSchema.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/lines", async (req, res) => {
    let linesCollection = await db.collection("lines");
    let results = await linesCollection.find({})
        .toArray();
    res.send(results).status(200);

})

app.post("/lines", async (req, res) => {
    const body = parseSchema(addLineSchema, req.body);
    if (body) {
        let linesCollection = await db.collection("lines");
        let result = await linesCollection.insertOne(body);
        console.log(result);
        // res.send(result).status(200);
        if (result.acknowledged) {
            return res.send(200);
        }
        else {
            return res.send(500);
        }
    }
    else {
        res.send(400);
    }

})

const listener = app.listen(3000, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // or "*" for a public API
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

