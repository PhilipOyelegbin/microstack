const request = require("supertest");
const app = require("./server");

describe("Auth Endpoints", () => {
  it("should fail login with non-existent user", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "nobody", password: "password" });
    console.error(await res.json());
    expect(res.statusCode).toEqual(401);
  });
});
