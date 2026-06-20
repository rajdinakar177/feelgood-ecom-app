import { NextResponse } from "next/server";


export async function GET(){

    try {
        const response = NextResponse.json({
            message: "Logout successful",
            success: true,
        })
       
        response.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0, // Expire immediately
        })

        return response;
        
    } catch (error) {
        return NextResponse.json(
            { error: "Logout failed" },
            { status: 500 }
          );
    }
}