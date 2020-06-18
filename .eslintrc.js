module.exports = {
  'env': {
    'node': true,
    'browser': true,
    'amd': true,
    'es6': true
  },
  'parser': 'babel-eslint',
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended'  // 新增
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'plugins': [
    'react',
    'react-hooks'  // 新增
  ],
  'rules': {
    'react/jsx-uses-react': 1,
    'react-hooks/rules-of-hooks': 'error', // 检查 Hook 的规则
    'react-hooks/exhaustive-deps': 'warn', // 检查 effect 的依赖
    'react/no-access-state-in-setstate': 0, // 禁止在setstate中使用setstate
    'react/jsx-wrap-multilines': 1, // 防止多行JSX周围缺少括号
    'react/jsx-tag-spacing': [1, { // 验证JSX左括号和右括号中和周围的空格
      'closingSlash': 'never',
      'beforeSelfClosing': 'always',
      'afterOpening': 'never'
    }],
    // 'react/jsx-space-before-closing': 1, // 在JSX中关闭括号之前验证间距
    'react/jsx-props-no-multi-spaces': 1, // 在内联JSX道具之间禁止使用多个空格
    "react/jsx-curly-spacing": [1, {// 在JSX属性和表达式中的花括号内强制或不允许空格
      "when": "always",
      "spacing": {
        "objectLiterals": "never"
      }
    }],
    "react/jsx-equals-spacing": [1, "never"], // 强制或禁止JSX属性中等号周围的空格
    'accessor-pairs': 1, // getter与setter同时存在
    'arrow-spacing': [1, { // 箭头前后加空格
      'before': true,
      'after': true
    }],
    'block-spacing': [1, 'always'], // 标记块前后需加空格
    'brace-style': [1, '1tbs', { // 函数()与{}不许换行
      'allowSingleLine': true
    }],
    'camelcase': [0, { // 不强制使用驼峰命名
      'properties': 'always'
    }],
    'comma-dangle': [1, 'never'], // 不允许尾随逗号
    'comma-spacing': [1, { // 在逗号前后不允许有空格
      'before': false,
      'after': true
    }],
    'constructor-super': 1, // constructor必须配合super()
    'curly': [1, 'multi-line'], // 花括号行内可省略，块级必须加花括号
    'dot-location': [1, 'property'], // 在点之前和之后强制换行
    'eol-last': 1, // 在文件末尾要求或禁止换行
    'eqeqeq': [1, 'allow-null'], // 全等
    'generator-star-spacing': [1, { // generator内前后增加空位
      'before': true,
      'after': true
    }],
    'handle-callback-err': [1, '^(err|error)$'], // 强制执行回调错误处理
    'indent': [1, 2, { // 缩进规则
      'SwitchCase': 1
    }],
    'jsx-quotes': [1, 'prefer-single'], // 强制在JSX属性（jsx引号）中一致使用双引号或单引号
    'key-spacing': [1, { // 键间距
      'beforeColon': false,
      'afterColon': true
    }],
    'keyword-spacing': [1, { // 关键字间距
      'before': true,
      'after': true
    }],
    'new-cap': [1, { // 要求构造函数名称以大写字母
      'newIsCap': true,
      'capIsNew': false
    }],
    'new-parens': 1, // 不带参数（新括号）调用构造函数时需要括号
    'no-debugger': 1,
    'no-array-constructor': 1, // 禁止使用Array构造函数
    'no-console': 0, // 允许使用console
    'no-class-assign': 1, // 禁止修改类声明的变量
    'no-cond-assign': 1, // 在条件语句中禁止赋值运算符
    'no-const-assign': 1, // 禁止修改使用const声明的变量
    'no-control-regex': 0, // 禁止在正则表达式中使用控制字符
    'no-delete-var': 1, // 禁止删除变量
    'no-dupe-args': 1, // 禁止在function定义中使用重复的参数
    'no-dupe-class-members': 2, // 禁止使用重复名称
    'no-dupe-keys': 2, // 禁止在对象文字中使用重复键
    'no-duplicate-case': 2, // 禁止重复案例标签的规则
    'no-empty-character-class': 1, // 禁止在正则表达式中使用空字符类
    'no-empty-pattern': 2, // 禁止使用空的销毁模式
    'no-eval': 0, // 禁止使用eval()
    'no-ex-assign': 1, // 禁止在catch子句中重新分配异常
    'no-extend-native': 2, // 禁止扩展本机对象
    'no-extra-bind': 1, // 禁止不必要的功能绑定
    'no-extra-boolean-cast': 1, // 禁止不必要的布尔类型转换
    'no-extra-parens': [1, 'functions'], // 禁止不必要的括号
    'no-fallthrough': 1, // 禁止案例陈述失败
    'no-floating-decimal': 1, // 禁止浮动小数
    'no-func-assign': 2, // 禁止重新分配function声明
    'no-implied-eval': 2, // 禁止隐含eval（）
    'no-inner-declarations': [2, 'functions'], // 禁止function在嵌套块中使用变量或声明
    'no-invalid-regexp': 1, // 禁止在RegExp构造函数中使用无效的正则表达式字符串
    'no-irregular-whitespace': 1, // 禁止不规则空格
    'no-iterator': 0, // 允许迭代器
    'no-label-var': 2, // 禁止使用标签作为变量名
    'no-labels': [2, { // 禁止带标签的语句
      'allowLoop': false,
      'allowSwitch': false
    }],
    'no-lone-blocks': 2, // 禁止不必要的嵌套块
    'no-mixed-spaces-and-tabs': 1, // 不允许使用缩进的空格和制表符进行缩进
    'no-multi-spaces': 1, // 禁止多个空格
    'no-multi-str': 2, // 禁止多行字符串
    'no-multiple-empty-lines': [1, { // 禁止多行空行
      'max': 1
    }],
    'no-native-reassign': 2, // 禁止重新分配本机对象
    'no-negated-in-lhs': 2, // 不允许在in表达式中取反左操作数
    'no-new-object': 0, // 允许Object构造函数
    'no-new-require': 0, // 允许新要求
    'no-new-symbol': 2, // 禁止符号构造器
    'no-new-wrappers': 1, // 禁止原始包装器实例
    'no-obj-calls': 1, // 禁止将全局对象属性作为函数调用
    'no-octal': 2, // 禁止使用八进制文字
    'no-octal-escape': 2, // 禁止在字符串文字中使用八进制转义序列
    'no-path-concat': 2, // 使用__dirname和__filename时禁止字符串连接
    'no-proto': 1, // 禁止__proto__
    'no-redeclare': 1, // 禁止重新声明变量
    'no-regex-spaces': 1, // 禁止在正则表达式文字中使用多个空格
    'no-return-assign': [2, 'except-parens'], // 禁止在return语句中进行赋值
    'no-self-assign': 1, // 禁止自我分配
    'no-self-compare': 1, // 禁止自我比较
    'no-sequences': 2, // 禁止使用逗号运算符
    'no-shadow-restricted-names': 2, // 禁止隐藏限制名称
    'no-spaced-func': 1, // 不允许在函数标识符及其应用程序之间使用空格
    'no-sparse-arrays': 1, // 禁止稀疏数组
    'no-this-before-super': 0, // 在调用构造函数之前，允许使用this
    'no-throw-literal': 1, // 限制可以作为异常抛出的内容
    'no-trailing-spaces': 1, // 在行尾禁止尾随空格
    'no-undef': 2, // 禁止未声明的变量
    'no-undef-init': 1, // 禁止初始化为未定义
    'no-unexpected-multiline': 2, // 禁止混淆多行表达式
    'no-unmodified-loop-condition': 2, // 禁止未经修改的循环条件
    'no-unneeded-ternary': [1, { // 存在更简单的选择时禁止三元运算符
      'defaultAssignment': false
    }],
    'no-unsafe-finally': 2, // 禁止以finally块为单位的控制流语句
    'no-unused-vars': [1, { // 禁止使用未使用的变量
      'vars': 'all',
      'args': 'none'
    }],
    'no-useless-call': 1, // 禁止不必要的.call()和.apply()
    'no-useless-computed-key': 1, // 禁止在对象上使用不必要的计算属性键
    'no-useless-constructor': 1, // 禁止不必要的构造函数
    'no-useless-escape': 0, // 禁止不必要的转义使用
    'no-whitespace-before-property': 1, // 禁止在属性前使用空格
    'no-with': 2, // 禁止with
    'one-var': [1, { // 强制变量在函数中一起声明或一起声明
      'initialized': 'never'
    }],
    'operator-linebreak': [1, 'after', { // 对操作员实施一致的换行符样式
      'overrides': {
        '?': 'before',
        ':': 'before'
      }
    }],
    'quotes': [1, 'single', { // 强制使用引号，双引号或单引号（引号）的一致使用
      'avoidEscape': true,
      'allowTemplateLiterals': true
    }],
    'semi': [1, 'never'], // 分号的使用
    'semi-spacing': [1, { // 在分号之前和之后加强间距
      'before': false,
      'after': true
    }],
    'object-curly-spacing': [1, "always", { "objectsInObjects": false }], // 大括号间距
    'spaced-line-comment': [0, 'always'], // 注释后面需加一个空格
    'space-before-blocks': [1, 'always'], // 要求或禁止在块前加空格
    'space-before-function-paren': [1, 'never'], // 函数括号前需要或不允许空格
    'space-in-parens': [1, 'never'], // 禁止或在括号内使用空格
    'space-infix-ops': 1, // 要求在中缀运算符之间加空格
    'space-unary-ops': [1, { // 一元运算符之前或之后需要空格或不允许空格
      'words': true,
      'nonwords': false
    }],
    'spaced-comment': [1, 'always', { // 要求或不允许以空格（制表符或制表符）开头的注释
      'markers': ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',', ' ']
    }],
    'template-curly-spacing': [1, 'always'], // 在模板字符串中强制使用间距
    'use-isnan': 2, // isNaN()检查时需要调用NaN
    'valid-typeof': 2, // 强制比较typeof表达式与有效字符串
    'wrap-iife': [1, 'any'], // 要求将IIFE包裹起来
    'yield-star-spacing': [1, 'both'], // 强制间距围绕*在yield*表达式
    'yoda': [1, 'never'], // 要求或禁止Yoda条件
    'prefer-const': 1, // 建议使用const
    'array-bracket-spacing': [1, 'never'], // 禁止或在方括号内加空格
    'react/prop-types': 0,
  },
  'settings': {
    'react': {
      'version': '16.8.6'      // 新增
    }
  }
}