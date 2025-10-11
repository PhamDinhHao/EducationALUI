import { lazyLoadModuleRoute, lazyLoadRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'

export const experienceInitiativeRoute = [
  {
    path: PagePath.EXPERIENCEINITIATIVE,
    element: lazyLoadRoute('Base'),
    children: [
      {
        path: PagePath.EXPERIENCEINITIATIVE,
        element: (
          <>
            {lazyLoadModuleRoute(ModuleName.EXPERIENCEINITIATIVE, PageName.EXPERIENCEINITIATIVE)}
          </>
        )
      },
    ]
  }
]
