<script>
// config
import { inputComponents, selectComponents, layoutComponents } from '@/components/generator/config';

export default {
    name: 'LeftPanel',

    data() {
        return {
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

    methods: {
        onEnd(obj) {
            this.$emit('end', obj);
        },

        clone(obj) {
            this.$emit('clone', obj);
        },
    },
};
</script>

<template>
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
                        :clone="clone"
                        :sort="false"
                        @end="onEnd"
                    >
                        <div
                            v-for="(element, index) in item.list"
                            :key="index"
                            class="components-item"
                            @click="$emit('add', element)"
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
</template>
