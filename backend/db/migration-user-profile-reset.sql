-- Adds profile + password-reset columns if they are missing (safe to re-run).
-- If you already saw ERROR 1060 Duplicate column, your DB is up to date — you can ignore it.
--
-- Usage: mysql -u root -p bookingproject < db/migration-user-profile-reset.sql

SET @db = DATABASE();

SELECT COUNT(*) INTO @c FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'user' AND COLUMN_NAME = 'profileImageUrl';
SET @sql = IF(@c = 0,
  'ALTER TABLE `user` ADD COLUMN `profileImageUrl` mediumtext NULL AFTER `role`',
  'SELECT 1');
PREPARE s1 FROM @sql; EXECUTE s1; DEALLOCATE PREPARE s1;

SELECT COUNT(*) INTO @c FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'user' AND COLUMN_NAME = 'passwordResetToken';
SET @sql = IF(@c = 0,
  'ALTER TABLE `user` ADD COLUMN `passwordResetToken` varchar(64) NULL DEFAULT NULL AFTER `profileImageUrl`',
  'SELECT 1');
PREPARE s2 FROM @sql; EXECUTE s2; DEALLOCATE PREPARE s2;

SELECT COUNT(*) INTO @c FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'user' AND COLUMN_NAME = 'passwordResetExpires';
SET @sql = IF(@c = 0,
  'ALTER TABLE `user` ADD COLUMN `passwordResetExpires` datetime NULL DEFAULT NULL AFTER `passwordResetToken`',
  'SELECT 1');
PREPARE s3 FROM @sql; EXECUTE s3; DEALLOCATE PREPARE s3;

SELECT COUNT(*) INTO @c FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'user' AND INDEX_NAME = 'idx_password_reset';
SET @sql = IF(@c = 0,
  'ALTER TABLE `user` ADD KEY `idx_password_reset` (`passwordResetToken`)',
  'SELECT 1');
PREPARE s4 FROM @sql; EXECUTE s4; DEALLOCATE PREPARE s4;
