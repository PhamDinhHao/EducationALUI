import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const searchAIRoute = [
  {
    path: PagePath.SEARCH_AI,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.SEARCH_AI,
        element: (
          <>
            {lazyLoadModuleRoute(ModuleName.SEARCH_AI, PageName.SEARCH_AI)}
          </>
        )
      },

    ]
  },
]
