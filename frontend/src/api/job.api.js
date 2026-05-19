import axiosClient from './axiosClient';

export const jobApi = {
  getAllJobs: (page = 1, limit = 15, params = {}) => {
    // Truyền params vào config của axios
    return axiosClient.get('/jobs', {
      params: {
        page,
        limit,
        ...params // Rải tất cả các filter (search, location, industry...) vào đây
      }
    });
  },
  getJobById: (id) => {
    return axiosClient.get(`/jobs/${id}`);
  },
  applyJob: (job_id) => {
    return axiosClient.post('/jobs/apply', { job_id });
  },
  createJob: (jobData) => {
    return axiosClient.post('/jobs', jobData); // Tương ứng với router.post('/', verifyToken, jobController.createJob)
  },
  getJobApplicants: (job_id) => {
    return axiosClient.get(`/jobs/${job_id}/applicants`);
  },
  updateApplicationStatus: (job_id, student_id, status) => {
    return axiosClient.put('/jobs/apply/status', { job_id, student_id, status });
  },
  //Update 17/5
  deleteJob: (id) => {
  return axiosClient.delete(`/jobs/${id}`);
  },
  //update 18/5
  updateJob: (id, data) => {
    return axiosClient.put(`/jobs/${id}`, data);
  },
  getAppliedJobs: () => {
    return axiosClient.get('/jobs/student/applied');
  },
};