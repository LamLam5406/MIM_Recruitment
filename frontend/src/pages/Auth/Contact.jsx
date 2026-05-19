import React from 'react';

function Contact() {
  return (
    // Đã bỏ pb-20 và thêm pt-6 để đẩy sát nội dung lên trên
    <div className="font-sans bg-slate-50 min-h-screen pt-6 pb-12">
      
      {/* Đã bỏ mt-16 để tránh khoảng trống lớn ở trên */}
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-25">
          
          {/* ==============================
              CỘT TRÁI: FORM LIÊN HỆ 
              ============================== */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-100 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Gửi phản hồi</h3>
              <p className="text-slate-500 text-sm">Mọi thắc mắc hoặc góp ý, vui lòng điền vào biểu mẫu bên dưới. Chúng tôi sẽ phản hồi sớm nhất.</p>
            </div>
            
            <form className="space-y-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Họ và tên của bạn" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#007db3] focus:border-[#007db3] outline-none text-slate-800 transition-all font-medium text-sm"
                />
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="Email liên hệ" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#007db3] focus:border-[#007db3] outline-none text-slate-800 transition-all font-medium text-sm"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  placeholder="Tiêu đề cần hỗ trợ" 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#007db3] focus:border-[#007db3] outline-none text-slate-800 transition-all font-medium text-sm"
                />
              </div>
              <div>
                <textarea 
                  rows="3" 
                  placeholder="Nội dung tin nhắn chi tiết..." 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#007db3] focus:border-[#007db3] outline-none text-slate-800 transition-all resize-none font-medium text-sm"
                ></textarea>
              </div>
              
              <button
                type="button"
                onClick={() => alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.")}
                className="w-full py-3 bg-[#007db3] text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-200/50 flex justify-center items-center gap-2 mt-2 text-sm"
              >
                GỬI TIN NHẮN
              </button>
            </form>
          </div>

          {/* ==============================
              CỘT PHẢI: THÔNG TIN & MAP 
              ============================== */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col">
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-5">Thông tin liên lạc</h3>
            
            <ul className="space-y-4 mb-6 text-slate-600">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#007db3] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-0.5">Địa chỉ</p>
                  <p className="font-semibold text-slate-700 text-sm">334 Nguyễn Trãi, Thanh Xuân, Hà Nội</p>
                </div>
              </li>
              
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#007db3] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-0.5">Điện thoại</p>
                  <p className="font-semibold text-slate-700 text-sm">(024) 3858 4615</p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#007db3] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-0.5">Email</p>
                  <p className="font-semibold text-slate-700 text-sm">admin@hus.edu.vn</p>
                </div>
              </li>
            </ul>

            {/* Bản đồ */}
            <div className="mt-auto rounded-2xl overflow-hidden border border-slate-200 shadow-inner h-[180px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.636683266224!2d105.80373261533196!3d20.99903339396781!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acbd8648e775%3A0x6b2e1b8b29c91f69!2zMzM0IMSQLiBOZ3V54buFbiBUcsOjaSwgVGhhbmggWHXDom4gVHJ1bmcsIFRoYW5oIFh1w6JuLCBIw6AgTuG7mWksIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1644912345678!5m2!1sen!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                allowFullScreen="" 
                loading="lazy"
                title="Bản đồ chỉ đường"
              ></iframe>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Contact;