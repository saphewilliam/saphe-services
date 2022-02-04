/*
  Warnings:

  - You are about to drop the column `access` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `idToken` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `oauthToken` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `oauthTokenSecret` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `refresh` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `scope` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `sessionState` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `tokenType` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `DiscordClientId` on the `AuthConfig` table. All the data in the column will be lost.
  - You are about to drop the column `DiscordClientSecret` on the `AuthConfig` table. All the data in the column will be lost.
  - You are about to drop the column `FacebookClientId` on the `AuthConfig` table. All the data in the column will be lost.
  - You are about to drop the column `FacebookClientSecret` on the `AuthConfig` table. All the data in the column will be lost.
  - You are about to drop the column `GitHubClientId` on the `AuthConfig` table. All the data in the column will be lost.
  - You are about to drop the column `GitHubClientSecret` on the `AuthConfig` table. All the data in the column will be lost.
  - You are about to drop the column `GoogleClientId` on the `AuthConfig` table. All the data in the column will be lost.
  - You are about to drop the column `GoogleClientSecret` on the `AuthConfig` table. All the data in the column will be lost.
  - You are about to drop the column `InstagramClientId` on the `AuthConfig` table. All the data in the column will be lost.
  - You are about to drop the column `InstagramClientSecret` on the `AuthConfig` table. All the data in the column will be lost.
  - You are about to drop the column `TikTokClientId` on the `AuthConfig` table. All the data in the column will be lost.
  - You are about to drop the column `TikTokClientSecret` on the `AuthConfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "access",
DROP COLUMN "expiresAt",
DROP COLUMN "idToken",
DROP COLUMN "oauthToken",
DROP COLUMN "oauthTokenSecret",
DROP COLUMN "refresh",
DROP COLUMN "scope",
DROP COLUMN "sessionState",
DROP COLUMN "tokenType",
DROP COLUMN "type";

-- AlterTable
ALTER TABLE "AuthConfig" DROP COLUMN "DiscordClientId",
DROP COLUMN "DiscordClientSecret",
DROP COLUMN "FacebookClientId",
DROP COLUMN "FacebookClientSecret",
DROP COLUMN "GitHubClientId",
DROP COLUMN "GitHubClientSecret",
DROP COLUMN "GoogleClientId",
DROP COLUMN "GoogleClientSecret",
DROP COLUMN "InstagramClientId",
DROP COLUMN "InstagramClientSecret",
DROP COLUMN "TikTokClientId",
DROP COLUMN "TikTokClientSecret",
ADD COLUMN     "discordClientId" TEXT,
ADD COLUMN     "discordClientSecret" TEXT,
ADD COLUMN     "facebookClientId" TEXT,
ADD COLUMN     "facebookClientSecret" TEXT,
ADD COLUMN     "gitHubClientId" TEXT,
ADD COLUMN     "gitHubClientSecret" TEXT,
ADD COLUMN     "googleClientId" TEXT,
ADD COLUMN     "googleClientSecret" TEXT,
ADD COLUMN     "instagramClientId" TEXT,
ADD COLUMN     "instagramClientSecret" TEXT,
ADD COLUMN     "tikTokClientId" TEXT,
ADD COLUMN     "tikTokClientSecret" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT,
ALTER COLUMN "email" DROP NOT NULL;
