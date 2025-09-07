import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET, RESEND_API_KEY, TRADE_STREAM } from "../config/utils";
import { Resend } from "resend";
import { redisClient, redisStream } from "..";

const resend = new Resend(RESEND_API_KEY);

export const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const email = req.body.email;
  const token = jwt.sign({ email }, JWT_SECRET);

  await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: [email],
    subject: 'hello world',
    html: `http://localhost:3000/api/v1/signin/post/${token}`
  });

  res.json({
    msg: "mail sent",
  });
});

userRouter.post("/signin", async (req, res) => {

  const email = req.body.email;
  const token = jwt.sign({ email }, JWT_SECRET);
  await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: [email],
    subject: 'hello world',
    html: `http://localhost:3000/api/v1/signin/post/${token}`
  });

  res.json({
    msg: "mail sent",
  });
});

userRouter.get("/signin/post/:id", async (req, res) => {
  const token = req.params.id;
  try {
    const email = jwt.verify(token, JWT_SECRET);
    if (!email) {
      return;
    }

    const id = crypto.randomUUID();
    //TODO: initialize user balance

    redisClient.xAdd(TRADE_STREAM, "*", {
      message: JSON.stringify({
        id,
        type: "initialize-balance",
        //@ts-ignore
        email: email.email
      })
    });

    console.log("waiting for reponse");
    const receivedBack = await redisStream.waitForMessage(id);
    console.log("response received", JSON.parse(receivedBack.message));

    //@ts-ignore
    res.cookie("email", email.email)

    res.json({
      msg: "done",
    });


  } catch (err) {
    res.json({
      msg: "invalid auth"
    });
  }
});
