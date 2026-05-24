DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS room;
DROP TABLE IF EXISTS "user";

CREATE TABLE "user" (
  "userId" SERIAL PRIMARY KEY,
  "firstName" VARCHAR(100),
  "lastName" VARCHAR(100),
  "birthDate" DATE,
  "zipCode" VARCHAR(20),
  "country" VARCHAR(100),
  "phoneNumber" VARCHAR(30),
  "email" VARCHAR(100) UNIQUE NOT NULL,
  "password" VARCHAR(255) NOT NULL,
  "role" VARCHAR(20) NOT NULL DEFAULT 'customer',
  "profileImageUrl" TEXT,
  "passwordResetToken" VARCHAR(64),
  "passwordResetExpires" TIMESTAMP
);

CREATE TABLE room (
  "roomNumber" INT PRIMARY KEY,
  "noOfBeds" INT NOT NULL,
  "status" VARCHAR(50) NOT NULL DEFAULT 'available',
  "pricePerNight" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  "type" VARCHAR(20)
);

CREATE TABLE bookings (
  "bookingId" SERIAL PRIMARY KEY,
  "userId" INT REFERENCES "user"("userId"),
  "roomNumber" INT REFERENCES room("roomNumber"),
  "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
  "fromDate" DATE NOT NULL,
  "toDate" DATE NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "totalCost" DECIMAL(10,2)
);

INSERT INTO room VALUES
(101,1,'available',50.00,'single'),
(102,1,'available',50.00,'single'),
(103,2,'available',85.00,'superior'),
(104,2,'available',85.00,'superior'),
(203,3,'available',120.00,'suite');

INSERT INTO "user"
("firstName","lastName","email","password","role")
VALUES
(
'Abhinav',
'Srinivasan',
'bestabhinav97@gmail.com',
'$2b$12$kXEb2xbTfarEI/7xWgQ.pO9t2k/MCuuiQQA/q5diJoP9xbw6izToS',
'admin'
);