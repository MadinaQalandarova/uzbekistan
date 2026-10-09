/* Pannellum (UMD) uchun minimal tip — faqat ishlatiladigan API */
declare module "pannellum" {
  export interface PannellumViewer {
    destroy: () => void;
  }
  const pannellum: {
    viewer: (
      container: HTMLElement,
      config: Record<string, string | number | boolean>,
    ) => PannellumViewer;
  };
  export default pannellum;
}
