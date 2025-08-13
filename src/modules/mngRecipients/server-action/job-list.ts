import { Job } from "@/modules/mngRecipients/core/types/job.type"
import { getJobs } from "@/modules/mngRecipients/services/jobs.service"
import { Pagination } from "@/shared/core/types/common.type"

export const fetchJobList = async (params: { [key: string]: any }) => {
  try {
    const res = await getJobs(params)
    if (res?.data) {
      const { pagination, data } = res.data
      return {
        pagination: pagination as Pagination,
        data: data as Job[]
      }
    }

    return null
  } catch (err) {
    return null
  }
}

