import {StreamChat} from "stream-chat";
import { ENV } from "./env.js";


const StreamClient=StreamChat.getInstance(ENV.STREAM_API_KEY,ENV.STREAM_API_SECRET);

export const upsertStreamUser=async(userData)=>{
    try {
        await StreamClient.upsertUser(userData);
        console.log("Stream user upserted Successfully:",userData.name);
        return userData;
    } catch (error) {
        console.error("Error upserting Stream user:",error.message);
        return null;
    
    }
}

export const deleteStreamUser=async(userId)=>{
    try {
        await StreamClient.deleteUser(userId);
        console.log("Stream user deleted Successfully:",userId);
        return true;
    } catch (error) {
        console.error("Error deleting Stream user:",error.message);
        return false;
    
    }
}

export const generateStreamToken=async(userId)=>{
    try {
        const userIdString=userId.toString();
        return  StreamClient.createToken(userIdString);
    } catch (error) {
        console.log("Error creating Stream token:",error.message);
        return null;
    
    }
}