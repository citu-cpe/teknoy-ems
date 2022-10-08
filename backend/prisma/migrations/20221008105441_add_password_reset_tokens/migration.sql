-- CreateTable
CREATE TABLE "PasswordResetTokens" (
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "PasswordResetTokens_pkey" PRIMARY KEY ("userId","token")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetTokens_token_key" ON "PasswordResetTokens"("token");

-- AddForeignKey
ALTER TABLE "PasswordResetTokens" ADD CONSTRAINT "PasswordResetTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
