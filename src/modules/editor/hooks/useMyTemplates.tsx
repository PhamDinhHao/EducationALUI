import { useMemo, useState } from 'react'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { TemplateResponse } from '@/modules/templates/types'
import TemplateService from '@/modules/templates/services/service'
import { TemplateType } from '@/modules/editor/core/enum/distribution-setting.enum'
import { Pagination } from '@/shared/core/types'

export const useMyTemplates = (type: TemplateType) => {
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    perPage: 10,
    total: 10,
    totalPages: 10
  })
  const [filters, setFilters] = useState<Record<string, any>>({})

  const fetchTemplates = async (page: number, limit: number, filter: any) => {
    const query = { ...filter, page, per_page: limit }
    return await TemplateService.getAll(query,type)
  }

  const { data, refetch, isFetching, isLoading } = useQuery<TemplateResponse, Error>({
    queryKey: ['template', pagination.currentPage, pagination.perPage, filters],
    queryFn: () => fetchTemplates(pagination.currentPage, pagination.perPage, filters),
    keepPreviousData: true
  } as UseQueryOptions<TemplateResponse, Error>)

  const updatedPagination = useMemo(() => {
    return {
      ...pagination,
      totalPages: data?.pagination?.totalPages ?? 0,
      total: data?.pagination?.total ?? 0
    }
  }, [pagination, data])

  return {
    dataSource: data?.data ?? [],
    pagination: updatedPagination,
    setPagination,
    refetch,
    isLoading: isFetching || isLoading,
    setFilters,
    filters
  }
}
