import { Request, Response } from "express";
import { Db } from "mongodb";
import { v4 as uuidv4 } from 'uuid';

export const characters = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 20;
  const db: Db = req.app.get("db");
  const chars = await db
    .collection("Characters")
    .find()
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .toArray();
  res.status(200).json(chars);
};

export const character = async (req: Request, res: Response) => {
  const id = req.params.id;
  const db: Db = req.app.get("db");
  const char = await db.collection("Characters").findOne({ id: parseInt(id) });
  if (char) res.status(200).json(char);
  else res.status(404).json({status:404,message:"Character not found."})
};

export const register = async (req: Request, res: Response) => {
  const username = req.query.username;
  const password = req.query.password;
  const db: Db = req.app.get("db");
  const user = await db.collection("Registered_Users").findOne({user: username});
  if(!user){
    const char = await db.collection("Registered_Users").insertOne({
      user:username,
      password: password,
      token: null,
    });
    res.json({status:"200",message:"Register succesful."})
  }else{
    res.json({status:"409",message:"Username already in use."})
  }
}

export const login = async (req:Request, res: Response) => {
  const username = req.query.username;
  const password = req.query.password;
  const db: Db = req.app.get("db");
  const user = await db.collection("Registered_Users").findOne({user: username, password: password});
  const token = uuidv4();
  await db.collection("Registered_Users").findOneAndUpdate({user: username},{'$set' : {token:token}});
  if(user){
    res.json({status:"200",message:"Login succesful",token:token})
  }else{
    res.json({status:404,message:"Wrong user or password."})
  }
}

export const signOut = async (req:Request, res: Response) => {
  const token = req.headers.token;
  const db: Db = req.app.get("db");
  const user = await db.collection("Registered_Users").findOne({token: token});
  if(user){
    await db.collection("Registered_Users").findOneAndUpdate({token: token},{'$set' : {token:null}});
    res.json({status:"200",message:"SignOut succesful"})
  }else{
    res.json({status:404,message:"User not found"})
  }
}

export const updateState = async (req:Request, res: Response) => {
  const id = req.params.id;
  const db: Db = req.app.get("db");
  const char = await db.collection("Characters").findOne({ id: parseInt(id) });
  if (char){
    if(char['status'] === "Alive"){
      await db.collection("Characters").findOneAndUpdate({id: parseInt(id)},{'$set' : {status:"Dead"}});
      const character = await db.collection("Characters").findOne({ id: parseInt(id) });
      res.status(200).json(character)
    }else{
      await db.collection("Characters").findOneAndUpdate({id: parseInt(id)},{'$set' : {status:"Alive"}});
      const character = await db.collection("Characters").findOne({ id: parseInt(id) });
      res.status(200).json(character)
    }
  }
  else res.status(404).json({status:404,message:"Character not found."})
  
}

export const deleteUser = async (req:Request, res: Response) => {
  const token = req.headers.token;
  const db: Db = req.app.get("db");
  const user = await db.collection("Registered_Users").findOne({token: token});
  if(user){
    await db.collection("Registered_Users").findOneAndDelete({token: token});
    res.json({status:"200",message:"User deleted"})
  }else{
    res.json({status:404,message:"User not found."})
  }
}


