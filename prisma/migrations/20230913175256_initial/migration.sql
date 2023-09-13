-- CreateTable
CREATE TABLE "Summary" (
    "id" STRING NOT NULL,
    "text" STRING NOT NULL,
    "projectName" STRING NOT NULL,

    CONSTRAINT "Summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "username" STRING NOT NULL,
    "password" STRING NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Summary_text_key" ON "Summary"("text");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
