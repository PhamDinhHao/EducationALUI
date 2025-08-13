
import { Pagination } from "@/shared/core/types/common.type";
import { Mail } from "@/shared/core/types/mail-setting.type";
import { getMailSettingList } from "@/shared/services/mail-setting.service";

export const fetchMailSettingList = async (params: { [key: string]: any }) => {
  try {
    const res = await getMailSettingList(params);

    if (res?.data) {
      const { pagination, data } = res.data;

      return {
        pagination: pagination as Pagination,
        data: data as Mail[],
      };
    }

    return null;
  } catch (err) {
    return null;
  }
};