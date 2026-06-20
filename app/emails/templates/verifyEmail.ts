import  mailGenerator  from "@/app/lib/mailgen";

export const verifyEmailTemplate = (
  firstName: string,
  verificationUrl: string
) => {
  return mailGenerator.generate({
    body: {
      name: firstName,

      intro: "Welcome to SRADA.",

      action: {
        instructions:
          "Please verify your email address to activate your account.",

        button: {
          color: "#f97316",
          text: "Verify Email",
          link: verificationUrl,
        },
      },

      outro:
        "If you did not create this account, you can ignore this email.",
    },
  });
};