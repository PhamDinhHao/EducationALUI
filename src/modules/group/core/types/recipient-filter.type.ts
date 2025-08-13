export type RecipientFilter = {
  id: number | string
  userId?: number
  name: string
  conditions?: [
    {
      field: string
      searchType: string
      searchValue: string
    }
  ]
}
