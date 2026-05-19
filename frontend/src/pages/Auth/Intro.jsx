import React from 'react';
import oldschool from '../../assets/images/oldschool.webp';
import mission from '../../assets/images/mission.webp';

function Intro() {
  return (
    <div className="font-sans bg-slate-50 min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto space-y-16">
        
        {/* =======================
            LỊCH SỬ HÌNH THÀNH
        ======================= */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-[#007db3] text-base font-bold mb-8 w-max uppercase tracking-wider">
              Lịch sử hình thành
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Đại học Tổng hợp Hà Nội (1956 – 1995)</h3>
                <p className="text-slate-600 text-base leading-relaxed text-justify">
                  Thành lập ngày 04/6/1956, là trường đại học khoa học cơ bản đầu tiên của nước ta. Trong suốt quá trình phát triển, Trường luôn giữ vai trò tiên phong trong đào tạo, là cái nôi của nhiều nhà khoa học đầu ngành, góp phần đặt nền móng cho nền giáo dục đại học Việt Nam.
                </p>
              </div>
              <div className="h-px w-full bg-slate-100"></div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Đại học Khoa học Tự nhiên – ĐHQGHN (từ 1995)</h3>
                <p className="text-slate-600 text-base leading-relaxed text-justify">
                  Kế thừa truyền thống vẻ vang đó, Trường ngày nay là trung tâm đào tạo và nghiên cứu khoa học tự nhiên hàng đầu, không ngừng mở rộng quy mô, nâng cao chất lượng và đẩy mạnh hợp tác quốc tế.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 min-h-[300px] lg:min-h-full bg-slate-100">
            <img src={oldschool} alt="Lịch sử trường" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* =======================
            SỨ MẠNG & TẦM NHÌN
        ======================= */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col-reverse lg:flex-row">
          <div className="lg:w-1/2 min-h-[300px] lg:min-h-full bg-slate-100">
            <img src={mission} alt="Sứ mệnh tầm nhìn" className="w-full h-full object-cover" />
          </div>
          <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-base font-bold mb-8 w-max uppercase tracking-wider">
              Sứ mạng & Tầm nhìn
            </div>
            
            <p className="text-slate-700 text-base font-medium leading-relaxed text-justify mb-8">
              Đào tạo nguồn nhân lực chất lượng cao, bồi dưỡng nhân tài khoa học tự nhiên và công nghệ. Phấn đấu đến năm 2035, một số lĩnh vực lọt top 500 thế giới và lọt top 300 vào năm 2045.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-emerald-700 font-bold mb-2 text-base">Chất lượng xuất sắc</p>
                <p className="text-slate-600 text-sm leading-relaxed">Lấy chất lượng đào tạo & nghiên cứu làm cốt lõi.</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-emerald-700 font-bold mb-2 text-base">Tiên phong sáng tạo</p>
                <p className="text-slate-600 text-sm leading-relaxed">Luôn đi đầu trong việc đổi mới và sáng tạo.</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-emerald-700 font-bold mb-2 text-base">Trách nhiệm xã hội</p>
                <p className="text-slate-600 text-sm leading-relaxed">Gắn liền hoạt động học thuật với lợi ích cộng đồng.</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-emerald-700 font-bold mb-2 text-base">Hợp tác thân thiện</p>
                <p className="text-slate-600 text-sm leading-relaxed">Xây dựng môi trường giáo dục cởi mở, hội nhập.</p>
              </div>
            </div>
          </div>
        </div>

        {/* =======================
            BẢNG VÀNG THÀNH TÍCH
        ======================= */}
        <div>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-50 text-orange-700 text-base font-bold mb-8 uppercase tracking-wider">
            Bảng vàng thành tích
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wide border-b border-slate-100 pb-4">
                Danh hiệu vinh dự
              </h3>
              <ul className="space-y-4 list-disc marker:text-orange-500 pl-5">
                {[
                  'Anh hùng Lao động thời kỳ đổi mới (2000, 2014, 2020)',
                  'Cờ thi đua Chính phủ vì thành tích xuất sắc, dẫn đầu phong trào (2012-2015)'
                ].map((item, idx) => (
                  <li key={idx} className="text-slate-700 text-base leading-relaxed pl-1">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-wide border-b border-slate-100 pb-4">
                Huân chương cao quý
              </h3>
              <ul className="space-y-4 list-disc marker:text-blue-500 pl-5">
                {[
                  'Huân chương Hồ Chí Minh (2001, 2016)',
                  'Huân chương Độc lập (hạng Nhất, Nhì, Ba từ 1986 - 2011)',
                  'Huân chương Lao động hạng Nhất, Ba (1981, 2021)'
                ].map((item, idx) => (
                  <li key={idx} className="text-slate-700 text-base leading-relaxed pl-1">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Intro;