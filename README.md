# PinPinBall

经典弹球小游戏，触摸屏幕方案。横屏 Canvas 物理弹球：发射区为双圆喉口，重力水平向右；击碎带血几何砖块得分，砖块整列向左推进。

## 运行

需要本地静态服务（ES 模块不能直接用 `file://` 打开）。

```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```

浏览器访问 `http://127.0.0.1:8765/`。画布逻辑尺寸 **904×572**，窗口按比例 contain，黑边留白。

GitHub 仓库：<https://github.com/YYlee-orange/PinPinBall.github.io>  
Pages（若已开启）：<https://yylee-orange.github.io/PinPinBall.github.io/>

## 玩法摘要

- 触屏/鼠标按住瞄准，松开发射；多球呈珠串同向发出
- 全部回收后才能再射；随后砖块左移并在最右刷一行
- 增球节点复制小球；爆炸节点毁球并对 3×3 砖块造成伤害
- 失败：砖块越过红色虚线死亡线，或持球数为 0

## 更新日志

### 2026-09-11

- 初版：纯 Canvas、原生 JS，无第三方物理库
- 双圆发射区、切线扇区、珠串齐射、右侧回收（可弹一次再升回）
- 砖区占右侧 65%，最多 6 列；上下 10% 禁刷带加墙
- 砖块四种形状、随机转角、1～1.4 倍大小、多色相深浅随血量
- 血量上限 0～2 分钟从 5 线性升至 27，其后 1～27 随机
- 爆炸橙色扩散圆环；本地最高分；暂停/分数 HUD
- 同步至 GitHub 仓库 `YYlee-orange/PinPinBall.github.io`
