CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO "User" ("id", "createdAt", "updatedAt", "email", "password", "roles", "isFirstLogin", "name") 
VALUES 
  (
    uuid_generate_v4(), 
    now(), 
    now(), 
    'msdo.admin@cit.edu', 
    '$2a$10$vlr1Y8.hCgIPRZaBvh4a2u0494oX/3GtuDluSMVslbz7Y6IlsfaVS', 
    ARRAY['STAFF', 'ADMIN']::"Role"[], 
    true, 
    'MSDO Admin'),
  (uuid_generate_v4(), 
    now(), 
    now(), 
    'msdo.staff@cit.edu', 
    '$2a$10$Mi9f5d2lzitev6bGNFEQQOv2VwrZtH7Lk1tYNVaiR203fmz7B0TSq', 
    ARRAY['STAFF']::"Role"[], 
    true, 
    'MSDO Staff'),
  (uuid_generate_v4(), 
    now(), 
    now(), 
    'msdo.organizer@cit.edu', 
    '$2a$10$8XuXs8dI2/M.J8fqWcfLQe/44Mux57iGdRMgYrN7g1yu/XqplaR9C', 
    ARRAY['ORGANIZER']::"Role"[], 
    true, 
    'MSDO Organizer');


