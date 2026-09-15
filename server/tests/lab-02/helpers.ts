import request from "supertest";
import { app } from "../../src/app.js";

export const TEST_PASSWORD = "RequesterPass123!";

export async function loginAs(email: string, password = TEST_PASSWORD): Promise<string> {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email, password });

  if (res.status !== 200 || !res.body?.token) {
    throw new Error(`Failed to login as ${email}: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return res.body.token;
}