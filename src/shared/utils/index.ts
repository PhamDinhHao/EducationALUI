import { AxiosError } from 'axios'
import _ from 'lodash'
import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { GlobalResponse, MenuItem } from '@/shared/core/types'
import { decamelize } from 'humps'

export const transformQueryParams = (params: { [key: string]: any }) => {
  const filters: { [key: string]: any } = {};
  for (const property in params) {
    const value = params[property]
    if (property === "sort"){
      filters["sort"] = decamelize(params[property]);
      continue;
    }
    if (value === undefined || value === null) {
      continue;
    }
    filters[`filter[${property}]`] = value;
  }
  return filters;
};

export const transformQueryString = (params: { [key: string]: any }) => {
  const filters: { [key: string]: any } = {};

  for (const property in params) {
    if (_.isArray(params[property])) {
      if (params[property].length) {
        filters[property] = params[property];
      }
    } else if (params[property]) {
      filters[property] = params[property];
    }
  }

  return new URLSearchParams(filters).toString();
};

export const mapErrorsToForm = <T extends FieldValues>(error: AxiosError, setError: UseFormSetError<T>) => {
  if (error?.response) {
    const { errors } = error.response.data as GlobalResponse<T>
    if (errors) {
      errors.forEach((error) => setError(error.path as Path<T>, { message: error.message }))
    }
  }
}

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem => {
  return {
    key,
    icon,
    children,
    label
  } as MenuItem
}

export const formattedDate = (date: Date): string => {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
}

export const isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i)

export const getMenuParentKey = (path: string[]): { openKeys: string, selectedKeys: string } => {
  if (path.length === 1) {
    return path[0] === 'home' || path[0] === ''
      ? { openKeys: '', selectedKeys: '' }
      : { openKeys: 'editor', selectedKeys: 'template' }
  }

  return path[1] === 'draft'
    ? { openKeys: 'editor', selectedKeys: 'draft' }
    : { openKeys: path[0], selectedKeys: path[1] }
}

export type Pagina = {
  page: number,
  limit: number,
  totalPage: number
}

const createDownloadLink = (blob: Blob, filename: string) => {
  const blobUrl = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = blobUrl
  link.download = filename
  return { link, blobUrl }
}

const getFilenameFromUrl = (url: string): string => {
  return url.split('/').pop() || 'download.csv'
}

export const handleDownloadCSV = (csv: string) => {
  return async () => {
    try {
      const secureUrl = csv.replace('http://', 'https://')
      
      const response = await fetch(secureUrl)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const blob = await response.blob()
      const filename = getFilenameFromUrl(secureUrl)
      const { link, blobUrl } = createDownloadLink(blob, filename)

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
    }
  }
}

export const getPageDelete = (dataTable: any[], selectedRowKeys: any[], currentPage: number) => {
  const remainingItemsOnPage = dataTable.length - selectedRowKeys.length
  const nextPage = remainingItemsOnPage >= 1 ? currentPage : Math.max(1, currentPage - 1)
  return { page: nextPage }
}
