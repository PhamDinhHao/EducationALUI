import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const assistantAIRoute = [
  {
    path: PagePath.ASSISTANTAI,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.ASSISTANTAI,
        element: lazyLoadModuleRoute(ModuleName.ASSISTANTAI, PageName.ASSISTANTAI)
      }
    ]
  }
]
