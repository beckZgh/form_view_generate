<script>
import { beautifierConf } from '@/utils/index';
import { saveAs } from 'file-saver';
import ClipboardJS from 'clipboard';

import loadMonaco from '@/utils/loadMonaco';
import loadBeautifier from '@/utils/loadBeautifier';

let beautifier;
let monaco;

export default {
    props: {
        jsonStr: {
            type: String,
            required: true,
        },
    },

    mounted() {
        window.addEventListener('keydown', this.preventDefaultSave);

        const clipboard = new ClipboardJS('.copy-json-btn', {
            text: () => {
                this.$notify({
                    title: '成功',
                    message: '代码已复制到剪切板，可粘贴。',
                    type: 'success',
                });
                return this.beautifierJson;
            },
        });

        clipboard.on('error', () => {
            this.$message.error('代码复制失败');
        });
    },

    beforeDestroy() {
        window.removeEventListener('keydown', this.preventDefaultSave);
    },

    methods: {
        preventDefaultSave(e) {
            if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
            }
        },

        onOpen() {
            loadBeautifier(btf => {
                beautifier = btf;
                this.beautifierJson = beautifier.js(this.jsonStr, beautifierConf.js);

                loadMonaco(val => {
                    monaco = val;
                    this.setEditorValue('editorJson', this.beautifierJson);
                });
            });
        },

        setEditorValue(id, codeStr) {
            if (this.jsonEditor) {
                this.jsonEditor.setValue(codeStr);
            } else {
                this.jsonEditor = monaco.editor.create(document.getElementById(id), {
                    value: codeStr,
                    theme: 'vs-dark',
                    language: 'json',
                    automaticLayout: true,
                });
                // ctrl + s 刷新
                this.jsonEditor.onKeyDown(e => {
                    if (e.keyCode === 49 && (e.metaKey || e.ctrlKey)) {
                        this.refresh();
                    }
                });
            }
        },

        exportJsonFile() {
            this.$prompt('文件名:', '导出文件', {
                inputValue: `${+new Date()}.json`,
                closeOnClickModal: false,
                inputPlaceholder: '请输入文件名',
            }).then(({ value }) => {
                if (!value) value = `${+new Date()}.json`;
                const codeStr = this.jsonEditor.getValue();
                const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' });
                saveAs(blob, value);
            });
        },

        refresh() {
            try {
                this.$emit('refresh', JSON.parse(this.jsonEditor.getValue()));
            } catch (error) {
                this.$notify({
                    title: '错误',
                    message: 'JSON格式错误，请检查',
                    type: 'error',
                });
            }
        },
    },
};
</script>

<template>
    <div>
        <el-drawer v-bind="$attrs" v-on="$listeners" @opened="onOpen">
            <div class="action-bar" :style="{ 'text-align': 'left' }">
                <el-button icon="el-icon-refresh" size="mini" @click="refresh">
                    刷新
                </el-button>

                <el-button
                    ref="copyBtn"
                    class="copy-json-btn"
                    icon="el-icon-document-copy"
                    size="mini"
                    @click="refresh"
                >
                    复制JSON
                </el-button>

                <el-button icon="el-icon-download" size="mini" @click="exportJsonFile">
                    导出JSON文件
                </el-button>

                <el-button
                    icon="el-icon-circle-close"
                    size="mini"
                    @click="$emit('update:visible', false)"
                >
                    关闭
                </el-button>
            </div>
            <div id="editorJson" class="json-editor" />
        </el-drawer>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

::v-deep .el-drawer__header {
    display: none;
}

@include action-bar;

.json-editor {
    height: calc(100vh - 50px);
}
</style>
