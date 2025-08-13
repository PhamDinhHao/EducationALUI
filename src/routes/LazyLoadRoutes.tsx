import { Spin } from "antd";
import { lazy, Suspense } from "react";
/**
 * Lazily load the mentioned component which resides in the page directory
 * This method will be used in routes so that the files are loaded only
 * When users are on that route
 */
export const lazyLoadModuleRoute = (
  moduleName: string,
  componentName: string,
) => {
  const LazyElement = lazy(
    () => import(`@/modules/${moduleName}/pages/${componentName}/index.tsx`),
  );

  // Wrapping around the suspense component is mandatory
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    }>
      <LazyElement />
    </Suspense>
  );
};

export const lazyLoadRoute = (pageName: string) => {
  const LazyElement = lazy(() => import(`@/shared/static-pages/${pageName}.tsx`));

  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    }>
      <LazyElement />
    </Suspense>
  );
};
