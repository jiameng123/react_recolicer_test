import DocComponents from "./docComponents";

export default class VNode {
  id: number;
  container: DocComponents;
  type: string;
  mounted: boolean = false;
  props?: any;
  parent: VNode | null = null;
  firstChild: VNode | null = null;
  lastChild: VNode | null = null;
  size = 0;
  previousSibling: VNode | null = null;
  nextSibling: VNode | null = null;
  text?: string;
  child?: VNode[];

  constructor({
    id,
    type,
    props,
    container,
  }: {
    id: number;
    type: string;
    props?: any;
    container: any;
  }) {
    this.id = id;
    this.container = container;
    this.type = type;
    this.props = props;
  }

  appendChild(child: this) {
    if (!this.child) {
      this.child = [];
    }

    this.child.push(child);
  }

  insertBefore(node: this, beforeChild: this) {
    ///
  }

  removeChild(child: this) {}
}
