const DRAWING_ITEMS = 'drawingItems';
const DRAWING_ITEMS_VERSION = '1.2';
const DRAWING_ITEMS_VERSION_KEY = 'DRAWING_ITEMS_VERSION';
const DRAWING_ID = 'idGlobal';
const TREE_NODE_ID = 'treeNodeId';
const FORM_CONF = 'formConf';

// 获取拖拽列表
export function getDrawingList() {
    // 加入缓存版本的概念，保证缓存数据与程序匹配
    const version = localStorage.getItem(DRAWING_ITEMS_VERSION_KEY);
    if (version !== DRAWING_ITEMS_VERSION) {
        localStorage.setItem(DRAWING_ITEMS_VERSION_KEY, DRAWING_ITEMS_VERSION);
        saveDrawingList([]);
        return null;
    }

    const str = localStorage.getItem(DRAWING_ITEMS);
    if (str) return JSON.parse(str);
    return null;
}

// 保存拖拽列表
export function saveDrawingList(list) {
    localStorage.setItem(DRAWING_ITEMS, JSON.stringify(list));
}

// 获取控件编码
export function getIdGlobal() {
    const str = localStorage.getItem(DRAWING_ID);
    if (str) return parseInt(str, 10);
    return 100;
}

// 保存控件编码
export function saveIdGlobal(id) {
    localStorage.setItem(DRAWING_ID, `${id}`);
}

// 获取 tree 节点编码
export function getTreeNodeId() {
    const str = localStorage.getItem(TREE_NODE_ID);
    if (str) return parseInt(str, 10);
    return 100;
}

// 保存 tree 节点编码
export function saveTreeNodeId(id) {
    localStorage.setItem(TREE_NODE_ID, `${id}`);
}

// 获取表单配置
export function getFormConf() {
    const str = localStorage.getItem(FORM_CONF);
    if (str) return JSON.parse(str);
    return null;
}

// 保存表单配置
export function saveFormConf(obj) {
    localStorage.setItem(FORM_CONF, JSON.stringify(obj));
}
