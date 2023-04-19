import {
  Sprite,
  SpriteAtlas,
  _decorator,
  Node,
  UITransform,
  Layers,
  math,
  tween,
  v3,
  Label,
  log,
  error,
  instantiate,
  warn,
} from "cc";
import { BaseSystem } from "./BaseSystem";
import { ResourceManager, SceneManager } from "../Manager";
import { AB_KEY } from "../Data";
import { throttle, shuffle } from "../Utils";

const { ccclass } = _decorator;

@ccclass("SceneRockCandySystem")
export class SceneRockCandySystem extends BaseSystem {
  private sticks = [
    ...Array(5).fill(3),
    ...Array(7).fill(2),
    ...Array(13).fill(1),
  ];

  private showSticks = [];
  private score = 0;
  private scoreLabel = null;

  private sticksSprite = [];
  private stickNode: Node = null;
  private showStickNode = null;
  private isFail = false; // 失败了。
  private restartBtn = null;
  protected onLoad(): void {
    super.onLoad();
    // console.log("SceneRockCandySystem");

    // 读取签的精灵图片
    const stickAtlas = ResourceManager.instance.getAsset(
      AB_KEY.GUI,
      AB_KEY.GUI_STICKS_ATLAS,
      SpriteAtlas
    );

    // 读取3个精灵
    Array.from({ length: 3 }).forEach((_, k) => {
      this.sticksSprite.push(stickAtlas.getSpriteFrame(`stick${k + 1}`));
    });

    this.stickNode = this.entities.get("Sticks");
    this.showStickNode = this.entities.get("ShowSticks");
    this.restartBtn = this.entities.get("Restart")
    this.scoreLabel = this.entities.get("Score").getComponent(Label);
    this.scoreLabel.string = this.format(this.score);
  }

  private format(n) {
    return (String(n) as any).padStart(2, "0");
  }

  protected start(): void {
    // 生成创建 stick 签
    this.sticks = shuffle(this.sticks);
    console.log("this.sticks", this.sticks);

    for (const [index, value] of this.sticks.entries()) {
      console.log("index", index, value);
      this.createStick(index, value);
    }

    const children = this.stickNode.children;
    // console.log("children", children);
    children.forEach((node) => {
      tween(node)
        .to(Math.random(), { position: v3(0, 0) })
        .start();
    });

    this.scheduleOnce(() => {
      children.forEach((node) => {
        const x = Math.floor(Math.random() * 50);
        const angle = 180 + Math.floor((Math.random() - 0.5) * 50);

        tween(node)
          .to(Math.random() * 0.5, { angle, position: v3(x, 0) })
          .start();
      });
    }, 1);

    const OneSprite = this.entities.get("One");
    const TwoSprite = this.entities.get("Two");
    const RestartSprite = this.entities.get("Restart");
    this.addButtonListen(OneSprite, this.handleOne, this);
    this.addButtonListen(TwoSprite, this.handleTwo, this);
    this.addButtonListen(RestartSprite, this.handleRestart, this);

    // tween()
  }

  private handleOne = (check = true) => {
    if (this.isFail) {
      error("失败了");
      return;
    }
    // 随机抽一根
    if (!this.sticks.length) {
      log("已经抽完了");
      return;
    }
    // console.log("this.stickNode.children", this.stickNode.children);
    // return
    const n = math.randomRangeInt(0, this.sticks.length);

    /**
     * 数据处理
     */
    const v = this.sticks.splice(n, 1);
    console.log("抽到的是：%o, 抽到的是第%o个", v[0], n);
    this.showSticks.push(v[0]);

    // console.log("this.stickNode", );
    /**
     * 精灵处理
     */
    // const findNode = this.stickNode.children[n];
    const vs = this.stickNode.children.splice(n, 1);
    const findNode = vs[0];
    const newNode = instantiate(findNode);
    // findNode.destroy();
    // console.log("this.showStickNode.children", this.showStickNode.children);
    const len = this.showStickNode.children.length;

    newNode.angle = 0;
    newNode.setPosition(v3(len * 28));
    this.showStickNode.addChild(newNode);

    this.score += v[0];
    this.scoreLabel.string = this.format(this.score);

    // console.log("this.stickNode.children", this.stickNode.children, this.stickNode.children.length);
    if (check) {
      this.check();
    }
  };

  private handleTwo = () => {
    if (this.isFail) {
      alert("已经失败了")
      error("失败了");
      return;
    }

    if (this.stickNode.children.length < 2) {
      alert("你只能再抽一根了")
      warn("只能再抽一根了");
      return;
    }
    this.handleOne(false);
    this.handleOne(false);
    this.check();
    // handleOne
    // console.log("two");
  };

  private handleRestart = () => {
    console.log("重启");
    this.restartBtn.active = false;
    SceneManager.instance.sceneRestart(AB_KEY.ENTITY_SCENE_ROCK_CANDY);
  };

  private check() {
    // 查看是否失败了
    const sum = this.showSticks.reduce((acc, cur) => acc + cur, 0);
    if (sum % 5 === 0) {
      // 失败了
      this.isFail = true;
      error("验证，你已经失败了");
      this.restartBtn.active = true;
      alert("你已经输了");
      return;
    }

    if (this.showSticks.length === 25) {
      // 25根都抽完了，赢了
      alert("你赢了");
      this.restartBtn.active = true;
      log("你赢了");
    }
  }

  private createStick(index, value) {
    const node = new Node(`stick${index}`);
    // const node = new Node();
    const x = Math.floor((Math.random() - 0.5) * 600);
    node.setPosition(x, 0);
    node.angle = 180;

    const sprite = node.addComponent(Sprite);
    sprite.spriteFrame = this.sticksSprite[value - 1];

    this.stickNode.addChild(node);
    // console.log("2...");
  }
}
