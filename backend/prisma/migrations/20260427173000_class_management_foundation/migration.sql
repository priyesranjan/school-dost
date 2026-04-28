CREATE TABLE "SchoolClass" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "grade" INTEGER NOT NULL,
  "classTeacher" TEXT,
  "academicYear" TEXT NOT NULL,
  "room" TEXT,
  "color" TEXT NOT NULL DEFAULT 'slate',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ClassSection" (
  "id" BIGSERIAL PRIMARY KEY,
  "classId" BIGINT NOT NULL,
  "name" TEXT NOT NULL,
  "capacity" INTEGER NOT NULL DEFAULT 40,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClassSection_classId_fkey" FOREIGN KEY ("classId") REFERENCES "SchoolClass"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "SchoolClass_name_academicYear_key" ON "SchoolClass"("name", "academicYear");
CREATE INDEX "SchoolClass_grade_idx" ON "SchoolClass"("grade");
CREATE INDEX "SchoolClass_academicYear_idx" ON "SchoolClass"("academicYear");

CREATE UNIQUE INDEX "ClassSection_classId_name_key" ON "ClassSection"("classId", "name");
CREATE INDEX "ClassSection_classId_idx" ON "ClassSection"("classId");
