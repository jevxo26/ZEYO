"use client";
import { logout, restoreUser } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/store";
import { useEffect } from "react";

export function AuthInitializer(){
    const dispatch=useAppDispatch();
    useEffect(()=>{
        async function loadUser(){
            const token = localStorage.getItem("token")
            if(!token)
                return;
            try{
                const res=await fetch("/api/auth/me",{
                    headers:{Authorization:`Bearer ${token}`},
                });
                const data=await res.json
();
if(data.success){
    dispatch(restoreUser(data.data.user ?? data.data))
}
else {
    dispatch(logout());
}
            }
catch{
    dispatch(logout());
}
            }
        loadUser()
    },[dispatch])
    return null;
}