import { connect } from "@/app/dbConfig/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/userModel";
import { sendEmail } from "@/app/emails/templates/sendEmail";
import { resetPasswordTemplate } from "@/app/emails/templates/resetPassword";


export async function POST(request: NextRequest) {
    try {
        await connect();

        const reqBody = await request.json();

        const { email } = reqBody;

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            return NextResponse.json(
                { error: "user not found" },
                { status: 400 }
            );
        }

        const resetToken = await bcrypt.hash(
            user._id.toString(),
            10
        );

        await User.findByIdAndUpdate(user._id, {
            forgotPasswordToken: resetToken,
            forgotPasswordTokenExpiry: Date.now() + 3600000,
        });

        const resetUrl =
            `${process.env.DOMAIN}/resetpassword?token=${resetToken}`;

        const html = resetPasswordTemplate(
            user.firstName,
            resetUrl
        );

        await sendEmail({
            email: normalizedEmail,
            subject: "Reset Password",
            htmlContent: html,
        });
        return NextResponse.json(
            { message: "Email sent successfully" },
            { status: 200 }
        );


    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
