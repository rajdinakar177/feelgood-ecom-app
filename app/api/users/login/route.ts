import { connect } from "@/app/dbConfig/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/userModel";
import jwt from "jsonwebtoken";


export async function POST(request: NextRequest) {
   await connect();
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    // 1. Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const tokenData = {
      id: user._id,
      email: user.email,
      username: user.firstName,
      role: user.role,
    }

    const secret = process.env.TOKEN_SECRET;
if (!secret) {
  throw new Error("TOKEN_SECRET is not defined");
}
    // 3. Generate JWT token
    const token = jwt.sign(tokenData, secret
      , { expiresIn: "1h" });


    // 3. Success response (DO NOT send password)
    const response =  NextResponse.json({
      message: "Login successful",
      success: true,
    });

     response.cookies.set("token", token,{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 hour
     })

     return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}