import { getProfile } from "@/shared/services/auth.service"

export const fetchProfile = async () => {
  try {
    const res = await getProfile()
    if (res?.data) {
      return res.data.data
    }

    return null
  } catch (err) {
    return null
  }
}
