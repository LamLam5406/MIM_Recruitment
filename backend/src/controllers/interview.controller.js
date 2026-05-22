const transporter = require('../config/email');

const sendInterviewInvites = async (req, res) => {
    try {
        const { emails, subject, content } = req.body;

        if (!emails || emails.length === 0) {
            return res.status(400).json({ message: 'Danh sách email trống.' });
        }

        const toEmails = emails.join(', ');

        const mailOptions = {
            from: `"Hệ thống Tuyển dụng" <${process.env.EMAIL_USER}>`,
            bcc: toEmails, 
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #0056b3;">Thông báo lịch phỏng vấn</h2>
                    <p>${content.replace(/\n/g, '<br/>')}</p>
                    <hr>
                    <p>Trân trọng,<br><b>Đội ngũ Tuyển dụng</b></p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        
        return res.status(200).json({ message: 'Gửi thông báo thành công!' });
    } catch (error) {
        console.error('Lỗi controller sendInterviewInvites:', error);
        return res.status(500).json({ message: 'Có lỗi xảy ra khi gửi email', error: error.message });
    }
};

module.exports = {
    sendInterviewInvites
};