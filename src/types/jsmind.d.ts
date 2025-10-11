declare module 'jsmind' {
  interface JsMindOptions {
    container: string | HTMLElement;
    theme?: string;
    editable?: boolean;
    support_html?: boolean;
    view?: {
      hmargin?: number;
      vmargin?: number;
      line_width?: number;
      line_color?: string;
    };
  }

  interface JsMindData {
    meta: {
      name: string;
      author: string;
      version: string;
    };
    format: string;
    data: any;
  }

  interface JsMindView {
    zoom_in(): void;
    zoom_out(): void;
    show(): void;
    reset(): void;
  }

  interface JsMindNode {
    id: string;
    topic: string;
    parent?: string;
    children?: JsMindNode[];
  }

  class JsMind {
    constructor(options: JsMindOptions);
    
    view: JsMindView;
    
    show(data: JsMindData): void;
    get_data(format?: string): JsMindData;
    get_selected_node(): JsMindNode | null;
    select_node(node_id: string): void;
    add_node(parent_node_id: string, node_id: string, topic: string): JsMindNode | null;
    remove_node(node_id: string): boolean;
    update_node(node_id: string, topic: string): void;
    
    static show(options: JsMindOptions, data: JsMindData): JsMind;
  }

  export = JsMind;
}
