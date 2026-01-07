select * from Users 

select * from Tasks 

Update Users
set Role = 'Admin' 
where UserId=3

ALTER TABLE Users ADD IsDeleted BIT NOT NULL DEFAULT 0;
ALTER TABLE Users ADD DeletedAt DATETIME NULL;

ALTER TABLE Tasks ADD IsDeleted BIT NOT NULL DEFAULT 0;
ALTER TABLE Tasks ADD DeletedAt DATETIME NULL;


ALTER TABLE Users
ADD RefreshToken NVARCHAR(500) NULL,
    RefreshTokenExpiry DATETIME NULL;