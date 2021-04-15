import DocComponents from "./docComponents";
import * as NodeTypes from "./constans";
export interface IRawNode {
  id: number;
  type: string;
  props?: any;
  nodes?: { [key: number]: IRawNode };
  children?: Array<IRawNode | number>;
  text?: string;
}


export default class VNode {
  id: number;
  container: DocComponents;
  type: string;
  mounted = false;
  deleted = false;
  props?: any;
  parent: VNode | null = null;
  firstChild: VNode | null = null;
  lastChild: VNode | null = null;
  size = 0;
  previousSibling: VNode | null = null;
  nextSibling: VNode | null = null;
  text?: string;

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

  private toRawNode(node:VNode):IRawNode {
      if(node.type === NodeTypes.TYPE_TEXT) {
        return  {
          id:node.id,
          text: node.text,
          type: node.type
        }
      }
      return  {
        id:node.id,
        text: node.text,
        type: node.type,
        children: [],
        props: node.props,
      }
  }

  appendChild(child: this) {
    this.removeChild(child);
    this.size += 1;
    child.parent = this;

    if (!this.firstChild) {
      this.firstChild = child;
    }

    if (this.lastChild) {
      this.lastChild.nextSibling = child;
      child.previousSibling = this.lastChild;
    }

    this.lastChild = child;
  }

  insertBefore(node: this, beforeChild: this) {
    this.removeChild(node);
    this.size += 1;

    if (this.firstChild === beforeChild) {
      this.firstChild = node;
    }

    if (beforeChild.previousSibling) {
      const previousSibling = beforeChild.previousSibling;
      previousSibling.nextSibling = node;
      node.previousSibling = previousSibling;
    }

    beforeChild.previousSibling = node;

    node.nextSibling = beforeChild;
  }

  removeChild(child: this) {
    if (child.parent !== this) return;

    const previousSibling = child.previousSibling;
    const nextSibling = child.nextSibling;
    
    if (child === this.firstChild) {
      this.firstChild = nextSibling;
    } 
    
    if (child === this.lastChild) {
      this.lastChild = previousSibling;
    } 

    if (previousSibling) {
      previousSibling.nextSibling = nextSibling;
    }

    if (nextSibling) {
      nextSibling.previousSibling = previousSibling;
    }

    this.previousSibling = null;
    this.nextSibling = null;
    this.deleted = true;
    this.size -= 1;
  }

  get children () {
    const childens = [];
    let item  = this.lastChild;
     
    while (item?.nextSibling) {
        childens.push(item);
        item = item.nextSibling;
    }
   
    return childens;
  }

  isMounted(): boolean {
    return this.parent ? this.parent.isMounted() : this.mounted;
  }

  isDeleted(): boolean {
    return this.deleted === true ? this.deleted : this.parent?.isDeleted() ?? false;
  }

  update(props: {[propName: string]: any}) {
    if(props) {
      const keys = Object.keys(props);
      keys.forEach((k) => {
          this.container.preUpdate({
            type: 'set',
            name: k,
            value: Reflect.get(props, k),
            node: this,
          })
      })
    }
  }

  toJSON() {
    const rawNode = this.toRawNode(this);
    const stack = [{currentNode: rawNode, children: this.children}];
   
    while(stack.length) {

      const { currentNode, children = []} = stack.pop() as ({
        currentNode: IRawNode;
        children: VNode[];
      });

      for (let index = 0; index < children.length; index++) {
        const element = children[index];
        const currentRawNode = this.toRawNode(element);
        currentNode.children?.push(element.id);
        if(!currentNode.nodes) {
           currentNode.nodes = {};
        }
        currentNode.nodes[currentRawNode.id] = currentRawNode;

        stack.push({currentNode: currentRawNode,
           children: element.children});
      }
      
    }

    return rawNode;
  }
}
