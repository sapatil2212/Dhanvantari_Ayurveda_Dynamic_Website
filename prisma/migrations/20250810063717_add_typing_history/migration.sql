/*
  Warnings:

  - You are about to drop the column `prescriptions` on the `encounter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `encounter` DROP COLUMN `prescriptions`;

-- CreateTable
CREATE TABLE `Prescription` (
    `id` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `patientId` VARCHAR(191) NOT NULL,
    `encounterId` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diagnosis` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `advice` VARCHAR(191) NULL,
    `followUpDate` DATETIME(3) NULL,
    `prescriberName` VARCHAR(191) NOT NULL,
    `prescriberRegNo` VARCHAR(191) NULL,
    `shareCode` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Prescription_number_key`(`number`),
    UNIQUE INDEX `Prescription_shareCode_key`(`shareCode`),
    INDEX `Prescription_patientId_date_idx`(`patientId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PrescriptionItem` (
    `id` VARCHAR(191) NOT NULL,
    `prescriptionId` VARCHAR(191) NOT NULL,
    `medicineName` VARCHAR(191) NOT NULL,
    `strength` VARCHAR(191) NULL,
    `dosage` VARCHAR(191) NULL,
    `frequency` VARCHAR(191) NULL,
    `route` VARCHAR(191) NULL,
    `durationDays` INTEGER NULL,
    `instructions` VARCHAR(191) NULL,

    INDEX `PrescriptionItem_prescriptionId_idx`(`prescriptionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TypingHistory` (
    `id` VARCHAR(191) NOT NULL,
    `fieldType` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `frequency` INTEGER NOT NULL DEFAULT 1,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `TypingHistory_fieldType_userId_idx`(`fieldType`, `userId`),
    INDEX `TypingHistory_fieldType_frequency_idx`(`fieldType`, `frequency`),
    UNIQUE INDEX `TypingHistory_fieldType_value_userId_key`(`fieldType`, `value`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_patientId_fkey` FOREIGN KEY (`patientId`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_encounterId_fkey` FOREIGN KEY (`encounterId`) REFERENCES `Encounter`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrescriptionItem` ADD CONSTRAINT `PrescriptionItem_prescriptionId_fkey` FOREIGN KEY (`prescriptionId`) REFERENCES `Prescription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
