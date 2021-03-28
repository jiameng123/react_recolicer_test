import { FiberRoot } from "react-reconciler";
import VNode from "./VNode";
import * as utils from "./utils";

export default class DocComponents {
  context: any;
  root: VNode;
  rootKey: string;
  _rootContainer?: FiberRoot;
  rendered = false;
  constructor(context: any, rootKey = "root") {
    this.context = context;

    this.root = new VNode({
      id: utils.genId.build.next().value,
      type: "root",
      container: this,
    });
    this.root.mounted = true;
    this.rootKey = rootKey;
  }

  appendChild(child: VNode) {
    this.root.appendChild(child);
  }

  insertBefore(child: VNode, beforeChild: VNode) {}

  removeChild(child: VNode) {}
}
