## 控件自定义扩展配置项

-   changeTag: boolean 组件类型; true ? show : false
-   componentName: string 组件名; !undefined ? show : false
-   label: string 标题; !undefined ? show : false
-   layout: 布局模式 标题; !undefined && type !== undefiend ? show : false
-   span: number 表单栅格 ; !undefined ? show : false
-   gutter: number 栅格间隔 ; !undefined && layout === 'rowFormItem' ? show : false
-   labelWidth: number 标签宽度 ; !undefined ? show : false
-   buttonText: string 按钮文字; !undefined ? show : false
-   defaultValue: any 默认值; **vModel** !== undefined ? show : false1
-   fileSize: number 文件大小 ; !undefined ? show : false
    -   sizeUnit: string 文件大小单位
-   optionType: string 选项样式; !undefined ? show : false
-   showLabel: boolean 显示标签; showLabel && labelWidth ? show : false
-   border: boolean 是否带边框; !undefined ? show : false
-   showTip: boolean 显示提示; !undefined ? show : false

*   tag

    -   el-checkbox-group
        -   activeData.min: number 至少应选
        -   activeData.max: number 最多可选
        -   activeData.**slot**.options 选项
    -   el-radio-group
        -   activeData.**slot**.options 选项
    -   el-select

        -   activeData.**slot**.options 选项


    -   el-button
        -   activeData.icon: string 按钮图标
        -   activeData.type: string 按钮类型
    -   el-cascader

        -   activeData.separator: string 请输入选项分隔符
        -   activeData.**config**.dataType: string 数据类型
            -   url 接口地址
            -   method 请求类型
            -   dataPath 数据位置
        -   activeData.props.props.multiple: boolean 是否多选
        -   activeData.show-all-levels: boolean 展示全路径
        -   activeData.filterable: boolean 可否筛选



    -   el-input-number

        -   activeData.min: number 最小值
        -   activeData.max: number 最大值
        -   activeData.step: number 步长
        -   activeData.precision: number 精度
        -   activeData.controls-position: string 按钮位置
        -   activeData.step-strictly: boolean 严格步数

    -   el-slider
        -   activeData.max: number 最大值
        -   activeData.min: number 最小值
        -   activeData.step: number 步长
    -   el-date-picker
        -   activeData.type 时间类型
    -   el-color-picker
        -   activeData.color-format 颜色格式
    -  el-upload
        - activeData.color-format

## 组件默认属性配置

-   placeholder: string 占位提示; !undefined ? show : false
-   start-placeholder: string 开始占位; !undefined ? show : false
-   end-placeholder: string 结束占位; !undefined ? show : false
-   justify: string 水平排列; !undefined && type === 'flex' ? show : false
-   align: string 垂直排列; !undefined && type === 'flex' ? show : false
-   style.width: string 组件宽度 ; !undefined ? show : false
-   **slot**.prepend: string 前缀; !undefined ? show : false
-   **slot**.append: string 后缀; !undefined ? show : false
-   prefix-icon: string 前图标; !undefined ? show : false
-   suffix-icon: string 后图标; !undefined ? show : false
-   autosize: object !undefined ? show : false
    -   minRows: number 最小行数
    -   maxRows: number 最大行数
-   height: number 组件高度; !undefined ? show : false
-   maxlength: string 最多输入; !undefined ? show : false
-   active-text: string 开启提示; !undefined ? show : false
-   inactive-text: string 关闭提示; !undefined ? show : false
-   active-value: string 开启值; !undefined ? show : false
-   inactive-value: string 关闭值; !undefined ? show : false
-   name: string 文件字段名; !undefined ? show : false
-   accept: string 文件类型; !undefined ? show : false
-   action: string 上传地址; !undefined ? show : false
-   list-type: string 列表类型; !undefined ? show : false
-   **slot**.default: string 按钮文字; tag === 'el-button' ? show : false
-   range-separator: string 分隔符; !undefined ? show : false
-   picker-options: object 时间段; !undefined ? show : false
    -   selectableRange 时间段
-   format: string 时间格式; !undefined ? show : false
-   props.props: object 组件属性键名; !undefined ? show : false

    -   label
    -   value
    -   children

-   active-color: string 开启颜色; !undefined ? show : false
-   inactive-color: string 关闭颜色; !undefined ? show : false
-   branding: boolean 品牌烙印; !undefined ? show : false
-   allow-half: boolean 允许半选; !undefined ? show : false
-   show-text: boolean 辅助文字; !undefined ? show : false
-   show-scoret: boolean 显示分数; !undefined ? show : false
-   show-stops: boolean 显示间断点; !undefined ? show : false
-   show-text: boolean 辅助文字; !undefined ? show : false
-   range: boolean 范围选择; !undefined ? show : false
-   size: string 组件尺寸; !undefined ? show : false
-   show-word-limit: boolean 输入统计; !undefined ? show : false
-   clearable: boolean 能否清空; !undefined ? show : false
