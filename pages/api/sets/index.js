import { MongoClient } from "mongodb";
import extractAuthJWT from "../../../helpers/auth/extractAuthJWT";

const uri = process.env.MONGODB_URI;

export default async (req, res) => {
    const token = await extractAuthJWT(req);
    if (!token) {
        return res.status(401).json({ errors: ["Unauthorized"] });
    }

    const userId = token.sub;
    const client = new MongoClient(uri);
    if (req.method === "GET") {
        let sort = {};
        let limit = 0;
        let conditions = { userId };

        if (typeof req.query.recent !== "undefined") {
            sort = { lastViewedAt: -1 };
            limit = parseInt(req.query.recent);
        }

        if (typeof req.query.favourite !== "undefined") {
            conditions.isFavourite = true;
        }

        let result;
        try {
            await client.connect();
            result = await client
                .db("plearncard")
                .collection("cards")
                .find(conditions, {
                    projection: {
                        _id: 1,
                        name: 1,
                        total: 1,
                        isFavourite: 1,
                        createdAt: 1,
                    },
                })
                .sort(sort)
                .limit(limit)
                .toArray();
        } catch {
            return res
                .status(500)
                .json({ errors: ["Database connection failed"] });
        } finally {
            await client.close();
        }

        return res.status(200).json(result);
    } else if (req.method === "POST") {
        if (!req.body.topic) {
            return res
                .status(400)
                .json({ errors: ["Request body not complete"] });
        }

        const topic = req.body.topic.trim();
        const description = req.body.description.trim() || "";

        let result;
        try {
            await client.connect();
            result = await client
                .db("plearncard")
                .collection("cards")
                .insertOne({
                    userId,
                    name: topic,
                    description,
                    total: 0,
                    cards: [],
                    createdAt: new Date(),
                    lastViewedAt: new Date(),
                });
        } catch {
            return res
                .status(500)
                .json({ errors: ["Database connection failed"] });
        } finally {
            await client.close();
        }

        return res.status(201).json({ insertedId: result.insertedId });
    }

    return res.status(405).json({ errors: ["Method not allowed"] });
};
