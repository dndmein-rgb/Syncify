import {useState,useEffect} from 'react';
import { StreamChat } from 'stream-chat';
import { getStreamToken } from '../lib/api';
import { useUser } from '@clerk/clerk-react';
import {useQuery} from '@tanstack/react-query';
import * as Sentry from "@sentry/react";
const streamApiKey=import.meta.env.VITE_STREAM_API_KEY;

export const useStreamChat=()=>{
    const {user}=useUser();
    const [chatClient, setChatClient] = useState(null);

    //fetch stream token using react query
    const {data:tokenData,isLoading:tokenLoading,error:tokenError}=useQuery({
        queryKey:["streamToken"],
        queryFn: getStreamToken,
        enabled: !!user?.id, //only run this query if user is available//!!converts to boolean



    });
    useEffect(()=>{
    const initChat=async()=>{
        if(!tokenData?.token || !user) return;
        try {
            const client=StreamChat.getInstance(streamApiKey);
            await client.connectUser({
                id:user.id,
                name:user.fullName,
                image:user.imageUrl
          })
        } catch (error) {
            console.log("Error connecting to Stream Chat:",error);
        }
    }
    initChat();
    return()=>{
        if(chatClient) chatClient.disconnectUser();}
    },[tokenData,user,chatClient]);
    return {chatClient,isLoading:tokenLoading,error:tokenError};
}