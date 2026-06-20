import { connect } from "@/app/dbConfig/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/userModel";

export async function POST(request: NextRequest) {
  try {
    await connect();

    // Request body
    const reqBody = await request.json();
    const { token, password } = reqBody;

    // Validation
    if (!token || !password) {
      return NextResponse.json(
        {
          error: "Token and new password are required",
        },
        {
          status: 400,
        }
      );
    }

    // Find user with valid token
    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: {
        $gt: Date.now(),
      },
    });

    // Invalid token
    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid or expired reset token",
        },
        {
          status: 400,
        }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    

    // Update password
    user.password = hashedPassword;

    // Remove reset token after successful reset
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password updated successfully 🎉",
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}