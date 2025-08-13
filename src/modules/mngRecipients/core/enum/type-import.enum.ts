export enum TypeImport {
  INSERT = 'insert',
  UPDATE = 'update',
  INSERT_OR_UPDATE = 'insert_or_update'
}

export const TypeImportEnumUsingName = {
  [TypeImport.INSERT]: '新規読者の登録',
  [TypeImport.UPDATE]: '登録済み読者の更新',
  [TypeImport.INSERT_OR_UPDATE]: '全て登録&更新'
}