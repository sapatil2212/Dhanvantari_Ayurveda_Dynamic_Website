-- AlterTable
ALTER TABLE `appointment` MODIFY `status` ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'MISSED') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('CREATED', 'UPDATED', 'STATUS_CHANGED', 'DELETED') NOT NULL,
    `appointmentId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notification_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
