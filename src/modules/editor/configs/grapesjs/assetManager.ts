import type { AssetManagerConfig } from 'grapesjs'
import { createAsset } from '@/modules/editor/Service/asset.service'

export const assetManager: AssetManagerConfig = {

  uploadFile: async function (e) {
    const input = e.target as HTMLInputElement
    const files = input.files
    if (!files) {
      return
    }
    await createAsset({ file: files[0] })
  },
}
