-- CreateEnum
CREATE TYPE "DishCategory" AS ENUM ('RICE', 'NOODLE', 'SOUP', 'SNACK', 'DRINK', 'OTHER');

-- CreateTable
CREATE TABLE "Dish" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "category" "DishCategory" NOT NULL,
    "description" TEXT,
    "spiceLevel" INTEGER NOT NULL DEFAULT 0,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dish_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dish_slug_key" ON "Dish"("slug");
CREATE INDEX "Dish_category_idx" ON "Dish"("category");
CREATE INDEX "Dish_isActive_idx" ON "Dish"("isActive");
CREATE INDEX "Dish_name_idx" ON "Dish"("name");
