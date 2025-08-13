-- DropForeignKey
ALTER TABLE `Allergy` DROP FOREIGN KEY `Allergy_recordedById_fkey`;

-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `Encounter` DROP FOREIGN KEY `Encounter_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `FamilyHistory` DROP FOREIGN KEY `FamilyHistory_recordedById_fkey`;

-- DropForeignKey
ALTER TABLE `InventoryItem` DROP FOREIGN KEY `InventoryItem_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `InventoryTransaction` DROP FOREIGN KEY `InventoryTransaction_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `Invoice` DROP FOREIGN KEY `Invoice_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `Lifestyle` DROP FOREIGN KEY `Lifestyle_recordedById_fkey`;

-- DropForeignKey
ALTER TABLE `MedicalHistory` DROP FOREIGN KEY `MedicalHistory_recordedById_fkey`;

-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Patient` DROP FOREIGN KEY `Patient_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_processedById_fkey`;

-- DropForeignKey
ALTER TABLE `Prescription` DROP FOREIGN KEY `Prescription_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `PurchaseOrder` DROP FOREIGN KEY `PurchaseOrder_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `Vital` DROP FOREIGN KEY `Vital_recordedById_fkey`;

-- DropIndex
DROP INDEX `Allergy_recordedById_fkey` ON `Allergy`;

-- DropIndex
DROP INDEX `Appointment_createdById_fkey` ON `Appointment`;

-- DropIndex
DROP INDEX `Encounter_createdById_fkey` ON `Encounter`;

-- DropIndex
DROP INDEX `FamilyHistory_recordedById_fkey` ON `FamilyHistory`;

-- DropIndex
DROP INDEX `InventoryItem_createdById_fkey` ON `InventoryItem`;

-- DropIndex
DROP INDEX `InventoryTransaction_createdById_fkey` ON `InventoryTransaction`;

-- DropIndex
DROP INDEX `Invoice_createdById_fkey` ON `Invoice`;

-- DropIndex
DROP INDEX `Lifestyle_recordedById_fkey` ON `Lifestyle`;

-- DropIndex
DROP INDEX `MedicalHistory_recordedById_fkey` ON `MedicalHistory`;

-- DropIndex
DROP INDEX `Patient_createdById_fkey` ON `Patient`;

-- DropIndex
DROP INDEX `Payment_processedById_fkey` ON `Payment`;

-- DropIndex
DROP INDEX `Prescription_createdById_fkey` ON `Prescription`;

-- DropIndex
DROP INDEX `PurchaseOrder_createdById_fkey` ON `PurchaseOrder`;

-- DropIndex
DROP INDEX `Vital_recordedById_fkey` ON `Vital`;

-- AlterTable
ALTER TABLE `Allergy` MODIFY `recordedById` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Appointment` MODIFY `createdById` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Encounter` MODIFY `createdById` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `FamilyHistory` MODIFY `recordedById` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `InventoryItem` MODIFY `createdById` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `InventoryTransaction` MODIFY `createdById` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Invoice` MODIFY `createdById` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Lifestyle` MODIFY `recordedById` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `MedicalHistory` MODIFY `recordedById` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Notification` MODIFY `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Patient` MODIFY `createdById` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Payment` MODIFY `processedById` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Prescription` MODIFY `createdById` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `PurchaseOrder` ADD COLUMN `supplierId` VARCHAR(191) NULL,
    MODIFY `createdById` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Vital` MODIFY `recordedById` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `OTPToken` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `otp` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `OTPToken_email_type_idx`(`email`, `type`),
    INDEX `OTPToken_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enquiry` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `service` VARCHAR(191) NULL,
    `message` VARCHAR(191) NULL,
    `status` ENUM('NEW', 'IN_PROGRESS', 'CONTACTED', 'CONVERTED', 'CLOSED', 'SPAM') NOT NULL DEFAULT 'NEW',
    `source` ENUM('WEBSITE_CONTACT', 'WEBSITE_APPOINTMENT', 'PHONE', 'EMAIL', 'WALK_IN', 'REFERRAL', 'SOCIAL_MEDIA', 'OTHER') NOT NULL DEFAULT 'WEBSITE_CONTACT',
    `priority` VARCHAR(191) NOT NULL DEFAULT 'normal',
    `assignedTo` VARCHAR(191) NULL,
    `assignedBy` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `followUpDate` DATETIME(3) NULL,
    `convertedToPatient` VARCHAR(191) NULL,
    `convertedToAppointment` VARCHAR(191) NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Enquiry_status_idx`(`status`),
    INDEX `Enquiry_source_idx`(`source`),
    INDEX `Enquiry_assignedTo_idx`(`assignedTo`),
    INDEX `Enquiry_createdAt_idx`(`createdAt`),
    INDEX `Enquiry_email_idx`(`email`),
    INDEX `Enquiry_phone_idx`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `contactPerson` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdById` VARCHAR(191) NULL,
    `updatedById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Supplier_name_idx`(`name`),
    INDEX `Supplier_email_idx`(`email`),
    INDEX `Supplier_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `PurchaseOrder_supplierId_idx` ON `PurchaseOrder`(`supplierId`);

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Patient` ADD CONSTRAINT `Patient_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Encounter` ADD CONSTRAINT `Encounter_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vital` ADD CONSTRAINT `Vital_recordedById_fkey` FOREIGN KEY (`recordedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Allergy` ADD CONSTRAINT `Allergy_recordedById_fkey` FOREIGN KEY (`recordedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalHistory` ADD CONSTRAINT `MedicalHistory_recordedById_fkey` FOREIGN KEY (`recordedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FamilyHistory` ADD CONSTRAINT `FamilyHistory_recordedById_fkey` FOREIGN KEY (`recordedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lifestyle` ADD CONSTRAINT `Lifestyle_recordedById_fkey` FOREIGN KEY (`recordedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_processedById_fkey` FOREIGN KEY (`processedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prescription` ADD CONSTRAINT `Prescription_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryItem` ADD CONSTRAINT `InventoryItem_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryTransaction` ADD CONSTRAINT `InventoryTransaction_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrder` ADD CONSTRAINT `PurchaseOrder_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrder` ADD CONSTRAINT `PurchaseOrder_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enquiry` ADD CONSTRAINT `Enquiry_assignedTo_fkey` FOREIGN KEY (`assignedTo`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enquiry` ADD CONSTRAINT `Enquiry_assignedBy_fkey` FOREIGN KEY (`assignedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enquiry` ADD CONSTRAINT `Enquiry_convertedToPatient_fkey` FOREIGN KEY (`convertedToPatient`) REFERENCES `Patient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enquiry` ADD CONSTRAINT `Enquiry_convertedToAppointment_fkey` FOREIGN KEY (`convertedToAppointment`) REFERENCES `Appointment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supplier` ADD CONSTRAINT `Supplier_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supplier` ADD CONSTRAINT `Supplier_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
