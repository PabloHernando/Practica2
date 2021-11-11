import { Db } from "mongodb";
import { getAndSaveRickyMortyCharacters } from "./populatedb";
import express from "express";
import { character, characters, register, login, signOut, deleteUser, updateState } from "./resolvers";

const run = async () => {
  const db: Db = await getAndSaveRickyMortyCharacters();
  const app = express();
  app.set("db", db);

  app.use(`/characters`, async(req, res, next) => {
    if(req.headers.token != undefined || req.headers.token != null){
      const user = await db.collection("Registered_Users").findOne({token: req.headers.token})
      if(user){
        next();
      }else{
        res.json({status:409,message:"you arent logged in."})
      }
    }else{
      res.json({status:409,message:"you arent logged in."})
    }
  });
  app.use(`/characters/:id`, async(req, res, next) => {
    if(req.headers.token != undefined || req.headers.token != null){
      const user = await db.collection("Registered_Users").findOne({token: req.headers.token})
      if(user){
        next();
      }else{
        res.json({status:409,message:"you arent logged in."})
      }
    }else{
      res.json({status:409,message:"you arent logged in."})
    }
  });
  app.use(`/signOut`, async(req, res, next) => {
    if(req.headers.token != undefined || req.headers.token != null){
      const user = await db.collection("Registered_Users").findOne({token: req.headers.token})
      if(user){
        console.log(req.headers.token);
        next();
      }else{
        res.json({status:409,message:"you arent logged in."})
      }
    }else{
      res.json({status:409,message:"you arent logged in."})
    }
  });
  app.use(`/deleteUser`, async(req, res, next) => {
    if(req.headers.token != undefined || req.headers.token != null){
      const user = await db.collection("Registered_Users").findOne({token: req.headers.token})
      if(user){
        console.log(req.headers.token);
        next();
      }else{
        res.json({status:409,message:"you arent logged in."})
      }
    }else{
      res.json({status:409,message:"you arent logged in."})
    }
  });
  app.use(`/updateState/:id`, async(req, res, next) => {
    if(req.headers.token != undefined || req.headers.token != null){
      const user = await db.collection("Registered_Users").findOne({token: req.headers.token})
      if(user){
        next();
      }else{
        res.json({status:409,message:"you arent logged in."})
      }
    }else{
      res.json({status:409,message:"you arent logged in."})
    }
  });

  app.get("/status", async (req, res) => {
    res.json({status:200,message:"Working."});
  });

  app.get("/characters", characters);
  app.get("/character/:id", character);
  app.put("/updateState/:id", updateState);
  app.put("/register",register);
  app.get("/login", login);
  app.get("/signOut", signOut);
  app.get("/deleteUser", deleteUser);

  await app.listen(3000);
};

try {
  run();
} catch (e) {
  console.error(e);
}
