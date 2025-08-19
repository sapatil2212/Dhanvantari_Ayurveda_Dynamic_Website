-- CreateTable
CREATE TABLE `HotelInfo` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT 'Dhanvantari Ayurvedic Clinic',
    `tagline` VARCHAR(191) NULL DEFAULT 'Authentic Ayurvedic Healing',
    `description` VARCHAR(191) NULL DEFAULT 'Traditional Panchkarma treatments and personalized wellness solutions',
    `phone` VARCHAR(191) NULL DEFAULT '+91 99211 18724',
    `email` VARCHAR(191) NULL DEFAULT 'dhanvantariayurvedansk@gmail.com',
    `website` VARCHAR(191) NULL DEFAULT 'https://dhanvantariayurveda.com',
    `address` VARCHAR(191) NULL DEFAULT 'Dhanvantari Ayurveda Building',
    `city` VARCHAR(191) NULL DEFAULT 'Ojhar',
    `state` VARCHAR(191) NULL DEFAULT 'Maharashtra',
    `pincode` VARCHAR(191) NULL DEFAULT '422206',
    `landmark` VARCHAR(191) NULL DEFAULT 'Saikheda Phata, near Khanderao mandir',
    `workingHours` VARCHAR(191) NULL DEFAULT 'Monday - Saturday: 9:00 AM - 7:00 PM',
    `emergencyContact` VARCHAR(191) NULL,
    `facebook` VARCHAR(191) NULL,
    `instagram` VARCHAR(191) NULL,
    `twitter` VARCHAR(191) NULL,
    `youtube` VARCHAR(191) NULL,
    `headerLogo` VARCHAR(191) NULL DEFAULT '/assets/logo/logo.png',
    `footerLogo` VARCHAR(191) NULL DEFAULT '/assets/logo/logo.png',
    `favicon` VARCHAR(191) NULL DEFAULT '/assets/logo/logo.png',
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` VARCHAR(191) NULL,
    `metaKeywords` VARCHAR(191) NULL,
    `gstNumber` VARCHAR(191) NULL,
    `licenseNumber` VARCHAR(191) NULL,
    `registrationNumber` VARCHAR(191) NULL,
    `updatedById` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HotelInfo` ADD CONSTRAINT `HotelInfo_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
