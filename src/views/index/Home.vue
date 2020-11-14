<template>
    <div class="container">
        <!-- 左侧区域 -->
        <div class="left-board">
            <div class="logo-wrapper">
                <div class="logo">Form Generate 【表单设计器】</div>
            </div>
            <el-scrollbar class="left-scrollbar">
                <div class="components-list">
                    <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
                        <div class="components-title">
                            <svg-icon icon-class="component" />
                            {{ item.title }}
                        </div>
                        <draggable
                            class="components-draggable"
                            draggable=".components-item"
                            :list="item.list"
                            :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                            :clone="cloneComponent"
                            :sort="false"
                            @end="onEnd"
                        >
                            <div
                                v-for="(element, index) in item.list"
                                :key="index"
                                class="components-item"
                                @click="addComponent(element)"
                            >
                                <div class="components-body">
                                    <svg-icon :icon-class="element.__config__.tagIcon" />
                                    {{ element.__config__.label }}
                                </div>
                            </div>
                        </draggable>
                    </div>
                </div>
            </el-scrollbar>
        </div>

        <!-- 主区域 -->
        <div class="center-board">
            <div class="action-bar">
                <el-button icon="el-icon-video-play" size="mini" disabled @click="run">
                    运行
                </el-button>
                <el-button icon="el-icon-view" size="mini" @click="showJson">
                    查看json
                </el-button>
                <el-button icon="el-icon-download" size="mini" disabled @click="download">
                    导出vue文件
                </el-button>
                <el-button
                    class="copy-btn-main"
                    icon="el-icon-document-copy"
                    size="mini"
                    disabled
                    @click="copy"
                >
                    复制代码
                </el-button>
                <el-button class="delete-btn" icon="el-icon-delete" size="mini" @click="empty">
                    清空
                </el-button>
            </div>
            <el-scrollbar class="center-scrollbar">
                <el-row class="center-board-row" :gutter="formConf.gutter">
                    <el-form
                        :size="formConf.size"
                        :label-position="formConf.labelPosition"
                        :disabled="formConf.disabled"
                        :label-width="formConf.labelWidth + 'px'"
                    >
                        <draggable
                            class="drawing-board"
                            :list="drawingList"
                            :animation="340"
                            group="componentsGroup"
                        >
                            <draggable-item
                                v-for="(item, index) in drawingList"
                                :key="item.renderKey"
                                :drawing-list="drawingList"
                                :current-item="item"
                                :index="index"
                                :active-id="activeId"
                                :form-conf="formConf"
                                @activeItem="activeFormItem"
                                @copyItem="drawingItemCopy"
                                @deleteItem="drawingItemDelete"
                            />
                        </draggable>
                        <div v-show="!drawingList.length" class="empty-info">
                            从左侧拖入或点选组件进行表单设计
                        </div>
                    </el-form>
                </el-row>
            </el-scrollbar>
        </div>

        <!-- 右侧属性设置 -->
        <right-panel
            :active-data="activeData"
            :form-conf="formConf"
            :show-field="!!drawingList.length"
            @tag-change="tagChange"
            @fetch-data="fetchData"
        />

        <!-- 查看JSON -->
        <json-drawer
            size="60%"
            :visible.sync="jsonDrawerVisible"
            :json-str="JSON.stringify(formData)"
            @refresh="refreshJson"
        />
    </div>
</template>

<script>
// lib
import draggable from 'vuedraggable';
import { debounce } from 'throttle-debounce';

// components
import RightPanel from './RightPanel';
import DraggableItem from './DraggableItem';
import JsonDrawer from './components/JsonDrawer';

// config
import {
    inputComponents,
    selectComponents,
    layoutComponents,
    formConf,
} from '@/components/generator/config';
import drawingDefalut from '@/components/generator/drawingDefalut'; // 默认展示配置

// utils
import { deepClone } from '@/utils/index';
import {
    getDrawingList,
    saveDrawingList,
    getIdGlobal,
    saveIdGlobal,
    getFormConf,
} from '@/utils/db';

let oldActiveId; // 旧的激活控件编码
let tempActiveData; // 拖拽中的控件生成数据,用于拖拽放下时进行配置

const drawingListInDB = getDrawingList();
const formConfInDB = getFormConf();
const idGlobal = getIdGlobal();

export default {
    name: 'Home',

    components: {
        draggable,
        DraggableItem,
        RightPanel,
        JsonDrawer,
    },

    data() {
        return {
            // 弹窗开关
            jsonDrawerVisible: false,
            formData: {},

            idGlobal,
            drawingData: {},
            drawingList: drawingDefalut,

            activeId: drawingDefalut[0].formId,
            activeData: drawingDefalut[0],

            saveDrawingListDebounce: debounce(340, saveDrawingList),
            saveIdGlobalDebounce: debounce(340, saveIdGlobal),

            formConf, // 表单配置
            leftComponents: [
                // 左侧组件列表
                {
                    title: '输入型组件',
                    list: inputComponents,
                },
                {
                    title: '选择型组件',
                    list: selectComponents,
                },
                {
                    title: '布局型组件',
                    list: layoutComponents,
                },
            ],
        };
    },

    watch: {
        // 监听当前激活项的标题修改提示语
        'activeData.__config__.label': function(val, oldVal) {
            const { placeholder, __config__ } = this.activeData;
            if (placeholder === undefined || !__config__.tag || oldActiveId !== this.activeId) {
                return;
            }

            this.activeData.placeholder = this.activeData.placeholder.replace(oldVal, '') + val;
        },

        // 监听当前激活项编码
        activeId: {
            handler(val) {
                oldActiveId = val;
            },
            immediate: true,
        },

        // 监听设计器列表并缓存
        drawingList: {
            handler(val) {
                this.saveDrawingListDebounce(val);
                if (val.length === 0) this.idGlobal = 100;
            },
            deep: true,
        },

        // 监听控件编码的生成并缓存
        idGlobal: {
            handler(val) {
                this.saveIdGlobalDebounce(val);
            },
            immediate: true,
        },
    },

    mounted() {
        // 如果有缓存使用缓存,否则使用默认
        if (Array.isArray(drawingListInDB) && drawingListInDB.length > 0) {
            this.drawingList = drawingListInDB;
        } else {
            this.drawingList = drawingDefalut;
        }

        // 设置当前激活项
        this.activeFormItem(this.drawingList[0]);

        // 设置表单配置
        if (formConfInDB) this.formConf = formConfInDB;
    },

    methods: {
        // 创建控件和子控件的 key
        createIdAndKey(item) {
            const config = item.__config__;

            config.formId = ++this.idGlobal;
            config.renderKey = `${config.formId}${+new Date()}`; // 改变renderKey后可以实现强制更新组件

            if (config.layout === 'colFormItem') {
                item.__vModel__ = `field${this.idGlobal}`;
            } else if (config.layout === 'rowFormItem') {
                config.componentName = `row${this.idGlobal}`;
                !Array.isArray(config.children) && (config.children = []);
                delete config.label; // rowFormItem无需配置label属性
            }
            if (Array.isArray(config.children)) {
                config.children = config.children.map(childItem => this.createIdAndKey(childItem));
            }
            return item;
        },

        // 克隆组件
        cloneComponent(origin) {
            const clone = deepClone(origin); // 克隆组件定义的配置

            const config = clone.__config__;
            config.span = this.formConf.span; // 生成代码时，会根据span做精简判断

            this.createIdAndKey(clone);

            clone.placeholder !== undefined && (clone.placeholder += config.label);

            tempActiveData = clone;
            return tempActiveData;
        },

        // 添加组件
        addComponent(item) {
            const clone = this.cloneComponent(item);

            this.fetchData(clone);
            this.drawingList.push(clone);
            this.activeFormItem(clone);
        },

        // 监听拖拽停止
        onEnd(obj) {
            if (obj.from !== obj.to) {
                this.fetchData(tempActiveData);
                this.activeData = tempActiveData;
                this.activeId = this.idGlobal;
            }
        },

        // 清空
        empty() {
            this.$confirm('确定要清空所有组件吗？', '提示', { type: 'warning' }).then(() => {
                this.drawingList = [];
                this.idGlobal = 100;
            });
        },

        // 监听组件类型更改
        tagChange(newTag) {
            newTag = this.cloneComponent(newTag);

            const config = newTag.__config__;

            newTag.__vModel__ = this.activeData.__vModel__;
            config.formId = this.activeId;
            config.span = this.activeData.__config__.span;

            this.activeData.__config__.tag = config.tag;
            this.activeData.__config__.tagIcon = config.tagIcon;
            this.activeData.__config__.document = config.document;

            if (typeof this.activeData.__config__.defaultValue === typeof config.defaultValue) {
                config.defaultValue = this.activeData.__config__.defaultValue;
            }

            Object.keys(newTag).forEach(key => {
                if (this.activeData[key] !== undefined) {
                    newTag[key] = this.activeData[key];
                }
            });

            this.activeData = newTag;
            this.updateDrawingList(newTag, this.drawingList);
        },

        // 查找控件并更改
        updateDrawingList(newTag, list) {
            const index = list.findIndex(item => item.__config__.formId === this.activeId);
            if (index > -1) {
                list.splice(index, 1, newTag);
            } else {
                list.forEach(item => {
                    if (Array.isArray(item.__config__.children))
                        this.updateDrawingList(newTag, item.__config__.children);
                });
            }
        },

        //  查询数据
        fetchData(component) {
            const { dataType, method, url } = component.__config__;
            if (dataType === 'dynamic' && method && url) {
                this.setLoading(component, true);
                this.$axios({
                    method,
                    url,
                }).then(resp => {
                    this.setLoading(component, false);
                    this.setRespData(component, resp.data);
                });
            }
        },

        // 设置控件加载状态
        setLoading(component, val) {
            const { directives } = component;
            if (Array.isArray(directives)) {
                const t = directives.find(d => d.name === 'loading');
                if (t) t.value = val;
            }
        },

        // 设置请求返回数据
        setRespData(component, respData) {
            const { dataPath, renderKey, dataConsumer } = component.__config__;
            if (!dataPath || !dataConsumer) return;

            const data = dataPath.split('.').reduce((pre, item) => pre[item], respData);
            this.setObjectValueByStringKeys(component, dataConsumer, data);

            const i = this.drawingList.findIndex(item => item.__config__.renderKey === renderKey);
            if (i > -1) this.$set(this.drawingList, i, component);
        },

        // 使用字符串形式修改深度对象的值
        setObjectValueByStringKeys(obj, strKeys, val) {
            const arr = strKeys.split('.');
            arr.reduce((pre, item, i) => {
                if (arr.length === i + 1) {
                    pre[item] = val;
                } else if (Object.prototype.toString.call(pre[item]) !== '[Object Object]') {
                    pre[item] = {};
                }
                return pre[item];
            }, obj);
        },

        // 当前激活控件
        activeFormItem(currentItem) {
            this.activeData = currentItem;
            this.activeId = currentItem.__config__.formId;
        },

        // 设计器列表中拷贝
        drawingItemCopy(item, list) {
            let clone = deepClone(item);
            clone = this.createIdAndKey(clone);
            list.push(clone);
            this.activeFormItem(clone);
        },

        // 设计器列表中删除
        drawingItemDelete(index, list) {
            list.splice(index, 1);
            this.$nextTick(() => {
                const len = this.drawingList.length;
                if (len) {
                    this.activeFormItem(this.drawingList[len - 1]);
                }
            });
        },

        // 克隆表单所有配置
        AssembleFormData() {
            this.formData = {
                fields: deepClone(this.drawingList),
                ...this.formConf,
            };
        },

        // 运行
        run() {},

        // 查看json
        showJson() {
            this.AssembleFormData();
            this.jsonDrawerVisible = true;
        },

        // 更新JSON
        refreshJson(data) {
            this.drawingList = deepClone(data.fields);

            delete data.fields;
            this.formConf = data;
        },

        // 导出 Vue 文件
        download() {},

        // 复制代码
        copy() {},
    },
};
</script>

<style lang="scss">
@import '@/styles/home';
</style>
