export type Block = {
  createdAt: Date
  label: string
  content: string
  category: string
  id: string
  attributes: Attributes
}

export type Attributes = {
  selectors: string[]
  selectorsAdd: string
  style: Record<string, string>
  mediaText: string
  state: string
  stylable: boolean
  atRuleType: string
  singleAtRule: boolean
  important: boolean
  group: string
  shallow: boolean
  _undo: boolean
}

export type ImageFile = {
  name: string
  src: string
}
