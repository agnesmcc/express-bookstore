process.env.NODE_ENV = 'test'

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

requestBody = {
    "isbn": "0691161518",
    "amazon_url": "http://a.co/eobPtX2",
    "author": "Matthew Lane",
    "language": "english",
    "pages": 264,
    "publisher": "Princeton University Press",
    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    "year": 2017
}

requestBody2 = {
    "isbn": "0691161518",
    "amazon_url": "http://a.co/eobPtX2",
    "author": "Matthew Lane",
    "language": "english",
    "pages": 264,
    "publisher": "Princeton University Press",
    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    "year": 2020
}

beforeEach(async function () {
    await db.query("DELETE FROM books");
});

afterAll(async function () {
    await db.end();
})

/** GET / => {books: [book, ...]}  */
describe("GET /", function () {
    test("works", async function () {
        let response = await request(app).get("/books");
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            books: []
        });
    });
})

describe("GET /[isbn]", function () {
    test("works", async function () {
        let response = await request(app).post("/books").send(requestBody);
        expect(response.statusCode).toEqual(201);

        response = await request(app).get("/books/0691161518");
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            book: requestBody
        });
    });
})

describe("POST /", function () {
    test("works", async function () {
        let response = await request(app).post("/books").send(requestBody);
        expect(response.statusCode).toEqual(201);
    });
})

describe("POST /", function () {
    test("fails if language property is missing", async function () {
        const badRequestBody = { ...requestBody };
        delete badRequestBody['language'];

        let response = await request(app).post("/books").send(badRequestBody);
        expect(response.statusCode).toEqual(400);
        expect(response.body.error.message[0]).toContain('language');
    });
})

describe("POST /", function () {
    test("fails if year property is not an integer", async function () {
        const badRequestBody = { ...requestBody };
        badRequestBody['year'] = "2017";

        let response = await request(app).post("/books").send(badRequestBody);
        expect(response.statusCode).toEqual(400);
        expect(response.body.error.message[0]).toContain('year');
    });
})

describe("PUT /", function () {
    test("works", async function () {
        let response = await request(app).post("/books").send(requestBody);
        expect(response.statusCode).toEqual(201);

        response = await request(app).put("/books/0691161518").send(requestBody2);
        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            book: requestBody2
        })
    });
})


describe("PUT /", function () {
    test("fails if no body is sent", async function () {
        let response = await request(app).post("/books").send(requestBody);
        expect(response.statusCode).toEqual(201);

        response = await request(app).put("/books/0691161518");
        expect(response.statusCode).toEqual(400);
        expect(response.body.error.message[0]).toContain('requires property');
    });
})

describe("PUT /", function () {
    test("fails if author property is missing", async function () {
        const badRequestBody = { ...requestBody2 };
        delete badRequestBody['author'];

        let response = await request(app).post("/books").send(requestBody);
        expect(response.statusCode).toEqual(201);

        response = await request(app).put("/books/0691161518").send(badRequestBody);
        expect(response.statusCode).toEqual(400);
        expect(response.body.error.message[0]).toContain('author');
    });
})

describe("DELETE /", function () {
    test("works", async function () {
        let response = await request(app).post("/books").send(requestBody);
        expect(response.statusCode).toEqual(201);

        response = await request(app).delete("/books/0691161518");
        expect(response.statusCode).toEqual(200);
    });
})
