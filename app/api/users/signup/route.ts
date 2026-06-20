import { connect } from "@/app/dbConfig/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import User from "@/app/models/userModel";

import { sendEmail } from "@/app/emails/templates/sendEmail";
import { verifyEmailTemplate } from "@/app/emails/templates/verifyEmail";
import { Console } from "console";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const reqBody = await request.json();

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    } = reqBody;

    // Validation
    if (!firstName || !email || !password) {
      return NextResponse.json(
        {
          error: "First name, email and password are required",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check email exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Email already registered",
        },
        { status: 400 }
      );
    }

    // Check phone number exists
    if (phoneNumber) {
      const existingPhone = await User.findOne({
        phoneNumber,
      });

      if (existingPhone) {
        return NextResponse.json(
          {
            error: "Phone number already registered",
          },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      firstName,
      lastName,
      email: normalizedEmail,
      phoneNumber,
      password: hashedPassword,
      isVerified: false,
    });

    const savedUser = await newUser.save();

    // Create verification token
    const verifyToken = savedUser._id.toString();

    // Save token
    await User.findByIdAndUpdate(savedUser._id, {
      verifyToken,
      verifyTokenExpiry: Date.now() + 3600000, // 1 hour
    });

    // Verification URL
    const verificationUrl =
      `${process.env.DOMAIN}/verifyemail?token=${verifyToken}`;

   
    const html = verifyEmailTemplate(
      savedUser.firstName,
      verificationUrl
    );



    const emailResponse = await sendEmail({
      email: savedUser.email,
      subject: "Verify Your Email",
      htmlContent: html,
    });


    return NextResponse.json(
      {
        success: true,
        message:
          "Account created successfully. Please verify your email.",
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Signup Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}