import React from "react";
import ReactReconciler from "react-reconciler";
import * as NODE_TYPE from "./constans";
import DocComponents from "./docComponents";
import VNode from "./VNode";
import * as utils from "./utils";

const hostConfig = {
  supportsMutation: true,
  getRootHostContext(nextRootInstance: unknown) {
    const rootInstance = {};
    return rootInstance;
  },
  getChildHostContext() {
    const context = {};
    return context;
  },
  shouldSetTextContent(type: string, nextProps: any) {
    return (
      typeof nextProps.children === "string" ||
      typeof nextProps.children === "number"
    );
  },
  prepareForCommit(prepareForCommit: DocComponents) {
    console.log(prepareForCommit, "prepareForCommit");
  },
  clearContainer(...rest: unknown[]) {
    console.log(rest, "clearContainer");
  },
  resetAfterCommit(rootContainerInstance: DocComponents) {
    console.log(rootContainerInstance, "resetAfterCommit");
  },
  finalizeInitialChildren() {
    return false;
  },
  createTextInstance(newText: string, rootContainerInstance: DocComponents) {
    const node = new VNode({
      id: utils.genId.build.next().value,
      type: NODE_TYPE.TYPE_TEXT,
      props: null,
      container: rootContainerInstance,
    });
    node.text = newText;
    return node;
  },
  appendInitialChild(parent: VNode, child: VNode) {
    console.log(parent, "dawdadad");
    parent.appendChild(child);
  },
  appendChildToContainer(parent: VNode, child: VNode) {
    parent.appendChild(child);
    child.mounted = true;
  },
  createInstance(
    type: string,
    newProps: any,
    rootContainerInstance: DocComponents
  ) {
    return new VNode({
      id: utils.genId.build.next().value,
      type: NODE_TYPE.DOM_TAG_MAP[type] ?? type,
      props: newProps,
      container: rootContainerInstance,
    });
  },
  //Prepareupdate首先在发生prop更改的节点上调用，然后递归地在所有树节点上调用它。此方法可用于提示协调程序(reconciler)是否需要在此节点上执行更新。如果这个函数没有返回任何东西，那么reconciler就会根据它的算法决定是否应该在这个节点上执行更新。
  //这个函数中不执行任何dom更改。Dom更改应该只在呈现程序的提交阶段进行。一旦对prepareUpdate的树遍历完成，rootContainer上的prepareForCommit方法将被调用，然后在每个从prepareUpdate返回updatePayload的节点上调用commitUpdate。
  prepareUpdate() {},
  /// 这里，我们使用prepareUpdate方法执行所有排队的更新。我们将获得实例、updatePayload、旧道具和新道具等。如果需要，我们应该在这里完成所有dom操作工作。
  commitUpdate(node: VNode, ...rest: unknown[]) {
    /// node update
    console.log(rest, "commitUpdate");
    return;
  },

  ///在这里，我们在textNode上执行实际的dom更新。
  commitTextUpdate(textInstance: VNode, oldText: string, newText: string) {
    if (oldText !== newText) {
      textInstance.text = newText;
      /// node update
    }
    console.log(123);
  },
  /// 每当需要在父元素末尾插入新元素时，就会调用这个函数。例如:
  appendChild(parent: VNode, child: VNode) {
    parent.appendChild(child);
  },

  insertBefore(parentInstance: VNode, child: VNode, beforeChild: VNode) {
    parentInstance.insertBefore(child, beforeChild);
  },

  removeChild(parentInstance: VNode, child: VNode) {
    parentInstance.removeChild(child);
  },
  insertInContainerBefore(
    container: DocComponents,
    child: VNode,
    beforeChild: VNode
  ) {
    container.insertBefore(child, beforeChild);
  },

  removeChildFromContainer(container: DocComponents, child: VNode) {
    container.removeChild(child);
  },
  ///它在react-dom中用于重置dom元素的文本内容。但是我找不到启动此功能的方法。需要挖掘更多。因此，我将其保留为无操作功能。
  resetTextContent() {},

  ///这个函数用于优先渲染一些子树。主要用于子树隐藏或屏幕外的情况。 这可以帮助提高渲染性能。
  shouldDeprioritizeSubtree(type: string, nextProps: any) {
    return !!nextProps.hidden;
  },
};

const ReactReconcilerInst = ReactReconciler(hostConfig as any);

const cumtormRender = {
  render: function (
    component: React.ReactElement | null,
    tagetEle: DocComponents,
    callback = () => {}
  ) {
    const container = new DocComponents({}, "root");

    container._rootContainer = ReactReconcilerInst.createContainer(
      container,
      false as any,
      false,
      null
    );

    ReactReconcilerInst.updateContainer(
      component,
      container._rootContainer,
      null,
      callback
    );

    const containerFiber = container._rootContainer.current;
    if (!containerFiber.child) {
      return null;
    }
    return containerFiber.child.stateNode;
  },
};

export default cumtormRender;
