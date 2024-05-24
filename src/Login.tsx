import React from 'react'
import supabase from "./config/supabaseClient";
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function Login() {
    const navagte=useNavigate()
supabase.auth.onAuthStateChange(async(event:any)=>{
    if(event!=="SIGNED_OUT"){
        //forwart to home
    }else{
        // for ward to login
        navagte("/")
    }
})

  return (
    <div>Login
<div>
    <Auth
    supabaseClient={supabase}
    appearance={{theme:ThemeSupa}}
    theme='dark'
    providers={["github","google"]}
    />
</div>

    </div>
  )
}
