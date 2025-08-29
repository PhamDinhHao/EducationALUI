import { lazyLoadModuleRoute } from '@/routes/LazyLoadRoutes'
import { ModuleName, PageName, PagePath } from '@/shared/core/enum/page.enum'
export const aiRoute = [
  {
    path: PagePath.AI,
    element: lazyLoadModuleRoute(ModuleName.AI, PageName.AI),
    children: [
      {
        path: PagePath.AI,
        element: (
          <>
            {/* <Suspense fallback={<Spin size="large" />}> */}
              {lazyLoadModuleRoute(ModuleName.AI, PageName.AI)}
            {/* </Suspense> */}
            
          </>
        )
      },
      {
        path: PagePath.SUCCESSIONPLAN,
        element: lazyLoadModuleRoute(ModuleName.SUCCESSIONPLAN, PageName.SUCCESSIONPLAN),
      },
      {
        path: PagePath.EXPERIENCEINITIATIVE,
        element: lazyLoadModuleRoute(ModuleName.EXPERIENCEINITIATIVE, PageName.EXPERIENCEINITIATIVE),
      },
      {
        path: PagePath.EXPREANDSUCCE,
        element: lazyLoadModuleRoute(ModuleName.EXPREANDSUCCE, PageName.EXPREANDSUCCE),
      },
      {
        path: PagePath.PLANRESULT,
        element: lazyLoadModuleRoute(ModuleName.PLANRESULT, PageName.PLANRESULT),
      },
      {
        path: PagePath.INITIATIVERESULT,
        element: lazyLoadModuleRoute(ModuleName.INITIATIVERESULT, PageName.INITIATIVERESULT),
      },
    ]
  }
]