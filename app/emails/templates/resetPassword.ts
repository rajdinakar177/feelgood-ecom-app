import  mailGenerator  from "@/app/lib/mailgen";

export const resetPasswordTemplate = (
  firstName: string,
  resetUrl: string
) => {
  return mailGenerator.generate({
    body: {
      name: firstName,

      intro: "Password reset request received.",

      action: {
        instructions:
          "Click below to create a new password.",

        button: {
          color: "#f97316",
          text: "Reset Password",
          link: resetUrl,
        },
      },

      outro:
        "Ignore this email if you did not request a password reset.",
    },
  });
};