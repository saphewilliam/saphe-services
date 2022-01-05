/*
  Warnings:

  - You are about to drop the column `secret` on the `App` table. All the data in the column will be lost.
  - Added the required column `clientId` to the `App` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientSecret` to the `App` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OAuthProvider" AS ENUM ('DISCORD', 'FACEBOOK', 'GITHUB', 'GOOGLE', 'INSTAGRAM', 'TIKTOK');

-- AlterTable
ALTER TABLE "App" DROP COLUMN "secret",
ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "clientSecret" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AuthConfig" ADD COLUMN     "DiscordClientId" TEXT,
ADD COLUMN     "DiscordClientSecret" TEXT,
ADD COLUMN     "FacebookClientId" TEXT,
ADD COLUMN     "FacebookClientSecret" TEXT,
ADD COLUMN     "GitHubClientId" TEXT,
ADD COLUMN     "GitHubClientSecret" TEXT,
ADD COLUMN     "GoogleClientId" TEXT,
ADD COLUMN     "GoogleClientSecret" TEXT,
ADD COLUMN     "InstagramClientId" TEXT,
ADD COLUMN     "InstagramClientSecret" TEXT,
ADD COLUMN     "TikTokClientId" TEXT,
ADD COLUMN     "TikTokClientSecret" TEXT,
ADD COLUMN     "accessExpires" INTEGER,
ADD COLUMN     "refreshExpires" INTEGER;

-- CreateTable
CREATE TABLE "Visitor" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "appId" TEXT NOT NULL,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "data" JSONB,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "ref" TEXT NOT NULL,
    "blocked" TEXT,
    "appId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "provider" "OAuthProvider" NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh" TEXT NOT NULL,
    "access" TEXT,
    "expiresAt" INTEGER,
    "tokenType" TEXT,
    "scope" TEXT NOT NULL,
    "idToken" TEXT NOT NULL,
    "sessionState" TEXT NOT NULL,
    "oauthTokenSecret" TEXT NOT NULL,
    "oauthToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessToken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "value" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "AccessToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "value" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "value" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "EmailVerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_token_key" ON "Visitor"("token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_appId_ref_key" ON "User"("appId", "ref");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "AccessToken_value_key" ON "AccessToken"("value");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_value_key" ON "RefreshToken"("value");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_value_key" ON "EmailVerificationToken"("value");

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessToken" ADD CONSTRAINT "AccessToken_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
