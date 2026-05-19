require('dotenv').config();
const db = require("./models");
const bcrypt = require('bcrypt');
const { fakerVI: faker } = require('@faker-js/faker'); 

const seed = async () => {
  try {
    console.log("🔄 Đang kết nối và làm sạch Database (Force Sync)...");
    await db.sequelize.sync({ force: true }); 

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash("123456", salt);

    console.log("🌱 Đang tạo dữ liệu mẫu...");

    // ==========================================
    // 1. TẠO TÀI KHOẢN ADMIN (1 Tài khoản)
    // ==========================================
    await db.User.create({
      email: "admin@test.com",
      password: hashPassword,
      role: "admin",
      is_active: true
    });
    console.log("✅ Đã tạo 1 Admin (admin@test.com)");

    const LOCATIONS = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng"];
    const INDUSTRIES = ["IT - Phần mềm", "Kinh doanh / Bán hàng", "Marketing / PR", "Kế toán / Kiểm toán", "Thiết kế đồ họa", "Kỹ thuật / Cơ khí"];
    const LEVELS = ["Intern", "Fresher", "Junior", "Senior"];
    const JOB_TYPES = ["Full-time", "Part-time", "Remote"];
    const SALARIES = ["Thỏa thuận", "Dưới 10 triệu", "10 - 20 triệu", "Trên 20 triệu"];
    const MAJORS = ["Công nghệ thông tin", "An toàn thông tin", "Khoa học máy tính", "Kinh tế", "Marketing"];

    // ==========================================
    // 2. TẠO TÀI KHOẢN COMPANY (10 Tài khoản)
    // ==========================================
    const createdCompanies = [];
    for (let i = 1; i <= 10; i++) {
      const user = await db.User.create({
        email: `company${i}@test.com`,
        password: hashPassword,
        role: "company",
        is_active: true
      });

      await db.CompanyProfile.create({
        user_id: user.id,
        company_name: `Công ty ${faker.company.name()}`,
        address: faker.helpers.arrayElement(LOCATIONS),
        size: faker.helpers.arrayElement(["10-50", "50-200", "200-500", "1000+"]),
        industry: faker.helpers.arrayElement(INDUSTRIES),
        website: `https://${faker.internet.domainName()}`,
        description: faker.lorem.paragraphs(2)
      });
      createdCompanies.push(user);
    }
    console.log("✅ Đã tạo 10 Công ty (company1@test.com -> company10@test.com)");

    // ==========================================
    // 3. TẠO TÀI KHOẢN STUDENT (10 Tài khoản)
    // ==========================================
    const createdStudents = [];
    for (let i = 1; i <= 10; i++) {
      const user = await db.User.create({
        email: `student${i}@test.com`,
        password: hashPassword,
        role: "student",
        is_active: true
      });

      // Gắn tên cố định cho student1 để dễ dàng test luồng Apply
      const studentName = (i === 1) ? "Tùng Châu" : faker.person.fullName();

      await db.StudentProfile.create({
        user_id: user.id,
        full_name: studentName,
        phone: faker.phone.number('09########'),
        gender: faker.helpers.arrayElement(["Nam", "Nữ"]),
        university: "Đại học " + faker.location.city(),
        major: faker.helpers.arrayElement(MAJORS),
        gpa: faker.number.float({ min: 2.5, max: 4.0, fractionDigits: 2 }),
        skills: "ReactJS, NodeJS, SQL, Giao tiếp tốt",
        cv_url: "uploads/dummy_cv.pdf", 
        bio: faker.lorem.paragraph()
      });
      createdStudents.push(user);
    }
    console.log("✅ Đã tạo 10 Sinh viên (student1@test.com -> student10@test.com)");

    // ==========================================
    // 4. TẠO JOBS (20 Jobs, mỗi cty 2 jobs)
    // ==========================================
    const allJobs = [];
    for (const company of createdCompanies) {
      for (let j = 1; j <= 2; j++) {
        const level = faker.helpers.arrayElement(LEVELS);
        const job = await db.Job.create({
          company_id: company.id,
          title: `Tuyển dụng ${faker.person.jobTitle()} (${level})`,
          description: faker.lorem.paragraphs(2) + "\n\n- Cơ hội thăng tiến cao\n- Môi trường trẻ trung",
          requirements: "- Kinh nghiệm 6 tháng trở lên\n- Có tinh thần trách nhiệm\n- " + faker.lorem.sentence(),
          salary_range: faker.helpers.arrayElement(SALARIES),
          location: faker.helpers.arrayElement(LOCATIONS),
          level: level,
          job_type: faker.helpers.arrayElement(JOB_TYPES),
          deadline: faker.date.future({ years: 0.2 }), 
          status: "open"
        });
        allJobs.push(job);
      }
    }
    console.log(`✅ Đã tạo ${allJobs.length} Công việc.`);

    // ==========================================
    // 5. TẠO DỮ LIỆU APPLY JOBS (Ứng tuyển)
    // ==========================================
    const applyStatuses = ['pending', 'accepted', 'rejected'];
    let applyCount = 0;

    for (const student of createdStudents) {
      const randomJobs = faker.helpers.arrayElements(allJobs, 3);
      for (const job of randomJobs) {
        await db.ApplyJob.create({
          student_id: student.id,
          job_id: job.id,
          cv_snapshot: "uploads/dummy_cv.pdf",
          cover_letter: faker.lorem.sentence(),
          status: faker.helpers.arrayElement(applyStatuses)
        });
        applyCount++;
      }
    }
    console.log(`✅ Đã tạo ${applyCount} lượt Ứng tuyển mẫu.`);

    // ==========================================
    // 6. TẠO TIN TỨC (5 Bài News)
    // ==========================================
    for (let i = 1; i <= 5; i++) {
      await db.News.create({
        title: `[Góc Tuyển Dụng] Bí kíp chinh phục nhà tuyển dụng số ${i}`,
        content: faker.lorem.paragraphs(4),
        author: "Ban Quản Trị"
      });
    }
    console.log("✅ Đã tạo 5 bài Tin tức.");

    console.log("\n=======================================================");
    console.log("🎉 SEED DATA THÀNH CÔNG! HỆ THỐNG ĐÃ SẴN SÀNG 🎉");
    console.log("🔑 TẤT CẢ MẬT KHẨU LÀ: 123456");
    console.log("-------------------------------------------------------");
    console.log("👉 Admin   : admin@test.com");
    console.log("👉 Company : company1@test.com (đến company10@test.com)");
    console.log("👉 Student : student1@test.com (Tùng Châu) đến student10@test.com");
    console.log("=======================================================\n");
    
    process.exit();
  } catch (e) {
    console.log("❌ Lỗi khi chạy seed:", e);
    process.exit(1);
  }
};

seed();