
import { getGroups } from "@/shared/services/group.service";
import { Pagination } from "@/shared/core/types/common.type";
import { Group } from "@/shared/core/types/group.type";

export const fetchGroupList = async (params: { [key: string]: any }) => {
  try {
    const res = await getGroups(params);

    if (res?.data) {
      const { pagination, data } = res.data;

      return {
        pagination: pagination as Pagination,
        data: data as Group[],
      };
    }

    return null;
  } catch (err) {
    return null;
  }
};